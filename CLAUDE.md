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

## Architecture

Everything in `app.js` runs inside one IIFE (nothing leaks to global scope), in
sections: **CONTENT** (the `resume` object) → **DESKTOP WINDOW RENDER** → **WINDOW
MANAGER** → **SNAKE** → **TERMINAL**.

- **One data source, two renderers.** `resume` is the single source of truth. The
  desktop fills each window body's `innerHTML` from it (`byId("b-*")`); the terminal
  prints the same data via `printAbout/printExperience/...`. All user strings pass
  through `escapeHtml`; bare URLs go through `linkifyUrls`.
- **Two modes.** A graphical desktop and a fullscreen terminal overlay. `showTerminal()`
  / `launchDesktop()` swap between them (`.desktop.term-on`).
- **Window manager.** Each section is a `.win`; it's a *single-page* desktop —
  `openWindow(id)` closes any other open window, centers + focuses it, and (usually)
  adds a taskbar button. `topZIndex` climbs on focus so the active window stacks on top.
  Title bars are draggable on desktop (disabled on mobile, where windows are full-screen).
- **Launchers are declarative.** Any element with `data-win="w-*"` is auto-wired to open
  that window (desktop icons, Start-menu items, the bottom-bar buttons). Terminal is a
  mode, not a window, so its launchers (`#mi-term`, `#tb-term`) call `showTerminal()`
  directly.
- **Blog** is an XP-styled *file browser* (`#w-blog`, `.xp` class → blue title bar,
  menu/address bar, blue task pane). Each post tile opens the **reusable** post window
  (`#w-post`) — one window, retitled per post. Blog + post windows **hide the bottom bar**
  (`.desktop.bar-hidden`) and get **no** taskbar button; minimizing a post returns to the
  blog window. When `resume.blog` is empty, the browser shows an XP "Posts coming soon"
  loading bar.
- **Snake** is a self-contained module exposing only `{ready, stop}` for the window
  manager to init/teardown.

## Fonts

Two typefaces, both free under the SIL Open Font License, loaded from `fonts/` as
the `.ttf` files downloaded from Google Fonts:

- **Press Start 2P** — `fonts/PressStart2P-Regular.ttf` — https://fonts.google.com/specimen/Press+Start+2P
- **VT323** — `fonts/VT323-Regular.ttf` — https://fonts.google.com/specimen/VT323

## Sanity checks after editing

```bash
node --check app.js   # JS parses
```
