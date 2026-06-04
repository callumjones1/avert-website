"""
Parse all avert-people HTML files and rebuild data/people.json with:
- Clean bio (no publications mixed in)
- Structured publications array
- Correct name, title, institution, image_url, email
"""

import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
HTML_DIR = ROOT / "avert-people"
DATA_FILE = ROOT / "data" / "people.json"

# HTML filename stem -> JSON slug (only where they differ)
SLUG_MAP = {
    "haily-tran-1": "haily-tran",
    "julia-ebner-1": "julia-ebner",
    "josh-roose": "joshua-roose",
    "maya-arguello": "maya-argello-gomez",
    "mimi-fabe": "amparo-pamela-fabe",
    "primitivo-iii-ragandang": "primitivo-iii-cabanes-ragandang",
    "sissl-haugdal-jore": "sissel-haugdal-jore",
    "zainab-alattar": "zainab-al-attar",
}

LOGO_PATTERNS = ["AVERT_Primary", "AVERT_Mark", "AVERT_mark", "favicon"]

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
    "key\xa0publications", "key publications",
}

# Exact-match footer markers (text nodes that signal end of person content)
FOOTER_MARKERS_EXACT = {
    "social media",
    "subscribe",
}
# Prefix-match footer markers
FOOTER_MARKERS_PREFIX = (
    "back to avert members page",
    "back to avert member page",
    "we acknowledge the traditional custodians",
    "sign up with your email address",
)


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self._skip = False
        self._in_a = False
        self._a_buf = []
        self.texts: list[str] = []
        self.img_srcs: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style"):
            self._skip = True
        elif tag == "a":
            self._in_a = True
            self._a_buf = []
        elif tag == "img" and not self._skip:
            d = dict(attrs)
            src = d.get("src", "") or d.get("data-src", "")
            if (
                "squarespace-cdn.com/content" in src
                and not any(p in src for p in LOGO_PATTERNS)
            ):
                self.img_srcs.append(src)

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self._skip = False
        elif tag == "a":
            combined = " ".join(self._a_buf).strip()
            if combined:
                self.texts.append(combined)
            self._in_a = False
            self._a_buf = []

    def handle_data(self, data):
        if self._skip:
            return
        s = data.strip()
        if not s:
            return
        if self._in_a:
            self._a_buf.append(s)
        else:
            self.texts.append(s)


def is_footer(t: str) -> bool:
    tl = t.strip().lower()
    return tl in FOOTER_MARKERS_EXACT or any(tl.startswith(m) for m in FOOTER_MARKERS_PREFIX)


def is_badge(t: str) -> bool:
    """Navigation/role badge text that appears before the person's name."""
    tl = t.lower().strip()
    badges = {
        "affiliate membership", "research membership", "executive committee membership",
        "coordinator membership", "convenor membership",
    }
    return tl in badges or tl.endswith("membership")


def canonical_pub_section(t: str) -> str | None:
    """Return normalised section name if t is a publications section header."""
    tl = t.strip().lower()
    if tl in PUB_SECTION_TYPES:
        # Normalise
        mapping = {
            "key\xa0publications": None, "key publications": None,
            "journal articles": "Journal Articles", "journal article": "Journal Articles",
            "book chapters": "Book Chapters", "book chapter": "Book Chapters",
            "books": "Books", "book": "Books",
            "reports": "Reports", "report": "Reports",
            "grants and projects": "Grants and Projects",
            "analyses & commentary": "Analyses & Commentary",
            "analyses and commentary": "Analyses & Commentary",
            "theses": "Theses", "thesis": "Theses",
            "conference papers": "Conference Papers",
            "working papers": "Working Papers",
            "monographs": "Monographs",
            "edited volumes": "Edited Volumes",
            "policy reports": "Reports",
            "other publications": "Other Publications",
            "research reports": "Reports",
        }
        return mapping.get(tl, t.strip().title())
    return None


SKIP_AS_PUB_TEXT = {"read", "link", "view", "download", "access here", "open access", "pdf", "preprint"}


def parse_html(path: Path) -> dict:
    with open(path, encoding="utf-8", errors="replace") as f:
        html = f.read()

    parser = PageParser()
    parser.feed(html)
    texts = parser.texts
    image_url = parser.img_srcs[0] if parser.img_srcs else ""

    # --- Locate "Institution" label to anchor extraction ---
    inst_idx = None
    for i, t in enumerate(texts):
        if t.strip() == "Institution" and i > 50:
            inst_idx = i
            break

    name = ""
    title = ""
    institution = ""
    research_areas = ""
    email = ""

    if inst_idx is not None:
        institution = texts[inst_idx + 1] if inst_idx + 1 < len(texts) else ""

        # Determine name and optional title from 1-2 slots before Institution
        prev1 = texts[inst_idx - 1] if inst_idx >= 1 else ""
        prev2 = texts[inst_idx - 2] if inst_idx >= 2 else ""

        def looks_like_name(t):
            if is_badge(t):
                return False
            if len(t) > 100:
                return False
            if t.startswith("Open Menu") or t.startswith("Close Menu"):
                return False
            return True

        if is_badge(prev1):
            # [badge, Institution] — name must be further back
            name = prev2 if looks_like_name(prev2) else prev1
        elif is_badge(prev2) and looks_like_name(prev1):
            # [badge, name, Institution]
            name = prev1
        elif looks_like_name(prev2):
            # [name, title, Institution]
            name = prev2
            title = prev1
        else:
            name = prev1

        # Scan forward from inst_idx+2 for research areas, email, bio
        i = inst_idx + 2
        while i < len(texts):
            t = texts[i]
            tl = t.strip().lower()

            if is_footer(t):
                break

            if tl == "research area keywords" and i + 1 < len(texts):
                research_areas = texts[i + 1]
                i += 2
                continue

            if tl.startswith("contact:"):
                rest = t[8:].strip()
                if rest and "@" in rest:
                    email = rest
                elif i + 1 < len(texts) and "@" in texts[i + 1]:
                    email = texts[i + 1]
                    i += 1
                i += 1
                continue

            # "About X" heading = bio starts next
            if t.startswith("About ") and len(t) < 60:
                i += 1
                break

            i += 1

        # --- Bio: collect from after "About X" to before "Key Publications" or section ---
        bio_lines = []
        hit_key_pubs = False
        while i < len(texts):
            t = texts[i]
            if is_footer(t):
                break
            tl = t.strip().lower()
            if tl in ("key\xa0publications", "key publications"):
                i += 1  # skip the header
                hit_key_pubs = True
                break
            if canonical_pub_section(t) is not None:
                break  # bio ends, publications start (no "Key Publications" header)
            bio_lines.append(t)
            i += 1

        bio = "\n".join(bio_lines).strip()

        # --- Publications: from current i onwards ---
        publications = []
        current_section: str | None = None
        current_items: list[dict] = []
        pending_title: str | None = None
        pending_authors: str | None = None

        def flush_item():
            nonlocal pending_title, pending_authors
            if pending_title and current_section:
                item: dict = {"title": pending_title}
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

        # If we hit "Key Publications" but the next item isn't a section header,
        # default to a generic "Publications" section
        if hit_key_pubs and i < len(texts):
            next_t = texts[i]
            if canonical_pub_section(next_t) is None and not is_footer(next_t):
                current_section = "Publications"

        while i < len(texts):
            t = texts[i]
            i += 1

            if is_footer(t):
                break

            if t.strip().lower() in ("key\xa0publications", "key publications", "publications"):
                flush_item()
                # Just a heading - don't change section unless we need a default
                if current_section is None and i < len(texts):
                    next_t = texts[i]
                    if canonical_pub_section(next_t) is None and not is_footer(next_t):
                        current_section = "Publications"
                continue

            sec = canonical_pub_section(t)
            if sec:
                flush_item()
                flush_section()
                current_section = sec
                continue

            if t.strip().lower() in SKIP_AS_PUB_TEXT:
                flush_item()
                continue

            # Accumulate items
            if current_section is None:
                continue

            if pending_title is None:
                pending_title = t
            elif pending_authors is None:
                # Heuristic: if pending_title has year, this is authors; else check length
                if re.search(r'\(\d{4}\)', pending_title) or len(t) < 120:
                    pending_authors = t
                else:
                    flush_item()
                    pending_title = t
            else:
                flush_item()
                pending_title = t

        flush_item()
        flush_section()

    else:
        # Fallback: couldn't find Institution label (very minimal page)
        bio = ""
        publications = []

    return {
        "name": name.strip(),
        "title": title.strip(),
        "institution": institution.strip(),
        "research_areas": research_areas.strip(),
        "email": email.strip(),
        "bio": bio,
        "image_url": image_url,
        "publications": publications,
    }


BAD_TITLE_PREFIXES = (
    "journal article", "books", "book chapters", "social media",
    "about mia", "about jared", "about sarah",
)


def main():
    with open(DATA_FILE, encoding="utf-8") as f:
        existing: list[dict] = json.load(f)

    by_slug = {p["slug"]: p for p in existing}

    # Parse each HTML file
    parsed: dict[str, dict] = {}
    for html_file in sorted(HTML_DIR.glob("*.html")):
        stem = html_file.stem
        slug = SLUG_MAP.get(stem, stem)
        print(f"  {stem} -> {slug}")
        try:
            parsed[slug] = parse_html(html_file)
        except Exception as e:
            print(f"    ERROR: {e}")

    new_people: list[dict] = []

    for person in existing:
        slug = person["slug"]
        html_data = parsed.get(slug)

        if html_data is None:
            print(f"No HTML for {slug} — keeping as-is")
            new_people.append(person)
            continue

        updated = dict(person)

        # --- Name ---
        if html_data["name"]:
            updated["name"] = html_data["name"]

        # --- Title ---
        # Fix bad title values and update with HTML data
        current_title = person.get("title", "").lower().strip()
        is_bad = (
            any(current_title.startswith(p) for p in BAD_TITLE_PREFIXES)
            or len(current_title) > 80
        )
        html_title = html_data.get("title", "").strip()

        SHORT_TITLE_WORDS = {
            "professor", "associate professor", "senior lecturer", "lecturer",
            "researcher", "fellow", "research fellow", "senior research fellow",
            "postdoctoral", "doctoral", "phd candidate",
        }

        def should_append_title(t: str) -> bool:
            tl = t.lower().strip()
            return len(t) <= 80 and any(w in tl for w in SHORT_TITLE_WORDS)

        if slug == "haily-tran":
            # User said she's not HDR Coordinator anymore - use name from bio ("Dr Haily Tran")
            bio_first = html_data["bio"].split("\n")[0] if html_data["bio"] else ""
            if bio_first.startswith("Dr Haily"):
                updated["title"] = "Dr Haily Tran"
            else:
                updated["title"] = html_data["name"] or "Haily Tran"
        elif slug == "callum-d-jones":
            # Keep existing title field, only fix role
            pass
        elif is_bad or not current_title:
            if html_title and should_append_title(html_title):
                updated["title"] = html_data["name"] + f", {html_title}"
            else:
                updated["title"] = html_data["name"]
        elif html_title and should_append_title(html_title) and html_title not in (person.get("title") or ""):
            updated["title"] = html_data["name"] + f", {html_title}"

        # --- Role ---
        if slug == "callum-d-jones":
            updated["role"] = "Technical Coordinator"

        # --- Institution ---
        if html_data["institution"]:
            updated["institution"] = html_data["institution"]

        # --- Research areas (prefer HTML if non-empty) ---
        if html_data["research_areas"]:
            updated["research_areas"] = html_data["research_areas"]

        # --- Email ---
        if html_data["email"]:
            updated["email"] = html_data["email"]

        # --- Bio ---
        if html_data["bio"]:
            updated["bio"] = html_data["bio"]

        # --- Image URL ---
        if html_data["image_url"]:
            updated["image_url"] = html_data["image_url"]

        # --- Publications ---
        updated["publications"] = html_data["publications"]

        new_people.append(updated)

    # Add Kye Allen (not in existing)
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

    # Sort by last name
    def sort_key(p):
        parts = (p.get("name") or "").split()
        return parts[-1].lower() if parts else ""

    new_people.sort(key=sort_key)

    out = ROOT / "data" / "people_new.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(new_people, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(new_people)} entries to {out}")


if __name__ == "__main__":
    main()
