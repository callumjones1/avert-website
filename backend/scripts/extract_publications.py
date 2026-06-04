"""
Extract structured publication data from avert-people HTML files.

Handles:
  - Journal Articles: title, authors
  - Book Chapters: title, authors, in (book title), editors
  - Books: title, authors
  - Reports / Research Reports: title, authors
  - Grants and Projects: title, authors, funder
  - Theses, Conference Papers, etc: title, authors

Book Chapter HTML patterns (two orderings seen in the wild):
  Pattern A: <h3>title</h3> <p>in <em>book</em>, editors</p> <p>authors</p>
  Pattern B: <h3>title</h3> <p>authors</p> <p>in <em>book</em>, editors</p>

Reads data/people.json, updates publications field, writes data/people_new.json.
"""

import json
import re
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag

ROOT = Path(__file__).parent.parent.parent
HTML_DIR = ROOT / "avert-people"
DATA_FILE = ROOT / "data" / "people.json"
OUT_FILE = ROOT / "data" / "people_new.json"

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

SECTION_NORMALISE = {
    "journal articles": "Journal Articles",
    "journal article": "Journal Articles",
    "book chapters": "Book Chapters",
    "book chapter": "Book Chapters",
    "books": "Books",
    "book": "Books",
    "reports": "Reports",
    "report": "Reports",
    "research reports": "Reports",
    "policy reports": "Reports",
    "grants and projects": "Grants and Projects",
    "grant": "Grants and Projects",
    "grants": "Grants and Projects",
    "analyses & commentary": "Analyses & Commentary",
    "analyses and commentary": "Analyses & Commentary",
    "theses": "Theses",
    "thesis": "Theses",
    "conference papers": "Conference Papers",
    "working papers": "Working Papers",
    "monographs": "Monographs",
    "edited volumes": "Edited Volumes",
    "other publications": "Other Publications",
}

KEY_PUBS_LABELS = {"key publications", "key\xa0publications"}
SKIP_TEXTS = {"read", "link", "view", "download", "access here", "open access", "pdf", "preprint"}
FOOTER_MARKERS = (
    "back to avert members page",
    "back to avert member page",
    "we acknowledge the traditional custodians",
    "subscribe",
    "sign up with your email address",
)


def get_p_text(tag: Tag) -> str:
    """Get full text of a <p> tag with inner formatting stripped."""
    return tag.get_text(" ").strip()


def p_starts_with_in(tag: Tag) -> bool:
    """True if this <p> represents a book 'in ...' line.

    The paragraph should start with the literal text 'in' or 'In' as a NavigableString
    (outside any em/i tag), followed by an <em> or <i> with the book title.

    Matches patterns like:
      <p>in <em>Book Title</em>, Editors</p>
      <p>In <em>Book Title,</em> Editors</p>
      <p>in<em> Book Title</em>, Editors</p>
      <p>Chapter 13 in <em>Book Title</em></p>
    """
    text = tag.get_text(" ").strip()
    # Quick check: must contain 'in' + italic content
    if not re.search(r'\bin\b', text, re.IGNORECASE):
        return False
    if not (tag.find("em") or tag.find("i")):
        return False
    # The first meaningful text content should be 'in' or contain 'in'
    # Accept: "in <em>", "In <em>", "Chapter N in <em>", "in<em>"
    # Reject: just a plain paragraph that happens to have the word 'in' somewhere
    first_text = ""
    for child in tag.children:
        if isinstance(child, NavigableString):
            stripped = child.strip()
            if stripped:
                first_text = stripped
                break
    # Acceptable patterns for first_text:
    #   "in", "In", "in\xa0", "Chapter 13 in", "Chapter 5 in"
    if re.match(r'^(chapter\s+\w+\s+)?in$', first_text, re.IGNORECASE):
        return True
    # Also handle: text ends with " in" (e.g. "Chapter 13 in")
    if re.search(r'\bin$', first_text, re.IGNORECASE):
        return True
    return False


def parse_in_line(tag: Tag) -> tuple[str, str]:
    """Extract (book_title, editors) from a 'in <em>book</em>, editors' paragraph.

    Returns (in_book, editors) — either may be empty string.
    """
    em = tag.find("em") or tag.find("i")
    book_title = em.get_text(" ").strip().rstrip(",").strip() if em else ""

    # Editors: text after the em tag in the paragraph
    editors_parts = []
    past_em = False
    for child in tag.children:
        if child is em:
            past_em = True
            continue
        if past_em:
            if isinstance(child, NavigableString):
                editors_parts.append(str(child))
            else:
                editors_parts.append(child.get_text(" "))

    editors_raw = " ".join(editors_parts).strip().strip(",").strip()

    # Sometimes editors appear in a following NavigableString before the em:
    # e.g. "in Kfir I and Coyne J" in <em>Counterterrorism Yearbook</em>
    # Check if there's text BEFORE the em that looks like editors
    # (that's unusual — normally it's title IN em, editors after)
    # But there's a pattern: <p>in <em>Counterterrorism Yearbook,</em> Kfir I and Coyne J</p>
    # where the editors come AFTER the em. That's already handled above.

    # Another pattern: <p>in <em>Book,</em>Editors</p> without space
    # get_text already handles that.

    return book_title, editors_raw


def is_editors_text(s: str) -> bool:
    """Heuristic: does this string look like an editors attribution?"""
    return bool(re.search(r'\(ed[s]?\.\)', s, re.IGNORECASE))


def looks_like_funder(s: str) -> bool:
    """Heuristic: does this string look like a funder/year line (not authors)?

    Examples:
      "ARC 2020 - 2023"
      "Finnish Cultural Foundation, 2021"
      "Plan International Australia, 2021-2025"
      "$520,377"
      "Centre for Resilient and Inclusive Societies 2020 - 2022"
    """
    # Contains a dollar amount
    if re.search(r'^\$[\d,]+', s):
        return True
    # Contains a 4-digit year
    if re.search(r'\b(19|20)\d{2}\b', s):
        return True
    # Starts with a known funding body pattern (all caps abbreviation, or known orgs)
    if re.match(r'^(ARC|NHMRC|ADF|DFAT|FBI|CIA|AFP)\b', s):
        return True
    return False


def extract_publications(html_path: Path) -> list[dict]:
    """Parse an avert-people HTML file and return structured publications list.

    Returns:
        [
            {
                "type": "Journal Articles",
                "items": [
                    {"title": "...", "authors": "..."},
                    ...
                ]
            },
            ...
        ]
    """
    with open(html_path, encoding="utf-8", errors="replace") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # Find all sqs-html-content divs — these are the content blocks
    content_divs = soup.find_all("div", class_="sqs-html-content")

    # We need to find the Key Publications section and parse from there
    # Find the div containing "Key Publications" header
    pub_start_idx = None
    for idx, div in enumerate(content_divs):
        text = div.get_text(" ").strip().lower()
        if text in KEY_PUBS_LABELS or text.replace("\xa0", " ").strip().lower() == "key publications":
            pub_start_idx = idx + 1  # publications start in subsequent divs
            break
        # Sometimes "Key Publications" is h1 inside a div that also has content
        h1 = div.find("h1")
        if h1:
            h1_text = h1.get_text(" ").strip().lower().replace("\xa0", " ")
            if h1_text in ("key publications", "key\xa0publications"):
                pub_start_idx = idx + 1
                break

    if pub_start_idx is None:
        # No "Key Publications" found — check if any div has a section header at h2 level
        # Try treating all content divs as potential publication blocks
        # Find first div that contains a section-type h2
        for idx, div in enumerate(content_divs):
            h2 = div.find("h2")
            if h2:
                h2_text = h2.get_text(" ").strip().lower()
                if h2_text in SECTION_NORMALISE:
                    pub_start_idx = idx
                    break

    if pub_start_idx is None:
        return []

    publications = []
    current_section_name: str | None = None
    current_items: list[dict] = []

    def flush_section():
        nonlocal current_section_name, current_items
        if current_section_name and current_items:
            publications.append({"type": current_section_name, "items": current_items})
        current_section_name = None
        current_items = []

    # Process each content div from pub_start_idx onwards
    for div in content_divs[pub_start_idx:]:
        div_text = div.get_text(" ").strip()

        # Stop at footer
        if any(div_text.lower().startswith(m) for m in FOOTER_MARKERS):
            break

        # Get all block-level elements: h1, h2, h3, p
        # We'll process them in order
        elements = div.find_all(["h1", "h2", "h3", "p"])

        if not elements:
            continue

        # Check if this div is a section-header-only div (e.g. "Grants and Projects" h1)
        # These are separate divs from the content
        if len(elements) == 1 and elements[0].name in ("h1", "h2"):
            header_text = elements[0].get_text(" ").strip()
            header_lower = header_text.lower().replace("\xa0", " ")
            if header_lower in SECTION_NORMALISE:
                flush_section()
                current_section_name = SECTION_NORMALISE[header_lower]
                continue
            # Could be "Grants and Projects" h1 — also check
            if header_lower in KEY_PUBS_LABELS:
                continue  # skip "Key Publications" header

        # Process elements within this div
        i = 0
        while i < len(elements):
            el = elements[i]
            el_name = el.name
            el_text = el.get_text(" ").strip()
            el_lower = el_text.lower().replace("\xa0", " ")

            # Footer detection
            if any(el_lower.startswith(m) for m in FOOTER_MARKERS):
                flush_section()
                return publications

            # h1 / h2 = section headers
            if el_name in ("h1", "h2"):
                # Check for section type
                if el_lower in KEY_PUBS_LABELS:
                    i += 1
                    continue
                norm = SECTION_NORMALISE.get(el_lower)
                if norm:
                    flush_section()
                    current_section_name = norm
                    i += 1
                    continue
                # Not a recognised section — skip (might be a sub-header or name)
                i += 1
                continue

            # h3 = publication title
            if el_name == "h3":
                if not el_text or el_lower in SKIP_TEXTS:
                    i += 1
                    continue

                if current_section_name is None:
                    i += 1
                    continue

                title = el_text

                # Collect the following <p> tags for this entry
                # For non-book-chapter sections: just title + authors
                # For book chapters: title, then any combo of authors/in-line

                if current_section_name == "Book Chapters":
                    # Collect up to 4 following paragraphs
                    following_ps = []
                    j = i + 1
                    while j < len(elements) and elements[j].name == "p":
                        p_text = elements[j].get_text(" ").strip()
                        p_lower = p_text.lower()
                        # Stop if it looks like a new title (h3 would catch it, but
                        # sometimes a section header appears as p — unlikely)
                        if p_lower in SKIP_TEXTS or not p_text:
                            j += 1
                            continue
                        following_ps.append(elements[j])
                        j += 1

                    # Parse the following paragraphs for this book chapter
                    item = parse_book_chapter(title, following_ps)
                    current_items.append(item)
                    i = j
                    continue

                elif current_section_name == "Grants and Projects":
                    # Grants: title [, authors] [, funder/year] [, $amount]
                    # Collect following p tags
                    p_texts = []
                    j = i + 1
                    while j < len(elements) and elements[j].name == "p":
                        p_text = elements[j].get_text(" ").strip()
                        if p_text and p_text.lower() not in SKIP_TEXTS:
                            p_texts.append(p_text)
                        j += 1

                    authors = ""
                    funder_parts = []

                    for pt in p_texts:
                        if not authors and not looks_like_funder(pt):
                            authors = pt
                        else:
                            funder_parts.append(pt)

                    funder = " | ".join(funder_parts)

                    item: dict = {"title": title}
                    if authors:
                        item["authors"] = authors
                    if funder:
                        item["funder"] = funder
                    current_items.append(item)
                    i = j
                    continue

                else:
                    # Journal Articles, Books, Reports, Theses, etc.
                    # Pattern: h3(title) [p(authors)] [p(Read)]
                    authors = ""
                    j = i + 1
                    while j < len(elements) and elements[j].name == "p":
                        p_text = elements[j].get_text(" ").strip()
                        if not p_text or p_text.lower() in SKIP_TEXTS:
                            j += 1
                            continue
                        # First non-skip p is authors
                        authors = p_text
                        j += 1
                        break

                    item = {"title": title}
                    if authors:
                        item["authors"] = authors
                    current_items.append(item)
                    i = j
                    continue

            # <p> at top level in a div (not following an h3) — could be grant block
            # In "Grants and Projects" section, grant entries sometimes have no h3:
            # Just: <p>grant title</p> <p>authors</p> <p>funder, year</p>
            if el_name == "p" and current_section_name == "Grants and Projects":
                p_text = el_text
                if not p_text or p_text.lower() in SKIP_TEXTS:
                    i += 1
                    continue

                # This is a grant title
                title = p_text
                p_texts = []
                j = i + 1
                while j < len(elements) and elements[j].name == "p":
                    p2_text = elements[j].get_text(" ").strip()
                    if p2_text and p2_text.lower() not in SKIP_TEXTS:
                        p_texts.append(p2_text)
                    j += 1

                authors = ""
                funder_parts = []
                for pt in p_texts:
                    if not authors and not looks_like_funder(pt):
                        authors = pt
                    else:
                        funder_parts.append(pt)

                funder = " | ".join(funder_parts)

                item = {"title": title}
                if authors:
                    item["authors"] = authors
                if funder:
                    item["funder"] = funder
                current_items.append(item)
                i = j
                continue

            i += 1

    flush_section()
    return publications


def parse_book_chapter(title: str, following_ps: list) -> dict:
    """Parse a book chapter entry from its following paragraph tags.

    Two orderings:
      Pattern A: in_line, [authors]
      Pattern B: authors, in_line

    The "in" line is a <p> that starts with 'in' and contains <em> or <i>.

    Returns dict with keys: title, authors (opt), in (opt), editors (opt)
    """
    item: dict = {"title": title}

    # Filter out Read/Link/etc paragraphs
    relevant = []
    for p in following_ps:
        p_text = p.get_text(" ").strip()
        if p_text and p_text.lower() not in SKIP_TEXTS:
            relevant.append(p)

    if not relevant:
        return item

    # Find the "in" line index
    in_line_idx = None
    for idx, p in enumerate(relevant):
        if p_starts_with_in(p):
            in_line_idx = idx
            break

    if in_line_idx is None:
        # No "in" line found — just grab authors from first paragraph
        authors = relevant[0].get_text(" ").strip() if relevant else ""
        if authors and authors.lower() not in SKIP_TEXTS:
            item["authors"] = authors
        return item

    # Parse the "in" line
    in_book, editors = parse_in_line(relevant[in_line_idx])

    # Determine authors: look for a paragraph that is NOT the in-line
    # and doesn't look like editors text
    authors = ""
    for idx, p in enumerate(relevant):
        if idx == in_line_idx:
            continue
        p_text = p.get_text(" ").strip()
        if p_text and p_text.lower() not in SKIP_TEXTS:
            # This should be authors
            authors = p_text
            break

    # If editors is empty but we have text after in_line that looks like editors,
    # check the raw paragraph text
    # Sometimes: <p>in <em>Book,</em> Editors (eds.)</p> — all in one p
    # That's handled by parse_in_line already.

    # Sometimes the editors are in a SEPARATE paragraph after the in-line
    # (rare, but let's handle it)
    if not editors and in_line_idx + 1 < len(relevant):
        next_p = relevant[in_line_idx + 1]
        next_text = next_p.get_text(" ").strip()
        if is_editors_text(next_text):
            editors = next_text
            # The remaining paragraph (not in_line, not editors) is authors
            authors_candidates = [
                p.get_text(" ").strip() for idx, p in enumerate(relevant)
                if idx != in_line_idx and p is not next_p
                and p.get_text(" ").strip().lower() not in SKIP_TEXTS
            ]
            authors = authors_candidates[0] if authors_candidates else ""

    if authors:
        item["authors"] = authors
    if in_book:
        item["in"] = in_book
    if editors:
        item["editors"] = editors

    return item


def main():
    # Load existing people.json
    with open(DATA_FILE, encoding="utf-8") as f:
        existing: list[dict] = json.load(f)

    by_slug = {p["slug"]: p for p in existing}

    # Parse publications from each HTML file
    parsed_pubs: dict[str, list] = {}
    for html_file in sorted(HTML_DIR.glob("*.html")):
        stem = html_file.stem
        slug = SLUG_MAP.get(stem, stem)
        try:
            pubs = extract_publications(html_file)
            parsed_pubs[slug] = pubs
            n = sum(len(s["items"]) for s in pubs)
            print(f"  {stem} -> {slug}: {n} publications across {len(pubs)} sections")
        except Exception as e:
            import traceback
            print(f"  ERROR {stem}: {e}")
            traceback.print_exc()

    # Update people.json with new publications
    new_people = []
    for person in existing:
        slug = person["slug"]
        updated = dict(person)
        if slug in parsed_pubs:
            updated["publications"] = parsed_pubs[slug]
        else:
            print(f"  No HTML found for {slug} — keeping existing publications")
        new_people.append(updated)

    # Write output
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(new_people, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(new_people)} entries to {OUT_FILE}")

    # --- Sample output for verification ---
    print("\n=== SAMPLE: julian-droogan Book Chapters ===")
    droogan = next((p for p in new_people if p["slug"] == "julian-droogan"), None)
    if droogan:
        for section in droogan.get("publications", []):
            if section["type"] == "Book Chapters":
                for item in section["items"]:
                    print(f"  Title:   {item.get('title', '')[:80]}")
                    print(f"  Authors: {item.get('authors', '(none)')}")
                    print(f"  In:      {item.get('in', '(none)')}")
                    print(f"  Editors: {item.get('editors', '(none)')}")
                    print()

    print("=== SAMPLE: mario-peucker publications ===")
    peucker = next((p for p in new_people if p["slug"] == "mario-peucker"), None)
    if peucker:
        for section in peucker.get("publications", []):
            print(f"  Section: {section['type']} ({len(section['items'])} items)")
            for item in section["items"][:2]:
                print(f"    Title:   {item.get('title', '')[:80]}")
                print(f"    Authors: {item.get('authors', '(none)')}")
                if "in" in item:
                    print(f"    In:      {item.get('in', '')}")
                if "editors" in item:
                    print(f"    Editors: {item.get('editors', '')}")
            print()

    print("=== SAMPLE: zahid-ahmed Book Chapters (Pattern B ordering) ===")
    ahmed = next((p for p in new_people if p["slug"] == "zahid-ahmed"), None)
    if ahmed:
        for section in ahmed.get("publications", []):
            if section["type"] == "Book Chapters":
                for item in section["items"][:3]:
                    print(f"  Title:   {item.get('title', '')[:80]}")
                    print(f"  Authors: {item.get('authors', '(none)')}")
                    print(f"  In:      {item.get('in', '(none)')}")
                    print(f"  Editors: {item.get('editors', '(none)')}")
                    print()


if __name__ == "__main__":
    main()
