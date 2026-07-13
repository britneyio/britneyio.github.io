# Portfolio — context for Claude / future agents

A retro "personal computer" portfolio site: a Windows-XP-style desktop with a
top row of icons and a centered name/Start button that boots into a
black-and-green terminal résumé; each section opens as its own draggable window
(plus a Snake game). Vanilla HTML/CSS/JS — **no build step, no framework.**

## Layout

```
index.html   # pure HTML: <link> styles.css, <script defer> app.js, references fonts/
styles.css   # all CSS  (@font-face points at fonts/*.woff2)
app.js       # all JS   (the `resume` content object lives at the top)
fonts/       # Press Start 2P + VT323 woff2 (SIL Open Font License)
```

These four things **are** the site — all hand-edited, nothing generated. Edit a
file and refresh the browser.

## Run locally

```bash
python3 -m http.server 8000   # then open http://127.0.0.1:8000/
```

Serving (rather than opening the file directly) is recommended so the browser
loads the fonts reliably. Any static host (GitHub Pages, etc.) works — publish
the four items above.

## Where the content lives

All résumé content is one JS object named `resume` at the top of `app.js` —
experience, projects, skills, interests, about, contact, education. Both the
desktop windows and the terminal render from it, so editing a value there updates
both views. To change résumé text, edit `resume` and refresh.

## Fonts

Two typefaces, both free under the SIL Open Font License, loaded from `fonts/` as
the `.ttf` files downloaded from Google Fonts:

- **Press Start 2P** — `fonts/PressStart2P-Regular.ttf` — https://fonts.google.com/specimen/Press+Start+2P
- **VT323** — `fonts/VT323-Regular.ttf` — https://fonts.google.com/specimen/VT323

## Sanity checks after editing

```bash
node --check app.js   # JS parses
```
