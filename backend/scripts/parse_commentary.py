"""
Parse downloaded AVERT commentary HTML files into commentary.json.
Usage: python backend/scripts/parse_commentary.py
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup, Tag, NavigableString
from datetime import datetime

INPUT_DIR = Path("avert-commentary")
OUTPUT_FILE = Path("data/commentary.json")

# Months for parsing byline dates
MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]


def fmt_date(dt: datetime) -> str:
    """Return e.g. '5 August 2021' without a leading zero (cross-platform)."""
    return f"{dt.day} {dt.strftime('%B')} {dt.year}"
MONTH_PAT = "|".join(MONTHS)
BYLINE_DATE_RE = re.compile(
    rf"({MONTH_PAT})\s+(\d{{1,2}}),?\s+(\d{{4}})", re.I
)


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:80]


def unwrap_spans(soup_div):
    """Unwrap <span> tags that only contain text or an <a>, keeping their contents."""
    for span in soup_div.find_all("span"):
        if not isinstance(span, Tag):
            continue
        span.unwrap()


def clean_body_html(soup_div) -> str:
    """Return clean inner HTML from a sqs-html-content div."""
    unwrap_spans(soup_div)
    for tag in list(soup_div.find_all(True)):
        if not isinstance(tag, Tag) or tag.attrs is None:
            continue
        # Keep only href, target, rel on <a>; keep src, alt on <img>
        if tag.name == "a":
            href = tag.attrs.get("href", "")
            tag.attrs = {"href": href, "target": "_blank", "rel": "noopener noreferrer"}
        elif tag.name == "img":
            tag.attrs = {k: tag.attrs[k] for k in ["src", "alt"] if k in tag.attrs}
        else:
            tag.attrs = {}
        # Remove empty paragraphs
        if tag.name == "p" and not tag.get_text(strip=True) and not tag.find("img"):
            tag.decompose()
    return soup_div.decode_contents().strip()


def extract_byline(body_html_str: str) -> tuple[str, str]:
    """
    Pull author and date from a leading byline like:
      <p>ANDREW ZAMMIT • April 10, 2021</p>
      <p>HELEN YOUNG &amp; GEOFF BOUCHER • September 16, 2020</p>
    Returns (author, date_str) or ("", "").
    """
    soup = BeautifulSoup(body_html_str, "lxml")
    first_p = soup.find("p")
    if not first_p:
        return "", ""
    text = first_p.get_text(separator=" ", strip=True)
    # Must contain a bullet separator and a recognisable date
    if "•" not in text:
        return "", ""
    date_m = BYLINE_DATE_RE.search(text)
    if not date_m:
        return "", ""
    # Author is the text before the bullet
    raw_author = text.split("•")[0].strip()
    # Title-case (bylines are ALL-CAPS)
    author = " ".join(w.capitalize() for w in raw_author.split())
    # Handle "&" / "and" compounds: keep as-is after title-casing
    # Date
    month_str, day_str, year_str = date_m.groups()
    try:
        dt = datetime.strptime(f"{day_str} {month_str.capitalize()} {year_str}", "%d %B %Y")
        date_str = fmt_date(dt)
    except Exception:
        date_str = f"{day_str} {month_str.capitalize()} {year_str}"
    return author, date_str


def strip_byline_paragraph(body_html_str: str) -> str:
    """Remove the leading byline <p> from body HTML."""
    soup = BeautifulSoup(body_html_str, "lxml")
    # lxml wraps in <html><body>, work on the body
    body = soup.find("body")
    if not body:
        return body_html_str
    first_p = body.find("p")
    if first_p:
        text = first_p.get_text(strip=True)
        if "•" in text and BYLINE_DATE_RE.search(text):
            first_p.decompose()
    return body.decode_contents().strip()


def strip_photo_credit(body_html_str: str) -> str:
    """Remove leading photo-credit paragraphs (e.g. 'Photo by X on Unsplash')."""
    soup = BeautifulSoup(body_html_str, "lxml")
    body = soup.find("body")
    if not body:
        return body_html_str
    # Remove any leading paragraph that is just a photo credit
    for p in list(body.find_all("p"))[:3]:
        txt = p.get_text(strip=True).lower()
        if re.match(r"^photo\s+by\b", txt) or re.match(r"^image\s+(by|credit)\b", txt):
            p.decompose()
        else:
            break
    return body.decode_contents().strip()


def parse_file(html_path: Path) -> dict | None:
    with open(html_path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    # --- Title ---
    og_title = soup.find("meta", property="og:title")
    if og_title:
        raw = og_title.get("content", "")
    else:
        title_tag = soup.find("title")
        raw = title_tag.get_text() if title_tag else html_path.stem
    title = re.sub(r"\s*[—–-]+\s*AVERT Research Network\s*$", "", raw).strip()
    # Unescape HTML entities that may still be in og:title
    title = title.replace("&#x27;", "'").replace("&amp;", "&").replace("&quot;", '"')

    # --- Canonical URL ---
    url_tag = soup.find("link", rel="canonical")
    canonical = url_tag["href"].strip() if url_tag else ""
    if canonical:
        slug = canonical.rstrip("/").split("/")[-1]
    else:
        slug = slugify(title)

    # --- Original publication URL ---
    original_url = ""
    for string in soup.find_all(string=re.compile(r"[Oo]riginally published", re.I)):
        parent = string.parent
        # Walk up to find a <p> or similar containing an <a>
        for _ in range(3):
            if hasattr(parent, "find"):
                link = parent.find("a")
                if link:
                    original_url = link.get("href", "")
                    break
            parent = getattr(parent, "parent", None)
            if parent is None:
                break
        if original_url:
            break

    # --- Raw body HTML ---
    body_html = ""
    article_content = soup.find(class_="blog-item-content")
    if article_content:
        html_blocks = article_content.find_all(class_="sqs-html-content")
        parts = []
        for block in html_blocks:
            cleaned = clean_body_html(block)
            if cleaned:
                parts.append(cleaned)
        body_html = "\n".join(parts)

    if not body_html:
        for block in soup.find_all(class_="sqs-html-content"):
            cleaned = clean_body_html(block)
            if cleaned and len(cleaned) > 200:
                body_html = cleaned
                break

    if not body_html:
        print(f"  WARNING: no body found in {html_path.name}")
        return None

    # --- Extract real author + date from byline in body ---
    byline_author, byline_date = extract_byline(body_html)

    # Strip photo credit and byline from the body
    body_html = strip_photo_credit(body_html)
    body_html = strip_byline_paragraph(body_html)

    # --- Fallback author/date from meta if byline extraction failed ---
    if not byline_author:
        meta_author = soup.find("meta", itemprop="author")
        byline_author = meta_author["content"].strip() if meta_author else ""

    if not byline_date:
        date_tag = soup.find("meta", itemprop="datePublished")
        if date_tag:
            raw_date = date_tag["content"]
            try:
                dt = datetime.fromisoformat(raw_date)
                byline_date = fmt_date(dt)
            except Exception:
                byline_date = raw_date[:10]

    # Strip "Originally published" paragraph from body too
    if original_url:
        body_soup = BeautifulSoup(body_html, "lxml")
        body_tag = body_soup.find("body")
        if body_tag:
            for p in body_tag.find_all("p"):
                if re.search(r"[Oo]riginally published", p.get_text()):
                    p.decompose()
                    break
            body_html = body_tag.decode_contents().strip()

    return {
        "slug": slug,
        "url": canonical,
        "title": title,
        "date": byline_date,
        "author": byline_author,
        "original_url": original_url,
        "body_html": body_html,
    }


def main():
    if not INPUT_DIR.exists():
        print(f"Input directory not found: {INPUT_DIR}")
        return

    html_files = sorted(INPUT_DIR.glob("*.html"))
    print(f"Found {len(html_files)} HTML files\n")

    results = []
    for path in html_files:
        entry = parse_file(path)
        if entry:
            status = f"  author={entry['author']!r:40s} date={entry['date']!r}"
            print(f"{path.name[:60]}\n{status}\n")
            results.append(entry)

    # Sort by date descending
    def sort_key(e):
        try:
            return datetime.strptime(e["date"], "%d %B %Y")
        except Exception:
            try:
                return datetime.strptime(e["date"], "%Y-%m-%d")
            except Exception:
                return datetime.min

    results.sort(key=sort_key, reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(results)} entries to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
