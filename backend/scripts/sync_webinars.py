#!/usr/bin/env python3
"""
sync_webinars.py
----------------
Checks the AVERT YouTube playlist(s) for new webinar recordings and
automatically inserts any new entries into data/webinars.json.

Usage:
    python backend/scripts/sync_webinars.py

Run this manually whenever you want to pick up newly uploaded recordings,
or wire it to a cron job / GitHub Actions schedule.

After the script runs you still need to rebuild and redeploy the site:
    npm run build   (or just push to main to trigger GitHub Actions)

Dependencies (install into backend/.venv):
    pip install yt-dlp
"""

import json
import sys
from pathlib import Path

try:
    import yt_dlp
except ImportError:
    sys.exit("yt-dlp not found. Run: pip install yt-dlp")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent.parent
WEBINARS_JSON = ROOT / "data" / "webinars.json"

# Add new yearly playlists here as they are created.
# Only the *current* year typically gets new uploads mid-year.
PLAYLISTS_TO_CHECK = {
    "2026": "PLfjeIYamD7WUrTxvdfLuc5TqBDB9ztTQE",
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def fetch_playlist(playlist_id):
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


def existing_video_ids(data):
    """Return set of all videoIds already present in the JSON data."""
    ids = set()
    for year_entries in data.values():
        for entry in year_entries:
            if entry.get("videoId"):
                ids.add(entry["videoId"])
    return ids


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if not WEBINARS_JSON.exists():
        sys.exit(f"Cannot find webinars JSON at {WEBINARS_JSON}")

    with open(WEBINARS_JSON, encoding="utf-8") as f:
        data = json.load(f)

    known_ids = existing_video_ids(data)
    added = []

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
                if year not in data:
                    data[year] = []
                #Prepend so newest appears first
                data[year].insert(0, {"title": video["title"], "videoId": vid})
                known_ids.add(vid)
                added.append(video)

    if added:
        with open(WEBINARS_JSON, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\nWrote {len(added)} new entry/entries to {WEBINARS_JSON.relative_to(ROOT)}")
        print("Next step: commit the change and push (or run `npm run build` locally).")
    else:
        print("\nNo new videos — webinars.json unchanged.")


main()
