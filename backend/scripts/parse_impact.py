"""
Parse downloaded AVERT impact HTML files into impact.json.
Uploads hero images to Cloudinary.
Usage: python backend/scripts/parse_impact.py
"""

import json
import re
import shutil
from pathlib import Path
from bs4 import BeautifulSoup, Tag
from datetime import datetime
import cloudinary
import cloudinary.uploader

INPUT_DIR = Path("avert-impact")
OUTPUT_FILE = Path("data/impact.json")
PUBLIC_IMG_DIR = Path("public/impact")

cloudinary.config(
    cloud_name="drr1ur9ri",
    api_key="252389142217324",
    api_secret="x3komi3pNt_6nl_qBoxBq6N8K7M",
    secure=True,
)

MONTHS = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]


def fmt_date(dt: datetime) -> str:
    return f"{dt.day} {dt.strftime('%B')} {dt.year}"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return re.sub(r"-+", "-", text).strip("-")[:80]


def normalise_headings(div):
    for tag in div.find_all(["h3", "h4", "h5", "h6"]):
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


def strip_cruft(html: str) -> str:
    """Remove photo credits, written-by lines, 'Apple User' artifacts."""
    soup = BeautifulSoup(html, "lxml")
    body = soup.find("body")
    if not body:
        return html
    for tag in body.find_all(["p", "h2"]):
        text = tag.get_text(strip=True)
        low = text.lower()
        if re.match(r"^photo\s+(by|credit)\b", low):
            tag.decompose(); continue
        if re.search(r"\bfor\s+unsplash\b", low):
            tag.decompose(); continue
        if re.match(r"^written by$", low):
            tag.decompose(); continue
        if low == "apple user":
            tag.decompose(); continue
        if low == "avert research network" and len(text) < 30:
            tag.decompose(); continue
        # Strip trailing "Name Surname" lines that are just the author repeated
        if re.match(r"^[a-z]", low) is None and len(text.split()) <= 4 and not re.search(r"[.?!]", text):
            # Short all-caps or title-case standalone name line at very end
            pass  # only remove if it's actually the last element
    # Remove last <p> if it's just a standalone name or byline artifact
    all_p = body.find_all("p")
    if all_p:
        last = all_p[-1]
        lt = last.get_text(strip=True)
        if lt.lower() in ("apple user", "avert research network") or \
           (len(lt.split()) <= 4 and re.match(r"^[A-Z][a-z]+\s[A-Z]", lt) and not re.search(r"[.?!,]", lt)):
            last.decompose()
    return body.decode_contents().strip()


def upload_to_cloudinary(image_source: str, public_id: str) -> str | None:
    try:
        result = cloudinary.uploader.upload(
            image_source,
            public_id=f"avert-impact/{public_id}",
            overwrite=False,
            resource_type="image",
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"    Cloudinary failed {public_id}: {e}")
        return None


def copy_local_image(src_attr: str, html_path: Path) -> str | None:
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
    dest = PUBLIC_IMG_DIR / src_path.name
    PUBLIC_IMG_DIR.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        shutil.copy2(src_path, dest)
    return str(src_path)


def get_hero_image(soup, html_path: Path, slug: str) -> str:
    # Try image blocks first
    article = soup.find(class_="blog-item-content")
    if article:
        for block in article.find_all(attrs={"data-block-type": "5"}):
            img = block.find("img")
            if not img:
                continue
            src = img.get("src") or img.get("data-src") or ""
            if "AVERT_Primary" in src or "AVERT-logo" in src:
                continue
            local = copy_local_image(src, html_path)
            if local:
                url = upload_to_cloudinary(local, slug)
                if url:
                    return url
            if src.startswith("http"):
                url = upload_to_cloudinary(src, slug)
                if url:
                    return url
    # Fall back to og:image
    og = soup.find("meta", property="og:image")
    if og:
        img_url = og.get("content", "")
        if img_url and "AVERT_Primary" not in img_url and "AVERT-logo" not in img_url:
            url = upload_to_cloudinary(img_url, slug)
            if url:
                return url
    return ""


def extract_inline_image_html(block: Tag, html_path: Path, slug: str, idx: int) -> str:
    img = block.find("img")
    if not img:
        return ""
    src = img.get("src") or img.get("data-src") or ""
    alt = img.get("alt", "")
    if "AVERT_Primary" in src or "AVERT-logo" in src:
        return ""
    local = copy_local_image(src, html_path)
    cloud_url = upload_to_cloudinary(local or src, f"{slug}-img{idx}") if (local or src.startswith("http")) else None
    final_src = cloud_url or (f"/impact/{Path(local).name}" if local else src)
    return f'<img src="{final_src}" alt="{alt}">' if final_src else ""


def parse_file(html_path: Path) -> dict | None:
    with open(html_path, encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "lxml")

    # Title
    og_title = soup.find("meta", property="og:title")
    raw = og_title.get("content", "") if og_title else ""
    if not raw:
        t = soup.find("title")
        raw = t.get_text() if t else html_path.stem
    title = re.sub(r"\s*[—–-]+\s*AVERT Research Network\s*$", "", raw).strip()
    title = title.replace("&#x27;", "'").replace("&amp;", "&").replace("&quot;", '"').replace("_span_", "").strip()

    # Canonical / slug
    url_tag = soup.find("link", rel="canonical")
    canonical = url_tag["href"].strip() if url_tag else ""
    slug = canonical.rstrip("/").split("/")[-1] if canonical else slugify(title)

    # Date from meta (no bylines on impact posts)
    date_str = ""
    date_tag = soup.find("meta", itemprop="datePublished")
    if date_tag:
        try:
            dt = datetime.fromisoformat(date_tag["content"])
            date_str = fmt_date(dt)
        except Exception:
            date_str = date_tag["content"][:10]

    # Hero image → Cloudinary
    print(f"  Uploading hero image...")
    hero_image = get_hero_image(soup, html_path, slug)

    # Body HTML — process blocks in document order
    body_html = ""
    article_content = soup.find(class_="blog-item-content")
    if article_content:
        parts = []
        img_idx = 0
        for block in article_content.find_all(attrs={"data-block-type": True}):
            btype = block.get("data-block-type")
            if btype == "5":
                img_html = extract_inline_image_html(block, html_path, slug, img_idx)
                img_idx += 1
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
            if cleaned and len(cleaned) > 100:
                body_html = cleaned
                break

    if not body_html:
        print(f"  WARNING: no body found")
        return None

    body_html = strip_cruft(body_html)

    # Strip leading <img> if hero_image is set (avoid duplication)
    if hero_image:
        body_html = re.sub(r"^\s*<img[^>]*>\s*", "", body_html)

    return {
        "slug": slug,
        "url": canonical,
        "title": title,
        "date": date_str,
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
            print(f"  date={entry['date']!r}  hero={bool(entry['hero_image'])}  imgs={imgs}  links={links}  h2={heads}")
        else:
            print("  SKIPPED")
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
