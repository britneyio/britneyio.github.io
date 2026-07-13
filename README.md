# Ise Okhiria's Portfolio

Check it out at: [Portfolio](https://britneyio.github.io)

A retro personal computer portfolio site. You start on a Windows-XP-style
desktop; a **Start** button boots into a black-and-green terminal that prints
the résumé, and a graphical desktop lets you open each section as its own window
(plus a Snake game).

Vanilla HTML/CSS/JS split across a few files — no framework, no build step for
normal use.

## Edit content

All résumé content lives in one JavaScript object named `resume` at the top of
`app.js`. Edit that object — experience, projects, skills, interests, about,
contact — then refresh the browser. No build step.

## Structure

```
index.html   # pure HTML; links styles.css + app.js, references fonts/
styles.css   # all CSS
app.js       # all JS (the `resume` content object lives at the top)
fonts/       # Press Start 2P + VT323 (.ttf)
```

## Fonts

Both under the SIL Open Font License, loaded from `fonts/` as the `.ttf` files
from Google Fonts (replace by downloading the family and dropping the `.ttf` in
with the same filename):

- **Press Start 2P** — https://fonts.google.com/specimen/Press+Start+2P
- **VT323** — https://fonts.google.com/specimen/VT323
