#!/usr/bin/env python3
"""
sync_webinars.py
----------------
Checks the AVERT YouTube playlist(s) for new webinar recordings and
automatically inserts any new entries into app/events/webinars/page.js.

Usage:
    python backend/scripts/sync_webinars.py

Run this manually whenever you want to pick up newly uploaded recordings,
or wire it to a cron job / GitHub Actions schedule.

After the script runs you still need to rebuild and redeploy the site:
    npm run build   (or just push to main to trigger GitHub Actions)

Dependencies (install into backend/.venv):
    pip install yt-dlp
"""

import re
import sys
from pathlib import Path

try:
    import yt_dlp
except ImportError:
    sys.exit("yt-dlp not found. Run: pip install yt-dlp")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

# Repo root is three levels up from this script (backend/scripts/sync_webinars.py)
ROOT = Path(__file__).resolve().parent.parent.parent
WEBINARS_PAGE = ROOT / "app" / "events" / "webinars" / "page.js"

# Add new yearly playlists here as they are created.
# Only the *current* year typically gets new uploads mid-year; past playlists
# are complete, so no need to re-check them every run.
PLAYLISTS_TO_CHECK = {
    "2026": "PLfjeIYamD7WUrTxvdfLuc5TqBDB9ztTQE",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fetch_playlist(playlist_id: str) -> list[dict]:
    """Return list of {id, title} dicts for every public video in the playlist."""
    url = f"https://www.youtube.com/playlist?list={playlist_id}"
    opts = {
        "quiet": True,
        "no_warnings": True,
        "extract_flat": "in_playlist",
        "skip_download": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        info = ydl.extract_info(url, download=False)
    return [
        {"id": e["id"], "title": e["title"]}
        for e in (info.get("entries") or [])
        if e.get("id") and e.get("title")
    ]


def existing_video_ids(page_js: str) -> set[str]:
    """Extract every videoId value already present in page.js."""
    return set(re.findall(r"videoId:\s*'([^']+)'", page_js))


def insert_video(page_js: str, year: str, video_id: str, title: str) -> str:
    """
    Prepend a new tile entry to the front of the given year's array in page.js.
    New uploads are most recent so they should appear first.
    """
    safe_title = title.replace("'", "\\'")
    new_entry = f"    {{ title: '{safe_title}', videoId: '{video_id}' }},\n"
    # Match the opening of the year's array, e.g. '2026': [
    pattern = rf"('{re.escape(year)}':\s*\[)"
    if not re.search(pattern, page_js):
        # Year section doesn't exist yet — create it before the closing of the object
        new_section = f"  '{year}': [\n{new_entry}  ],\n"
        page_js = re.sub(r"(const webinars\s*=\s*\{)", rf"\1\n{new_section}", page_js, count=1)
    else:
        page_js = re.sub(pattern, rf"\1\n{new_entry}", page_js, count=1)
    return page_js


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if not WEBINARS_PAGE.exists():
        sys.exit(f"Cannot find webinars page at {WEBINARS_PAGE}")

    page_js = WEBINARS_PAGE.read_text(encoding="utf-8")
    known_ids = existing_video_ids(page_js)
    added: list[dict] = []

    for year, playlist_id in PLAYLISTS_TO_CHECK.items():
        print(f"\nChecking {year} playlist ({playlist_id}) ...")
        try:
            videos = fetch_playlist(playlist_id)
        except Exception as exc:
            print(f"  ERROR: {exc}", file=sys.stderr)
            continue

        for video in videos:
            vid = video["id"]
            if vid in known_ids:
                print(f"  already present  {vid}  {video['title']}")
            else:
                print(f"  + adding         {vid}  {video['title']}")
                page_js = insert_video(page_js, year, vid, video["title"])
                known_ids.add(vid)
                added.append(video)

    if added:
        WEBINARS_PAGE.write_text(page_js, encoding="utf-8")
        print(f"\nWrote {len(added)} new entry/entries to {WEBINARS_PAGE.relative_to(ROOT)}")
        print("Next step: commit the change and push (or run `npm run build` locally).")
    else:
        print("\nNo new videos — page.js unchanged.")


if __name__ == "__main__":
    main()
