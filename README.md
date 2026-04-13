# Tiny Logic

A mobile-first puzzle game that teaches programming logic to kids through fun, visual challenges.

![platform](https://img.shields.io/badge/platform-mobile%20%7C%20web-brightgreen) ![i18n](https://img.shields.io/badge/i18n-EN%20%7C%20FR%20%7C%20ES-blue) ![license](https://img.shields.io/badge/license-MIT-lightgrey)

## What is it?

Tiny Logic is a browser-based coding game for children. Players write simple programs — using instructions like **Forward**, **Turn**, **Loop**, and **Functions** — to guide their hero to the treasure chest.

No installation needed. Open `index.html` and play.

## Features

- **160 levels** across 8 themed worlds (Meadow → Castle)
- **Progressive difficulty**: sequences → turns → obstacles → loops → functions
- **3 playable heroes** (Piou the bird, Mimi the cat, Robo the robot) with custom color palettes
- **Star rating system** — 1 to 3 stars based on solution efficiency
- **Multilingual**: English (default), French, Spanish — auto-detected from browser, switchable in-app
- **Offline-ready**: pure HTML/CSS/JS, no build step, no dependencies
- **Mobile-first**: designed for phones and tablets, works in any modern browser
- **Progress saved** locally via `localStorage`

## Project structure

```
├── index.html          # Single-page app shell
├── styles.css          # All styles (mobile-first)
└── js/
    ├── i18n.js         # Translations (EN / FR / ES)
    ├── sprites.js      # Hero SVG generator (3 heroes × 3 palettes × 4 directions)
    ├── sounds.js       # Web Audio API sound effects
    ├── levels.js       # Level data — 8 worlds × 20 levels
    ├── game.js         # Game engine (grid, movement, execution)
    ├── ui.js           # Program editor (palette, blocks, loops, functions)
    └── app.js          # App controller (navigation, save, i18n wiring)
```

## Getting started

```bash
git clone https://github.com/emnbdx/tiny-logic.git
cd tiny-logic
open index.html   # or serve with any static server
```

No build step required.

## Adding a language

1. Open `js/i18n.js`
2. Add your language code to the `LANGS` array
3. Add translations for every key in the `T` object
4. Add a button in the `.lang-switcher` div in `index.html`

## Adding levels

Levels are defined in `js/levels.js`. Each level is an object:

```js
{
  grid: ['..G', '.#.', '...'],  // rows: . path, # wall, G goal, * star, S switch, D door
  hero: [0, 2, 1],              // [col, row, direction]  0=up 1=right 2=down 3=left
  tools: ['forward', 'left', 'right', 'loop', 'f1', 'f2'],
  optimal: 4,                   // instruction count for 3 stars
  hint: 'hint_key',             // i18n key from i18n.js (optional)
  type: 'normal',               // normal | guided | collect | switch | fix
}
```

## License

MIT
