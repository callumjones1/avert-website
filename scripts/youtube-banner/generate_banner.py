"""
Generate a YouTube banner (2560x1440) for an AVERT event, in the house style:
the AVERT_YouTube_Banner_Template.png background (green, hexagon mark top-left),
cut-out headshots (background removed) lined up bottom-right, and an optional
partner/co-host logo on a white badge top-right.

Usage:
    python generate_banner.py OUTPUT.png --people photo1.jpg photo2.png ... \
        [--logo co-host-logo.png] [--person-height 950] [--overlap 90] \
        [--right-margin 70] [--cache-dir .cache]

--people takes headshot paths in left-to-right display order (moderator first,
then panellists, matching how they're listed on the event page).

Cut-outs are cached (by source path + mtime) in --cache-dir (default: ./.cache
next to this script) so re-running / tweaking layout doesn't re-run background
removal every time. The cache is a local speed-up only — do not commit it.
"""
import argparse
import hashlib
import os
import sys

from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_PATH = os.path.join(SCRIPT_DIR, "assets", "template.png")


def _cache_key(path):
    stat = os.stat(path)
    h = hashlib.sha1(f"{path}:{stat.st_mtime}:{stat.st_size}".encode()).hexdigest()[:16]
    return f"{os.path.splitext(os.path.basename(path))[0]}-{h}.png"


def _already_transparent(img, threshold=0.15):
    """True if a meaningful fraction of pixels are already non-opaque (e.g. a logo mark)."""
    alpha = img.getchannel("A")
    hist = alpha.histogram()
    non_opaque = sum(hist[:255])
    return (non_opaque / (img.width * img.height)) > threshold


def cutout(path, cache_dir):
    """Alpha-trimmed RGBA cutout of an image, cached on disk.

    Runs background removal for ordinary photos. Skipped for images that already
    carry real transparency (e.g. a partner's spot-logo standing in for a missing
    headshot) - those are just trimmed to their content bbox as-is.
    """
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, _cache_key(path))
    if os.path.exists(cache_path):
        return Image.open(cache_path).convert("RGBA")

    src = Image.open(path).convert("RGBA")
    if _already_transparent(src):
        out = src
    else:
        from rembg import remove  # imported lazily: slow to import, not needed on cache hit
        out = remove(src)

    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(cache_path)
    return out


def build_badge(logo_path, target_height=220, pad=28, corner_radius=18):
    """White rounded-rect badge containing the given logo, sized to target_height."""
    logo = Image.open(logo_path).convert("RGBA")
    scale = (target_height - 2 * pad) / logo.height
    logo = logo.resize((max(1, round(logo.width * scale)), target_height - 2 * pad), Image.LANCZOS)

    badge_w = logo.width + 2 * pad
    badge_h = target_height
    badge = Image.new("RGBA", (badge_w, badge_h), (0, 0, 0, 0))

    from PIL import ImageDraw

    draw = ImageDraw.Draw(badge)
    draw.rounded_rectangle([0, 0, badge_w - 1, badge_h - 1], radius=corner_radius, fill=(255, 255, 255, 255))
    badge.alpha_composite(logo, (pad, pad))
    return badge


def compose(output_path, people_paths, logo_path=None, person_height=950,
            overlap=90, overlaps=None, right_margin=70, bottom_margin=0, cache_dir=None,
            aside_path=None, aside_height=400, aside_gap=20, aside_top=580):
    """overlaps, if given, overrides `overlap` per gap between consecutive people
    (len(people_paths) - 1 values, left to right). Use a negative value to put a
    gap instead of an overlap - handy for a logo standing in for a missing
    headshot, which shouldn't be swallowed under its neighbour's overlap.

    aside_path places one extra image (e.g. a partner's spot-logo/icon standing
    in for a person with no headshot) to the LEFT of the whole row, sized to
    aside_height and positioned aside_top pixels down from the canvas top -
    NOT bottom-aligned or scaled into the row, since an icon isn't a head+
    shoulders crop and looks wrong cropped/overlapped the way headshots are.
    This is the pattern used for AVERT_911_Day2 (Theresa Rajah's missing
    headshot, represented by the Moonshot mark)."""
    cache_dir = cache_dir or os.path.join(SCRIPT_DIR, ".cache")
    canvas = Image.open(TEMPLATE_PATH).convert("RGBA")
    W, H = canvas.size

    cutouts = []
    for p in people_paths:
        img = cutout(p, cache_dir)
        scale = person_height / img.height
        img = img.resize((max(1, round(img.width * scale)), person_height), Image.LANCZOS)
        cutouts.append(img)

    gaps = list(overlaps) if overlaps else [overlap] * (len(cutouts) - 1)
    assert len(gaps) == len(cutouts) - 1, "overlaps must have one entry per gap"

    # Place right-to-left so the last person in the list ends up rightmost,
    # each subsequent (leftward) person overlapping the one to its right.
    x = W - right_margin
    y = H - person_height - bottom_margin
    positions = []
    for i, img in enumerate(reversed(cutouts)):
        x -= img.width
        positions.append((img, x))
        if i < len(gaps):
            x += gaps[len(gaps) - 1 - i]  # next image shifts left by less than its full width
    positions.reverse()

    for img, px in positions:
        canvas.alpha_composite(img, (px, y))

    if aside_path:
        leftmost_x = positions[0][1]
        mark = cutout(aside_path, cache_dir)
        scale = aside_height / mark.height
        mark = mark.resize((max(1, round(mark.width * scale)), aside_height), Image.LANCZOS)
        canvas.alpha_composite(mark, (leftmost_x - aside_gap - mark.width, aside_top))

    if logo_path:
        badge = build_badge(logo_path)
        bx = W - 60 - badge.width
        by = 60
        canvas.alpha_composite(badge, (bx, by))

    canvas.convert("RGB").save(output_path)
    print(f"wrote {output_path} ({W}x{H})")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("output")
    ap.add_argument("--people", nargs="+", required=True, help="headshot paths, left-to-right")
    ap.add_argument("--logo", default=None, help="co-host/partner logo, placed top-right on a white badge")
    ap.add_argument("--person-height", type=int, default=950)
    ap.add_argument("--overlap", type=int, default=90)
    ap.add_argument("--overlaps", type=int, nargs="+", default=None,
                     help="per-gap overlap overrides, one per gap between people (negative = leave a gap)")
    ap.add_argument("--right-margin", type=int, default=70)
    ap.add_argument("--bottom-margin", type=int, default=0)
    ap.add_argument("--cache-dir", default=None)
    ap.add_argument("--aside", default=None,
                     help="extra image (e.g. a partner spot-logo standing in for a missing headshot), "
                          "placed left of the row - see compose()'s docstring")
    ap.add_argument("--aside-height", type=int, default=400)
    ap.add_argument("--aside-gap", type=int, default=20)
    ap.add_argument("--aside-top", type=int, default=580)
    args = ap.parse_args()

    compose(
        args.output,
        args.people,
        overlaps=args.overlaps,
        logo_path=args.logo,
        person_height=args.person_height,
        overlap=args.overlap,
        right_margin=args.right_margin,
        bottom_margin=args.bottom_margin,
        cache_dir=args.cache_dir,
        aside_path=args.aside,
        aside_height=args.aside_height,
        aside_gap=args.aside_gap,
        aside_top=args.aside_top,
    )


if __name__ == "__main__":
    sys.exit(main())
