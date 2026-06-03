"""
Parse downloaded AVERT commentary HTML files into commentary.json.
Uploads hero images to Cloudinary.
Usage: python backend/scripts/parse_commentary.py
"""

import json
import re
import shutil
import os
import urllib.request
from pathlib import Path
from bs4 import BeautifulSoup, Tag
from datetime import datetime
import cloudinary
import cloudinary.uploader

INPUT_DIR = Path("avert-commentary")
OUTPUT_FILE = Path("data/commentary.json")
PUBLIC_IMG_DIR = Path("public/commentary")

cloudinary.config(
    cloud_name="drr1ur9ri",
    api_key="252389142217324",
    api_secret="x3komi3pNt_6nl_qBoxBq6N8K7M",
    secure=True,
)

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]
MONTH_PAT = "|".join(MONTHS)
BYLINE_DATE_RE = re.compile(rf"({MONTH_PAT})\s+(\d{{1,2}}),?\s+(\d{{4}})", re.I)

MANUAL_AUTHOR_OVERRIDES = {
    "how-male-grievance-fuels-radicalisation-and-extremist-violence": "Haily Tran",
    "osn7ju2j2q75s4relmwppxrgh1sujg": "J.M. Berger",  # Lawful Extremism
}


def fmt_date(dt: datetime) -> str:
    return f"{dt.day} {dt.strftime('%B')} {dt.year}"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")[:80]


def normalise_headings(div):
    """Squarespace uses h4 for article subheadings — promote to h2."""
    for tag in div.find_all(["h4", "h5", "h6"]):
        tag.name = "h2"
    for tag in div.find_all("h3"):
        tag.name = "h2"


def unwrap_spans(div):
    for span in div.find_all("span"):
        if isinstance(span, Tag):
            span.unwrap()


def clean_html_block(div) -> str:
    normalise_headings(div)
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


def upload_to_cloudinary(image_source: str, public_id: str) -> str | None:
    """Upload an image (local path or URL) to Cloudinary. Returns secure URL or None."""
    try:
        result = cloudinary.uploader.upload(
            image_source,
            public_id=f"avert-commentary/{public_id}",
            overwrite=False,
            resource_type="image",
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"    Cloudinary upload failed for {public_id}: {e}")
        return None


def copy_local_image(src_attr: str, html_path: Path) -> str | None:
    """Copy a local _files image to public/commentary/ and return web path."""
    if not src_attr or src_attr.startswith("http"):
        return None
    src_path = (html_path.parent / src_attr).resolve()
    if not src_path.exists():
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
    return str(src_path)  # return local path for Cloudinary upload


def get_hero_image(soup, html_path: Path, slug: str) -> str:
    """
    Returns a Cloudinary URL for the article hero image.
    Prefers local _files image; falls back to og:image CDN URL.
    """
    article = soup.find(class_="blog-item-content")
    if article:
        for block in article.find_all(attrs={"data-block-type": "5"}):
            img = block.find("img")
            if not img:
                continue
            src = img.get("src") or img.get("data-src") or ""
            if "AVERT_Primary" in src or "AVERT-logo" in src:
                continue
            # Try local file first
            local = copy_local_image(src, html_path)
            if local:
                url = upload_to_cloudinary(local, slug)
                if url:
                    return url
            # Fall back to external URL
            if src.startswith("http"):
                url = upload_to_cloudinary(src, slug)
                if url:
                    return url

    # Try og:image
    og = soup.find("meta", property="og:image")
    if og:
        img_url = og.get("content", "")
        if img_url and "AVERT_Primary" not in img_url and "AVERT-logo" not in img_url:
            url = upload_to_cloudinary(img_url, slug)
            if url:
                return url

    return ""


def extract_image_block_html(block: Tag, html_path: Path, slug: str) -> str:
    """Build an <img> tag for a type-5 block, using Cloudinary URL."""
    img = block.find("img")
    if not img:
        return ""
    src = img.get("src") or img.get("data-src") or ""
    alt = img.get("alt", "")
    if "AVERT_Primary" in src or "AVERT-logo" in src:
        return ""
    local = copy_local_image(src, html_path)
    cloud_url = upload_to_cloudinary(local or src, f"{slug}-inline") if (local or src.startswith("http")) else None
    final_src = cloud_url or (f"/commentary/{Path(local).name}" if local else src)
    if not final_src:
        return ""
    return f'<img src="{final_src}" alt="{alt}">'


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
        return author, fmt_date(dt)
    except Exception:
        return author, f"{day_str} {month_str.capitalize()} {year_str}"


def strip_byline_paragraph(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    body = soup.find("body")
    if not body:
        return html
    first_p = body.find("p")
    if first_p:
        text = first_p.get_text(strip=True)
        if "•" in text and BYLINE_DATE_RE.search(text):
            first_p.decompose()
    return body.decode_contents().strip()


def strip_cruft(html: str) -> str:
    """Remove photo credits, 'Originally published' lines, and author bios from body."""
    soup = BeautifulSoup(html, "lxml")
    body = soup.find("body")
    if not body:
        return html

    for tag in body.find_all(["p", "h2", "h3", "h4"]):
        text = tag.get_text(strip=True).lower()
        # Photo credits anywhere
        if re.match(r"^photo\s+(by|credit)\b", text) or re.match(r"^image\s+(by|credit)\b", text):
            tag.decompose()
            continue
        # Photographer name lines (e.g. "Nikita Karimov for Unsplash")
        if re.search(r"\bfor\s+unsplash\b", text):
            tag.decompose()
            continue
        # "Originally published" lines
        if re.search(r"originally published", text):
            tag.decompose()
            continue
        # "This article (first|was) appeared/published" lines
        if re.search(r"this article (first appeared|was originally|was published)", text):
            tag.decompose()
            continue
        # Author bio lines at the end (e.g. "Dr. Vivian Gerrand is a Research Fellow...")
        # These typically appear as the very last paragraph and contain "is a" + title
        if re.match(r"^(dr\.?|prof(essor)?\.?|associate professor\.?)?\s*[a-z]", text) and \
           re.search(r"\bis (a|an|the) (research|professor|senior|associate|fellow|chair|phd|lecturer|director)", text):
            tag.decompose()
            continue

    return body.decode_contents().strip()


def parse_file(html_path: Path) -> dict | None:
    with open(html_path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    # Title
    og_title = soup.find("meta", property="og:title")
    raw = og_title.get("content", "") if og_title else (soup.find("title") or Tag(name="title")).get_text()
    title = re.sub(r"\s*[—–-]+\s*AVERT Research Network\s*$", "", raw).strip()
    title = title.replace("&#x27;", "'").replace("&amp;", "&").replace("&quot;", '"')

    # Canonical URL / slug
    url_tag = soup.find("link", rel="canonical")
    canonical = url_tag["href"].strip() if url_tag else ""
    slug = canonical.rstrip("/").split("/")[-1] if canonical else slugify(title)

    # Original publication URL
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

    # Hero image → Cloudinary
    print(f"  Uploading hero image...")
    hero_image = get_hero_image(soup, html_path, slug)

    # Build body HTML from blocks in document order
    body_html = ""
    article_content = soup.find(class_="blog-item-content")
    if article_content:
        parts = []
        for block in article_content.find_all(attrs={"data-block-type": True}):
            btype = block.get("data-block-type")
            if btype == "5":
                img_html = extract_image_block_html(block, html_path, slug)
                if img_html:
                    parts.append(img_html)
            elif btype == "1337":
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
        print(f"  WARNING: no body found")
        return None

    # Author + date from byline
    byline_author, byline_date = extract_byline(body_html)
    body_html = strip_byline_paragraph(body_html)
    body_html = strip_cruft(body_html)

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

    # Manual author overrides
    if slug in MANUAL_AUTHOR_OVERRIDES:
        byline_author = MANUAL_AUTHOR_OVERRIDES[slug]

    return {
        "slug": slug,
        "url": canonical,
        "title": title,
        "date": byline_date,
        "author": byline_author,
        "original_url": original_url,
        "hero_image": hero_image,
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
        print(f"{path.name[:65]}")
        entry = parse_file(path)
        if entry:
            imgs = entry["body_html"].count("<img")
            links = entry["body_html"].count("<a href")
            heads = entry["body_html"].count("<h2")
            print(f"  {entry['author']!r:38s} {entry['date']!r}")
            print(f"  hero={bool(entry['hero_image'])}  imgs={imgs}  links={links}  h2={heads}")
        print()
        if entry:
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
