---
name: adding-webinar
description: Add a new webinar to the upcoming events listing from a webinar information pack (.docx) and a speaker headshot image. Use whenever the user uploads/references a webinar info pack and a headshot, or asks to add an upcoming webinar/event.
---

Follow `docs/adding-webinar.md` in this repo step by step:

1. Extract text from the `.docx` information pack (it's a zip — unzip and strip
   `word/document.xml` tags) to get speaker name/title, talk title, date/time(s),
   registration link, abstract, and bio.
2. Save the headshot into `public/headshots/` as `first-last.ext`, matching the
   real image format (check with `file`, don't trust the source filename's extension).
3. Insert a new `"type": "upcoming"` object into `data/events.json`, in the correct
   chronological position among existing upcoming entries (the page renders them in
   array order, no sorting).
4. Validate with `node -e "require('./data/events.json')"`.
5. Do not touch `data/webinars.json` (past-webinars archive) — that only gets updated
   after the webinar has happened and has a recording.

See `docs/adding-webinar.md` for the exact field schema and an example.
