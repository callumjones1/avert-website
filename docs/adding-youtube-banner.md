# Generating a YouTube banner

For an event with multiple speakers (moderator + panellists), AVERT YouTube
banners follow a house style: the green `AVERT_YouTube_Banner_Template.png`
background (hexagon mark top-left), cut-out headshots (background removed)
lined up bottom-right, and the co-host/partner logo on a white badge top-right.

The generator lives in `scripts/youtube-banner/`:

- `assets/template.png` — the banner background (2560x1440)
- `assets/example.png` — a reference example of the finished style
- `generate_banner.py` — the compositing script (see its module docstring for
  full usage)
- `requirements.txt` — `pip install -r requirements.txt` (rembg, onnxruntime,
  pillow). First run downloads rembg's background-removal model, which takes
  a couple of minutes; after that it's cached locally and fast.

## Basic usage

```bash
cd scripts/youtube-banner
python generate_banner.py OUTPUT.png \
  --people path/to/moderator.jpg path/to/panellist1.jpg path/to/panellist2.jpg \
  --logo path/to/co-host-logo.png
```

- `--people` takes headshots in left-to-right display order — moderator first,
  then panellists, matching how they're listed on the event page. The
  rightmost person in the list ends up rightmost in the banner.
- `--logo` is optional: the co-host/partner logo for that session, placed on a
  white rounded badge top-right (logos are usually dark-on-white/transparent
  and unreadable directly on the green background, hence the badge).
- Background removal runs per photo and is cached in `.cache/` (gitignored)
  keyed on file path + mtime, so re-running with tweaked layout numbers is
  fast — only new/changed photos re-run rembg.

## Tuning the layout

- `--person-height` (px): height each cut-out is scaled to. ~1000 works for 3
  people, ~880 for 4 — much more than 4 will need to go lower, or the row
  overflows the left edge of the canvas.
- `--overlap` (px): how much each person overlaps the one to their right.
  Increase this (or decrease `--person-height`) if the row overflows.
- `--overlaps`: per-gap override list (one fewer entry than `--people`) if you
  need different spacing between specific pairs — e.g. a smaller/negative
  value to leave a gap instead of an overlap.
- `--right-margin` (px): gap from the right edge of the canvas.

There's no exact formula — generate, look at the result, and adjust. A person
cut from a photo with more headroom/torso in frame will render smaller
relative to a tightly-cropped one at the same `--person-height`; nudge
`--overlaps`/`--right-margin` per banner rather than expecting one setting to
suit every mix of photos.

## When someone doesn't have a headshot

If a speaker has no photo on file (only a placeholder, e.g. a partner
organisation's logo used as a stand-in), don't just feed it into `--people` —
scaled and overlapped like a headshot, a logo/icon reads as a cropping bug,
not a person. Use `--aside` instead: it places that image to the left of the
whole row, at its own size, without being bottom-anchored/cropped like the
headshots. See `AVERT_911_Day2` (Theresa Rajah's missing headshot, represented
by the Moonshot spot-logo) for the precedent — reproduced with:

```bash
python generate_banner.py OUTPUT.png \
  --people stuart-macdonald.png yasmin-chilmeran.jpg angus-lindsay.jpg \
  --aside moonshot-spot-logo.png \
  --person-height 820 --overlap 100
```
(No `--logo` in that case — the aside mark already carries the partner's
branding, so a duplicate top-right badge would be redundant.)

## Known limitation

Background removal (rembg's default `u2net` model) occasionally leaves a hard
rectangular edge where a photo's torso/shoulders were already cropped square
in the source image (visible where two overlapping cut-outs meet). This is a
property of the source photo's framing, not something to fix per-run — if it
looks bad on a specific pair, increase the overlap between just that pair
(via `--overlaps`) so the harder edge is hidden under the neighbour.
