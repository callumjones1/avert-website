"""
Parse downloaded AVERT commentary HTML files into commentary.json.
Also copies article images to public/commentary/.
Usage: python backend/scripts/parse_commentary.py
"""

import json
import re
import shutil
from pathlib import Path
from bs4 import BeautifulSoup, Tag
from datetime import datetime

INPUT_DIR = Path("avert-commentary")
OUTPUT_FILE = Path("data/commentary.json")
PUBLIC_IMG_DIR = Path("public/commentary")

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]
MONTH_PAT = "|".join(MONTHS)
BYLINE_DATE_RE = re.compile(rf"({MONTH_PAT})\s+(\d{{1,2}}),?\s+(\d{{4}})", re.I)


def fmt_date(dt: datetime) -> str:
    return f"{dt.day} {dt.strftime('%B')} {dt.year}"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text[:80]


def unwrap_spans(div):
    for span in div.find_all("span"):
        if isinstance(span, Tag):
            span.unwrap()


def clean_html_block(div) -> str:
    """Strip squarespace attrs from a text block, keep links and structure."""
    unwrap_spans(div)
    for tag in list(div.find_all(True)):
        if not isinstance(tag, Tag) or tag.attrs is None:
            continue
        if tag.name == "a":
            href = tag.attrs.get("href", "")
            tag.attrs = {"href": href, "target": "_blank", "rel": "noopener noreferrer"}
        elif tag.name == "img":
            tag.attrs = {k: tag.attrs[k] for k in ["src", "alt"] if k in tag.attrs}
        else:
            tag.attrs = {}
        if tag.name == "p" and not tag.get_text(strip=True) and not tag.find("img"):
            tag.decompose()
    return div.decode_contents().strip()


def copy_image(src_attr: str, html_path: Path, slug: str) -> str | None:
    """
    Given an img src like './Article_files/photo.jpg', copy the file to
    public/commentary/ and return the web path '/commentary/photo.jpg'.
    """
    if not src_attr or src_attr.startswith("http"):
        return src_attr  # external URL — use as-is
    # Resolve relative to the HTML file's directory
    src_path = (html_path.parent / src_attr).resolve()
    if not src_path.exists():
        # Try finding it in the _files folder
        fname = Path(src_attr).name
        files_dir = html_path.parent / (html_path.stem + "_files")
        candidate = files_dir / fname
        if candidate.exists():
            src_path = candidate
        else:
            return None
    dest_name = src_path.name
    dest = PUBLIC_IMG_DIR / dest_name
    PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(src_path, dest)
    return f"/commentary/{dest_name}"


def extract_image_block(block: Tag, html_path: Path, slug: str) -> str:
    """Turn a sqs-block-image into an <img> tag with a local path."""
    img = block.find("img")
    if not img:
        return ""
    src = img.get("src") or img.get("data-src") or ""
    alt = img.get("alt", "")
    # Skip AVERT logo images
    if "AVERT_Primary" in src or "AVERT-logo" in src:
        return ""
    web_path = copy_image(src, html_path, slug)
    if not web_path:
        return ""
    return f'<img src="{web_path}" alt="{alt}">'


def extract_byline(body_html_str: str) -> tuple[str, str]:
    soup = BeautifulSoup(body_html_str, "lxml")
    first_p = soup.find("p")
    if not first_p:
        return "", ""
    text = first_p.get_text(separator=" ", strip=True)
    if "•" not in text:
        return "", ""
    date_m = BYLINE_DATE_RE.search(text)
    if not date_m:
        return "", ""
    raw_author = text.split("•")[0].strip()
    author = " ".join(w.capitalize() for w in raw_author.split())
    month_str, day_str, year_str = date_m.groups()
    try:
        dt = datetime.strptime(f"{day_str} {month_str.capitalize()} {year_str}", "%d %B %Y")
        date_str = fmt_date(dt)
    except Exception:
        date_str = f"{day_str} {month_str.capitalize()} {year_str}"
    return author, date_str


def strip_byline_paragraph(body_html_str: str) -> str:
    soup = BeautifulSoup(body_html_str, "lxml")
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
    """Remove photo-credit paragraphs anywhere near the top."""
    soup = BeautifulSoup(body_html_str, "lxml")
    body = soup.find("body")
    if not body:
        return body_html_str
    for p in list(body.find_all("p"))[:4]:
        txt = p.get_text(strip=True).lower()
        if re.match(r"^photo\s+by\b", txt) or re.match(r"^image\s+(by|credit)\b", txt) or re.match(r"^nikita karimov\b", txt):
            p.decompose()
        else:
            break
    return body.decode_contents().strip()


def parse_file(html_path: Path) -> dict | None:
    with open(html_path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    # --- Title ---
    og_title = soup.find("meta", property="og:title")
    raw = og_title.get("content", "") if og_title else (soup.find("title") or Tag(name="title")).get_text()
    title = re.sub(r"\s*[—–-]+\s*AVERT Research Network\s*$", "", raw).strip()
    title = title.replace("&#x27;", "'").replace("&amp;", "&").replace("&quot;", '"')

    # --- Canonical URL / slug ---
    url_tag = soup.find("link", rel="canonical")
    canonical = url_tag["href"].strip() if url_tag else ""
    slug = canonical.rstrip("/").split("/")[-1] if canonical else slugify(title)

    # --- Original publication URL ---
    original_url = ""
    for string in soup.find_all(string=re.compile(r"[Oo]riginally published", re.I)):
        parent = string.parent
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

    # --- Build body HTML from blocks in document order ---
    body_html = ""
    article_content = soup.find(class_="blog-item-content")
    if article_content:
        # Walk direct block containers in order
        all_blocks = article_content.find_all(attrs={"data-block-type": True})
        parts = []
        for block in all_blocks:
            btype = block.get("data-block-type")
            if btype == "5":  # image block
                img_html = extract_image_block(block, html_path, slug)
                if img_html:
                    parts.append(img_html)
            elif btype == "1337":  # text block
                text_div = block.find(class_="sqs-html-content")
                if text_div:
                    cleaned = clean_html_block(text_div)
                    if cleaned:
                        parts.append(cleaned)
        body_html = "\n".join(parts)

    if not body_html:
        for block in soup.find_all(class_="sqs-html-content"):
            cleaned = clean_html_block(block)
            if cleaned and len(cleaned) > 200:
                body_html = cleaned
                break

    if not body_html:
        print(f"  WARNING: no body found in {html_path.name}")
        return None

    # --- Author + date from byline ---
    byline_author, byline_date = extract_byline(body_html)

    body_html = strip_photo_credit(body_html)
    body_html = strip_byline_paragraph(body_html)

    if not byline_author:
        meta_author = soup.find("meta", itemprop="author")
        byline_author = meta_author["content"].strip() if meta_author else ""

    if not byline_date:
        date_tag = soup.find("meta", itemprop="datePublished")
        if date_tag:
            try:
                dt = datetime.fromisoformat(date_tag["content"])
                byline_date = fmt_date(dt)
            except Exception:
                byline_date = date_tag["content"][:10]

    # Strip "Originally published" paragraph
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
            imgs = entry["body_html"].count("<img")
            links = entry["body_html"].count("<a href")
            print(f"{path.name[:55]}")
            print(f"  {entry['author']!r:38s} {entry['date']!r}  imgs={imgs} links={links}\n")
            results.append(entry)

    def sort_key(e):
        for fmt in ("%d %B %Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(e["date"], fmt)
            except Exception:
                pass
        return datetime.min

    results.sort(key=sort_key, reverse=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(results)} entries to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
