# Adding a commentary article

Commentary articles live in `data/commentary.json` as an array. Add a new object at the **top** of the array so it appears first on the page.

## Required fields

```json
{
  "slug": "short-url-safe-title",
  "title": "Full article title",
  "date": "1 May 2026",
  "author": "First Last",
  "original_publication": "The Conversation",
  "original_url": "https://theconversation.com/...",
  "hero_image": "",
  "body_html": "...cleaned HTML..."
}
```

- **slug** — URL-safe version of the title (lowercase, hyphens, no apostrophes or special chars). Must be unique.
- **hero_image** — Cloudinary URL if you have one, otherwise leave as `""`.
- **original_publication** — shown as "via X" on the listing card.

## Preparing the body HTML from The Conversation

The Conversation's republish widget gives you a block of HTML. Before pasting it into `body_html`:

1. **Remove** the outer `<div class="theconversation-article-body">` wrapper (and its closing tag).
2. **Remove** the `<h1 class="theconversation-article-title">` — the article page renders the title from the `title` field.
3. **Remove** the initial author `<span>` right after the opening div — attribution is already in the article header and at the bottom of the body.
4. **Keep** everything else: all paragraphs, headings, links, figures, iframes (YouTube embeds), the author credit paragraph at the bottom, and the "This article is republished from The Conversation" paragraph.
5. **Keep the tracking pixel** — The Conversation requires it for their view count. It's the `<img src="https://counter.theconversation.com/content/..." width="1" height="1" ...>` inside the final paragraph. Their HTML says **DO NOT REMOVE** — it's a condition of the CC republishing licence.

### The Conversation republishing compliance checklist

- [ ] Author name attributed (in article header via `author` field, and in body credit at bottom)
- [ ] Author's institution mentioned (in body credit at bottom)
- [ ] "Originally published on The Conversation" line present at bottom of body
- [ ] Tracking pixel kept in the final paragraph
- [ ] Article text not edited (structural HTML cleanup is fine)

## Encoding the HTML as a JSON string

Since `body_html` is a JSON string, all double-quotes inside the HTML must be escaped as `\"`. The easiest way to do this without mistakes:

1. Paste the cleaned HTML into a text editor.
2. Use find-and-replace: replace `"` with `\"`.
3. Replace actual newlines with `\n` (or just put the whole thing on one line — both work).
4. Wrap in `"..."` and paste as the value.

After saving, run `node -e "require('./data/commentary.json')"` to confirm the JSON is valid.

## What gets stripped automatically at render time

The article detail page (`app/commentary/[slug]/page.js`) already strips a leading `<img>` from the body if a `hero_image` is set, to avoid showing the same photo twice. No other stripping happens — what's in `body_html` is rendered as-is via `dangerouslySetInnerHTML`.
