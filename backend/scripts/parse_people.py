"""
Parse all avert-people HTML files and rebuild data/people.json with:
- Clean bio (no publications mixed in)
- Structured publications array
- Correct title, institution, image_url, email
- New Kye Allen entry added
"""

import json
import os
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
HTML_DIR = ROOT / "avert-people"
DATA_FILE = ROOT / "data" / "people.json"

# Map HTML filename stem -> JSON slug (for mismatches)
SLUG_MAP = {
    "haily-tran-1": "haily-tran",
    "julia-ebner-1": "julia-ebner",
    "josh-roose": "joshua-roose",
    "maya-arguello": "maya-argello-gomez",
    "mimi-fabe": "amparo-pamela-fabe",
    "primitivo-iii-ragandang": "primitivo-iii-cabanes-ragandang",
    "sissl-haugdal-jore": "sissel-haugdal-jore",
    "zainab-alattar": "zainab-al-attar",
    "kye-allen": "kye-allen",  # new entry - will be created
}

# Logo/site images to exclude (not headshots)
LOGO_PATTERNS = ["AVERT_Primary", "AVERT_Mark", "AVERT_mark"]

SECTION_HEADERS = {
    "key\xa0publications", "key publications", "publications",
    "journal articles", "journal article", "book chapters", "book chapter",
    "books", "book", "reports", "report", "grants and projects",
    "analyses & commentary", "analyses and commentary", "theses", "thesis",
    "conference papers", "working papers", "monographs", "edited volumes",
    "policy reports", "other publications", "research reports",
    "journal articlesfar-right",  # malformed one
}

PUB_SECTION_TYPES = {
    "journal articles", "journal article",
    "book chapters", "book chapter",
    "books", "book",
    "reports", "report",
    "grants and projects",
    "analyses & commentary", "analyses and commentary",
    "theses", "thesis",
    "conference papers",
    "working papers",
    "monographs",
    "edited volumes",
    "policy reports",
    "other publications",
    "research reports",
}

FOOTER_MARKERS = {
    "back to avert members page",
    "back to avert member page",
    "social media",
    "we acknowledge the traditional custodians",
    "subscribe",
    "sign up with your email address",
}


class PersonPageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._skip = False
        self._pending_tag = None
        self._a_texts = []
        # Raw text node sequence
        self.nodes = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip = True
        if tag == "a":
            self._a_texts = []
            self._pending_tag = "a"
        if tag == "img":
            d = dict(attrs)
            src = d.get("src", "") or d.get("data-src", "")
            if (
                "squarespace-cdn.com/content" in src
                and not any(lp in src for lp in LOGO_PATTERNS)
            ):
                self.nodes.append(("IMG", src))

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = False
        if tag == "a" and self._pending_tag == "a":
            combined = " ".join(self._a_texts).strip()
            if combined:
                self.nodes.append(("TEXT", combined))
            self._pending_tag = None
            self._a_texts = []

    def handle_data(self, data):
        if self._skip:
            return
        s = data.strip()
        if not s:
            return
        if self._pending_tag == "a":
            self._a_texts.append(s)
        else:
            self.nodes.append(("TEXT", s))


def canonical_section(text: str) -> str | None:
    """Return canonical pub section name if text is a section header, else None."""
    t = text.strip().lower()
    if t in PUB_SECTION_TYPES:
        return text.strip().title()
    return None


def is_footer(text: str) -> bool:
    t = text.strip().lower()
    return any(t.startswith(m) for m in FOOTER_MARKERS)


def parse_html(path: Path) -> dict:
    """Parse a person HTML file. Returns extracted fields."""
    with open(path, encoding="utf-8", errors="replace") as f:
        html = f.read()

    parser = PersonPageParser()
    parser.feed(html)
    nodes = parser.nodes  # list of ("TEXT"|"IMG", value)

    texts = [v for kind, v in nodes if kind == "TEXT" and len(v) > 1]
    img_srcs = [v for kind, v in nodes if kind == "IMG"]

    # --- Find content start: person's name appears ~index 65-90 ---
    # The Squarespace pages have nav, header, etc. before the content.
    # The person's name appears after the nav boilerplate.
    # Heuristic: find the person's name heading (has "Dr"/"Prof"/etc. or is short enough to be a name)
    # We look for the first text after index 50 that looks like a name.

    content_start = None
    for i, t in enumerate(texts[50:], start=50):
        # Name line is typically short (< 80 chars) and appears right before "Institution" or role text
        if i + 1 < len(texts) and texts[i + 1] in ("Institution", "Research Area Keywords", "Contact:"):
            content_start = i
            break
        # Fallback: "About X" heading pattern
        if t.startswith("About ") and len(t) < 60:
            content_start = max(0, i - 5)
            break

    if content_start is None:
        content_start = 60  # fallback

    working = texts[content_start:]

    # Extract structured fields
    name = ""
    institution = ""
    research_areas = ""
    email = ""
    bio_lines = []
    image_url = img_srcs[0] if img_srcs else ""

    # State machine
    i = 0
    while i < len(working):
        t = working[i]
        tl = t.lower().strip()

        if is_footer(t):
            break

        if tl == "institution" and i + 1 < len(working):
            institution = working[i + 1]
            i += 2
            continue

        if tl == "research area keywords" and i + 1 < len(working):
            research_areas = working[i + 1]
            i += 2
            continue

        if tl == "contact:" and i + 1 < len(working):
            email = working[i + 1].strip()
            i += 2
            continue

        # Name: first meaningful text (short, may have Dr/Prof)
        if not name and i == 0:
            name = t
            i += 1
            continue

        # "About X" heading signals start of bio
        if t.startswith("About ") and len(t) < 60:
            i += 1
            continue

        # Check for publications section start
        if tl in ("key\xa0publications", "key publications"):
            break  # bio ends here, publications section follows

        if canonical_section(t):
            break  # bio ends here

        # Collect bio text
        if not name:
            name = t
        else:
            bio_lines.append(t)

        i += 1

    bio = "\n".join(bio_lines).strip()

    # --- Parse publications from the rest ---
    # Find where "Key Publications" or first section starts
    pub_start = None
    for j, t in enumerate(working):
        tl = t.lower().strip()
        if tl in ("key\xa0publications", "key publications", "publications"):
            pub_start = j + 1
            break
        if canonical_section(t) and j > 0:
            pub_start = j
            break

    publications = []
    if pub_start is not None:
        pub_texts = working[pub_start:]
        current_section = None
        current_items = []
        # Items come in groups of: title, authors, "Read"/"Link"/url
        pending_title = None
        pending_authors = None

        def flush_item():
            nonlocal pending_title, pending_authors
            if pending_title and current_section:
                item = {"title": pending_title}
                if pending_authors:
                    item["authors"] = pending_authors
                current_items.append(item)
            pending_title = None
            pending_authors = None

        def flush_section():
            nonlocal current_section, current_items
            if current_section and current_items:
                publications.append({"type": current_section, "items": current_items})
            current_section = None
            current_items = []

        for t in pub_texts:
            if is_footer(t):
                flush_item()
                flush_section()
                break

            sec = canonical_section(t)
            if sec:
                flush_item()
                flush_section()
                current_section = sec
                pending_title = None
                pending_authors = None
                continue

            tl = t.lower().strip()
            if tl in ("read", "link", "view", "download", "access here", "open access"):
                flush_item()
                continue

            # Distinguish title from authors heuristic:
            # Authors are short (< 100 chars) and don't contain parentheses with year
            # Titles often contain years in parentheses or are longer
            if pending_title is None:
                pending_title = t
            elif pending_authors is None:
                # Check if this could be authors (no year in parens at end typical of titles)
                if re.search(r'\(\d{4}\)\s*$', pending_title):
                    # pending_title has year = it's the title, this is authors
                    pending_authors = t
                elif len(t) < 120 and not re.search(r'\(\d{4}\)', t):
                    pending_authors = t
                else:
                    # Two consecutive titles - flush first, restart
                    flush_item()
                    pending_title = t
            else:
                # Already have title + authors, this is a new title
                flush_item()
                pending_title = t

        flush_item()
        flush_section()

    # Also grab "Grants and Projects" section
    for j, t in enumerate(working):
        if t.lower().strip() == "grants and projects":
            grants_items = []
            k = j + 1
            while k < len(working):
                gt = working[k]
                if is_footer(gt):
                    break
                sec = canonical_section(gt)
                if sec and sec.lower() != "grants and projects":
                    break
                grants_items.append(gt)
                k += 1
            if grants_items:
                # Check if grants already in publications
                already = any(p["type"].lower() == "grants and projects" for p in publications)
                if not already:
                    publications.append({"type": "Grants and Projects", "items": [{"title": g} for g in grants_items if not is_footer(g)]})
            break

    return {
        "name": name,
        "institution": institution,
        "research_areas": research_areas,
        "email": email,
        "bio": bio,
        "image_url": image_url,
        "publications": publications,
    }


def main():
    # Load existing people.json
    with open(DATA_FILE, encoding="utf-8") as f:
        existing = json.load(f)

    # Index by slug
    by_slug = {p["slug"]: p for p in existing}

    # Build reverse map: html_stem -> slug
    html_to_slug = {}
    for html_file in HTML_DIR.glob("*.html"):
        stem = html_file.stem
        slug = SLUG_MAP.get(stem, stem)
        html_to_slug[stem] = slug

    # Parse each HTML file
    parsed = {}
    for html_file in sorted(HTML_DIR.glob("*.html")):
        stem = html_file.stem
        slug = SLUG_MAP.get(stem, stem)
        print(f"Parsing {stem} -> {slug}")
        try:
            data = parse_html(html_file)
            parsed[slug] = data
        except Exception as e:
            print(f"  ERROR: {e}")

    # Build new people list
    new_people = []

    # Process existing entries (update from HTML)
    for person in existing:
        slug = person["slug"]
        html_data = parsed.get(slug)

        if html_data is None:
            # No HTML file found (e.g. Adrian Cherney) - keep as-is
            print(f"No HTML for {slug} - keeping existing")
            new_people.append(person)
            continue

        # Merge: HTML data takes priority for: name, institution, bio, email, image_url, publications
        # Keep from JSON: slug, role, headshot (local file), research_areas (prefer HTML if non-empty)
        updated = dict(person)

        # Name from HTML (strip HTML entities)
        if html_data["name"]:
            updated["name"] = html_data["name"].replace("—", "-").strip()

        # Title: the name from HTML is often "Dr X" or "Prof X" - use as title
        # But fix the bad title values (those that are section headers)
        bad_titles = {
            "journal articles", "journal article", "books", "book chapters",
            "social media", "about mia", "about jared", "about sarah",
        }
        current_title = person.get("title", "").lower()
        if any(current_title.startswith(bt) for bt in bad_titles) or len(current_title) > 80:
            # Replace with name from HTML (which already has Dr/Prof)
            updated["title"] = html_data["name"].replace("—", "-").strip()

        # Institution
        if html_data["institution"]:
            updated["institution"] = html_data["institution"]

        # Research areas: prefer HTML if non-empty
        if html_data["research_areas"]:
            updated["research_areas"] = html_data["research_areas"]

        # Email
        if html_data["email"]:
            updated["email"] = html_data["email"]

        # Bio: use HTML bio (clean, no publications)
        if html_data["bio"]:
            updated["bio"] = html_data["bio"]

        # Image URL: update with latest from HTML
        if html_data["image_url"]:
            updated["image_url"] = html_data["image_url"]

        # Publications: always use HTML-parsed structured data
        if html_data["publications"]:
            updated["publications"] = html_data["publications"]
        elif "publications" not in updated:
            updated["publications"] = []

        new_people.append(updated)

    # Add Kye Allen if not in existing
    if "kye-allen" not in by_slug:
        html_data = parsed.get("kye-allen")
        if html_data:
            new_people.append({
                "slug": "kye-allen",
                "name": html_data["name"] or "Kye Allen",
                "title": html_data["name"] or "Dr Kye Allen",
                "institution": html_data["institution"],
                "role": "Research Member",
                "research_areas": html_data["research_areas"],
                "bio": html_data["bio"],
                "email": html_data["email"],
                "headshot": "",
                "image_url": html_data["image_url"],
                "publications": html_data["publications"],
            })
            print("Added Kye Allen")

    # Sort alphabetically by last name
    def sort_key(p):
        parts = p["name"].split()
        return parts[-1].lower() if parts else ""

    new_people.sort(key=sort_key)

    # Write output
    out_file = ROOT / "data" / "people_new.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(new_people, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(new_people)} entries to {out_file}")
    print("Review people_new.json then rename to people.json")


if __name__ == "__main__":
    main()
