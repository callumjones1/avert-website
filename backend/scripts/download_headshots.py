"""Download missing headshots from image_url fields and update people.json."""
import json
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
DATA_FILE = ROOT / "data" / "people.json"
HEADSHOTS_DIR = ROOT / "public" / "headshots"

# Only download for these people (all confirmed to have real headshot URLs)
TARGETS = [
    "haily-tran",
    "kye-allen",
    "zainab-al-attar",
    "julia-ebner",
    "gerard-gill",
    "maya-argello-gomez",
    "amparo-pamela-fabe",
    "sissel-haugdal-jore",
    "melanie-mitchell",
    "primitivo-iii-cabanes-ragandang",
    "joshua-roose",
]

with open(DATA_FILE, encoding="utf-8") as f:
    people = json.load(f)

updated = 0
for person in people:
    slug = person["slug"]
    if slug not in TARGETS:
        continue
    if person.get("headshot"):
        print(f"  {slug}: already has headshot {person['headshot']}")
        continue
    url = person.get("image_url", "")
    if not url:
        print(f"  {slug}: no image_url, skipping")
        continue

    # Derive filename from URL
    path_part = url.split("?")[0].split("/")[-1]
    # Sanitize
    import re
    safe = re.sub(r"[^a-zA-Z0-9._-]", "_", path_part)
    ext = Path(safe).suffix.lower()
    if ext not in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        ext = ".jpg"
    filename = f"{slug}{ext}"
    dest = HEADSHOTS_DIR / filename

    # Add https if missing
    if url.startswith("//"):
        url = "https:" + url

    print(f"  Downloading {slug} -> {filename} ...")
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        with open(dest, "wb") as f:
            f.write(data)
        person["headshot"] = filename
        print(f"    OK ({len(data)//1024}KB)")
        updated += 1
    except Exception as e:
        print(f"    FAILED: {e}")

with open(DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(people, f, indent=2, ensure_ascii=False)

print(f"\nDone. Updated {updated} headshots.")
