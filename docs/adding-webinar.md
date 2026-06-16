# Adding a webinar from an information pack

When the user uploads a webinar information pack (`.docx`) plus a speaker headshot
image, follow this process to add it to the upcoming events listing.

## 1. Extract the information pack

The pack is a `.docx` (a zip file). Extract its text, e.g.:

```bash
unzip -o "pack.docx" -d extracted
cat extracted/word/document.xml | sed 's/<\/w:p>/\n/g' | sed -e 's/<[^>]*>//g'
```

Pull out: speaker name + title/affiliation, talk title, date/time (often given in
two timezones — keep both), registration link, abstract, and speaker bio.

## 2. Save the headshot

Headshots live in `public/headshots/`, named `first-last.ext` (lowercase, hyphens).
Check the actual image format before naming — some files are PNG despite a `.jpg`-looking
source filename (use `file <path>` to confirm), and the extension on disk must match the
real format.

## 3. Add the entry to `data/events.json`

Add a new object with `"type": "upcoming"` into the array. Fields:

```json
{
  "type": "upcoming",
  "speakers": [
    {
      "name": "Dr First Last",
      "title": "Position, Institution",
      "bio": "Full bio paragraph from the pack.",
      "image": "first-last.png",
      "image_dir": "headshots"
    }
  ],
  "date_aedt": "Day DD Month YYYY, HH:MM–HH:MM AEST",
  "date_other": "HH:MM–HH:MM AM/PM TZ",
  "platform": "Zoom",
  "format": "Online Webinar",
  "title": "Talk title",
  "description": "Abstract paragraph(s), separated by \\n\\n for multiple paragraphs.",
  "register_url": "https://...",
  "recording_url": ""
}
```

- `app/events/page.js` renders `upcoming` events in array order (no sorting) — insert
  the new entry in the correct chronological position relative to existing upcoming
  entries, not necessarily at the top or bottom.
- `speakers` is an array — supports multiple speakers per event.
- After editing, validate with `node -e "require('./data/events.json')"`.

## What NOT to do

- Don't touch `data/webinars.json` (the past-webinars archive) — that's only updated
  once a webinar has happened and has a recording, per the existing sync process
  (see memory: AVERT Webinars Page).
- Don't invent date/time fields not present in the pack.
