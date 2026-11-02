# poke-astro design system

Status: approved 2026-11-02, implemented the same day (section 9 lists what each step touched). Compare and Team builder pages keep a visually hidden `h1` because they have no natural title cell.

## 1. The idea

The Pokédex is a device made of panels. The detail page already works like that: a grid of cells, each framed in the Pokémon's own colour, each holding one reading. This document makes that the rule for every screen.

Five rules carry every decision. If a design question is not answered by one of them, the answer is "do nothing".

1. **Everything is a cell on one grid.** Pages are stacks of bands on the same grid, with the same gap between cells and between bands. There are no banners, no section headings outside cells, no bare text between cells.
2. **The frame says who the cell belongs to.** A 2px border, always. Its colour is the Pokémon's colour when the cell is about one Pokémon, the game's colour when it is a game, and the neutral frame when it is about nothing in particular. A cell never has a shadow.
3. **The display face names things.** Dela Gothic One is used for exactly one job: the title of a cell. The Pokémon's name on the detail hero is the title of that cell. Everything else is Inter.
4. **Mono is for readings.** JetBrains Mono shows numbers the Pokédex reads out: IDs, stats, heights, weights, scores. Never words.
5. **Purple means you can act.** Ghost Purple marks interactive and selected states only: filled buttons, active filters, chosen options, focus rings. It never decorates.

Colour palette, aurora, floating bottom nav and search overlay are kept as they are today.

## 2. Tokens

All values already exist in `src/styles/global.css` unless marked *new*. Names here are roles; the Tailwind utility is in the last column.

### Colour

| Role | Light | Dark | Utility | Use |
| --- | --- | --- | --- | --- |
| Canvas | `#fefefe` + aurora | `#1e2636` + aurora | `body` | The page. Only the aurora is ever painted on it. |
| Cell | `#ffffff` | `#293143` | `bg-white dark:bg-dark-surface` | Every panel. |
| Well | `#f5f5f7` | `#353e52` | `bg-surface-sunken dark:bg-dark-raised` | Inset areas inside a cell: inputs, bar tracks, segmented controls, quiet chips. |
| Frame | `rgb(0 0 0 / 0.08)` | `rgb(255 255 255 / 0.10)` | `border-frame` *new* | Border of a cell that belongs to no one. |
| Ink | `#111827` | `#eeeef4` | `text-ink dark:text-dark-ink` | Titles, names, values. |
| Ink muted | `#6b7280` | `#9ca3c8` | `text-ink-muted` | Labels, subtitles. Minimum for text. |
| Ink faint | `#9ca3af` | `#6b7298` | `text-ink-faint` | Decoration only (ID watermark, dashed empty slots). Never text that must be read. |
| Act | `#705898` | `#A18CC5` | `bg-primary dark:bg-dark-primary` | Filled buttons, active filter, selected option, focus ring. |
| Act wash | `rgb(112 88 152 / 0.12)` | `/ 0.15` | `bg-primary/12` | Hover and selected backgrounds. |
| Pokémon colour | per Pokémon | same | inline `--type-color` | Frame and spotlight of a cell about that Pokémon. From `accentColors.json`, falling back to the first type colour. |
| Type colours | `typeColors` | same | inline | Type badges and generation tiles only. |
| Section tints | red, green, blue, purple | lighter | nav only | Pokédex, Play, Search, Home tabs and the aurora. Nowhere else. |
| Good / care / bad | `#16A34A` `#D97706` `#DC2626` | same | `bg-success` `bg-warning` `bg-danger` | Stat bars, capture rate, quiz answers. |

Text on a type-coloured badge uses `contrast-color()` with `contrastInk()` as the fallback, because Chromium does not ship `contrast-color()` yet.

### Type

| Role | Face | Size / weight | Utility | Where |
| --- | --- | --- | --- | --- |
| Cell title | Dela Gothic One | 13px, sentence case, ink | `font-display text-[13px] text-ink` | First line of any cell that needs a name. |
| Hero title | Dela Gothic One | 30px phone, 36px iPad+ | `font-display text-3xl md:text-4xl` | The Pokémon's name on the detail page, the app name on the home hero. |
| Tile title | Dela Gothic One | 18px | `font-display text-lg` | Game tiles on home and Play. |
| Name | Inter 600 | 16px | `font-semibold text-base` | Pokémon names inside tiles, compare cards, team slots. Content, not a title. |
| Body | Inter 400 | 14px / 1.6 | `text-sm leading-relaxed` | Descriptions, fun facts, subtitles. Under 70 characters per line. |
| Label | Inter 400 | 12px, ink muted | `text-xs text-ink-muted` | Row labels. Sentence case. |
| Reading | JetBrains Mono 700 | 12px rows, 24px feature | `font-mono font-bold text-xs` / `text-2xl` | Numbers only. Tabular figures. |
| Chip | Inter 500 | 12px | `text-xs font-medium` | Chips, badges, pills. |

No uppercase text anywhere. No letter-spacing. Headings never get a colour other than ink; the frame already carries the colour. If Dela Gothic at 13px turns out too loud in use, the fallback is Inter 600 in ink, still sentence case; nothing else about the cell changes.

### Space and radius

- 4px base. Cell padding is 16px (`p-4`); the detail hero may use 24px (`p-6`) because artwork needs air.
- Gap between cells, and between bands, is 12px on phone and 16px from iPad up (`gap-3 md:gap-4`). Nothing else separates content.
- Cell radius is 24px (`rounded-3xl`) everywhere, including lister tiles. It matches the nav pill and iOS widgets.
- Inner radius is concentric: cell radius minus cell padding, so 8px (`rounded-lg`) for blocks inside a 16px-padded cell, 12px (`rounded-xl`) inside a 12px-padded one. Chips, pills and badges are `rounded-full`.
- Touch targets are at least 44px tall on phone (`min-h-11`). Icon-only targets are 44×44.

### Grid

| Width | Columns | Gap | Devices |
| --- | --- | --- | --- |
| < 768 | 2 | 12 | iPhone, iPad split view |
| 768 to 1279 | 4 | 16 | iPad portrait, small laptop |
| ≥ 1280 | 6 | 16 | iPad landscape with keyboard, desktop |

Utility: `grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:grid-cols-6`. Cells span 1 or 2 columns, never more than half the row on iPad and up. Row height per band is fixed so cells in a band align (`auto-rows-[…]`), as the home already does. The lister grid is the same grid with every cell 1×1, so it adds a column step at each breakpoint (3/5/7/9 columns from the virtualiser).

The content container stays `max-w-7xl px-4 md:px-6`. The quiz reads better narrow and centres a `max-w-2xl` column; Battle centres a `max-w-3xl` column too; its setup cells did not pair up well in two columns, and one cell per row needs the narrower measure.

## 3. The cell

```
┌──────────────────────────────┐  2px frame, 24px radius, cell colour
│ Base stats                   │  cell title: Dela 13px, ink, no colour
│                              │
│  HP      45  ▓▓▓▓▓░░░░░      │  label 12 muted · reading mono · well track
│  Attack  49  ▓▓▓▓▓▓░░░░      │
│                              │
└──────────────────────────────┘
```

Anatomy, top to bottom: title (optional), content, actions (optional, as pills). Text is left-aligned. A cell whose content is artwork (tile, hero, game tile, Pokémon of the day) centres everything.

**Frame colour**

| The cell is about | Frame | Example |
| --- | --- | --- |
| One Pokémon | that Pokémon's colour | Every detail cell, lister tile, Pokémon of the day, compare card, team slot |
| One game | the game's colour | Game tiles on home and Play, the battle board |
| A generation | the region's type colour | Generation tiles |
| Nothing in particular | neutral frame | Fun facts, quiz board, settings, battle setup sections |
| An empty slot | neutral frame, dashed | Team slot, compare picker |

The border is `border-2`. Quiz answers may change the frame to good / bad on reveal; that is the only time a frame animates.

Some extracted accents are nearly white (Snorlax is `#eee3d6`) and vanish against the cell. The frame colour is therefore `color-mix(in srgb, var(--type-color) 85%, var(--color-ink))` in light mode and mixed towards white in dark mode, applied once in the `cell` class so every owner frame clears the cell colour by the same margin.

**Spotlight**

The radial glow `radial-gradient(circle at 50% 35%, <colour>33, transparent 65%)` sits under artwork only. Alpha is always `33` (20%). A text-only cell never has a glow.

**States for link cells** (tiles): `hover:-translate-y-0.5` on pointer devices, `active:scale-[0.98]` on all, `focus-visible:ring-2 ring-primary ring-offset-2`. No shadow on hover.

**Never:** box shadows, nested cells (use a well inside a cell), a heading above a cell, a cell wider than the band, a cell with a glow and no artwork.

## 4. Components

**Pill button.** `rounded-full px-5 min-h-11 text-sm font-semibold active:scale-95`. Three variants and no others:

| Variant | Look | Use |
| --- | --- | --- |
| Primary | act fill, white text | The one main action on a screen: Guess, Battle, Compare. |
| Quiet | well fill, ink text, `hover:bg-primary/12` | Secondary actions: Add to team, Reset, Random. |
| Outline | cell fill, neutral frame | Only when quiet would vanish on a well. |

Red, green or blue filled buttons do not exist. The red Pokédex pill on the home hero becomes primary: red reads as an error, and in this app it belongs to the Pokédex tab only.

When two pills share a row they split it 50/50 and fill it (`grid grid-cols-2 gap-2`), primary on the right. A pill on its own is content-width. Never three pills in a row; the third goes to a menu or a second row.

**Chip.** `rounded-full px-3 py-1 text-xs font-medium`, well fill. Tinted chips (hidden ability amber, baby pink, weak-to orange) keep today's tints at `/10` wash with the matching 700 text. A chip is never a button; if it navigates it is a type badge or a form pill.

**Type badge.** `rounded-full font-semibold capitalize`, type colour fill, contrast text. Three sizes: `icon` (28px circle, the type glyph only, name in `aria-label` and `title`), `sm` (12px label) and `md` (14px label). A Pokémon's types always sit on one row and never wrap. Tiles use `icon` on phone and `sm` from iPad up; the detail name cell and compare cards use `sm`; the type lister heading uses `md`. Glyphs come from one inline SVG sprite of the 18 type symbols (the Sword and Shield set as redrawn in duiker101's pokemon-type-svg-icons, MIT), white at 16px inside the circle.

**Form pill** (other forms, evolution entries): Pokémon-coloured 2px frame, 30% wash, artwork at 36px, name in Inter 500.

**Select.** The lister filter: `rounded-full border-2 min-h-11`. Idle: cell fill, neutral frame, ink text. Active: `border-primary/40 bg-primary/12 text-primary`. Chevron inline SVG. Options read "Kanto (Gen I)", not "Gen. I · Kanto".

**Well.** `rounded-lg bg-surface-sunken dark:bg-dark-raised`. Hosts inputs, bar tracks, segmented controls and option rows. Never framed.

**Segmented control.** A well, `rounded-full p-1`, with the selected segment in cell colour and `shadow-sm`. This is the only shadow inside a cell.

**Stat bar.** Track is a well `h-2 rounded-full`; fill is good / care / bad by value; grows once on first paint (`stat-bar`), staggered 80ms per row.

**Empty slot.** Neutral dashed frame, ink faint, one line of copy that says what to do: "Add a Pokémon".

**Skeleton.** `skeleton-shimmer` in the exact shape and radius of the cell it replaces.

## 5. Chrome

Chrome is everything that floats over the grid. It is the only place with blur and shadow, and it uses Inter only.

- **Bottom nav.** Kept as it is: floating pill plus search circle, `max-w-md`, `bottom-4`, standalone `bottom-[max(env(safe-area-inset-bottom),1rem)]`. Tabs carry the section tints. The settings sheet expands inside the pill.
- **Search overlay.** Full viewport, cell colour at 95% with blur. Input is a well. Results are option rows. Empty query shows recents here and only here.
- **Back.** Ink muted text link with chevron, `min-h-11`, labelled with the destination ("Pokédex", "Kanto", "Play"), never "Back". Not red; red belongs to the Pokédex tab.
- **Dialogs** (About): a cell with neutral frame and `shadow-2xl`, `max-w-md`, backdrop `black/50` with blur.

### iPhone, iPad and installed app

- `<html>` keeps `padding-top: env(safe-area-inset-top)` and `padding-bottom: calc(5.5rem + env(safe-area-inset-bottom))`; the viewport meta keeps `viewport-fit=cover`.
- `body` always has an explicit `background-color`; on phones the aurora fades to it by 90% height so Safari's toolbar strip matches.
- Standalone: `html { min-height: min(100lvh, calc(100% + env(safe-area-inset-top))) }` keeps the nav on the bottom edge on short pages.
- Manifest `theme_color` and `background_color` match the canvas (`#fefefe`), not red, so the splash and status bar do not flash a colour the app never shows. Add a dark `theme_color` via `<meta name="theme-color" media="(prefers-color-scheme: dark)">`.
- iPad: at 768+ the grid is 4 columns and the nav stays the same pill; split view at 320 to 507px drops to 2 columns like a phone. Hover states only apply under `(hover: hover)`.
- The viewport meta keeps `maximum-scale=1, user-scalable=no`. The app is for personal use, so the installed-app feel wins over pinch zoom.

## 6. Motion

Motion answers a touch or shows what changed. Nothing animates on scroll or on entry, except:

- Artwork morphs between tile and hero through the view transition (`pokemon-{id}`), the one orchestrated moment. On iOS it is a plain fade.
- Stat bars grow once per page.
- Buttons and tiles press (`active:scale-95` / `0.98`), 150ms.
- Overlays fade and sheets expand, 200ms.
- Game feedback (shiny burst, reel bounce, badge stamp) is allowed to be loud because the player caused it.

`prefers-reduced-motion: reduce` disables all of the above except opacity fades.

## 7. Words

- Sentence case everywhere, including cell titles and buttons.
- A cell title is the thing: "Base stats", "Evolution", "Who's that Pokémon?". Never a category word like "Information".
- A button says what happens: "Add to team", "Compare", "Guess", "Play again". Same verb before and after.
- A back link says where it goes: "Pokédex", not "Back".
- Labels are nouns, values are readings: "Height" / "0.7 m".
- Empty states say what to do, not what is missing: "Pick two Pokémon to compare".
- Errors say what happened and what to do: "Couldn't load this Pokémon. Try again."
- Subtitles are one sentence under 60 characters and only appear on tiles that have room (iPad and up).

## 8. Page recipes

Every page is a stack of bands. Nothing sits outside a cell except the lister filter row, which is a row of form pills.

**Home.** Unchanged in structure: hero cell (logo, app title, two pills), game tiles band, Pokémon of the day, wide game tiles, fun facts, generation row. Changes: the red Pokédex pill becomes primary; tile titles use the tile-title role on purpose instead of inheriting Dela through the base `h2` rule.

**Listers** (Pokédex, type, generation). Filter row, then the 1×1 tile grid. Tiles move to the 24px radius and the `33` spotlight; the ID watermark stays faint mono; types are icon badges on one row on phone, labelled from iPad up.

**Detail.** Three bands as today. Hero cell spans 2×2. All cells 24px radius. Cell titles become Dela sentence case in ink; the weak / resistant / immune sub-headings become Inter 600 sentence case in their tone colour. Height and weight are feature readings (mono 24px). Compare and Add to team are quiet pills.

**Play.** No page title. A 1×1 game tile per game with the game's frame colour, the mascot, the tile title and a subtitle from iPad up.

**Games** (quiz, compare, team, battle). The centred title and subtitle banner goes away. The first cell carries the game title (cell title role) and, where it exists, the running score as readings. Game boards get a neutral frame; Pokémon cards inside a game get the Pokémon's frame; setup sections in Battle become neutral-framed cells with a well for each option list. Quiz answer rows are wells that take a good or bad frame on reveal. The Battle target card shows the six stats as chips (Inter label, mono value) below `lg` and as stat bars from `lg` (label, mono value, well track filled against the same ceilings as the detail page); during play each bar also marks the value of the card you kept.

## 9. Migration, cheapest first

Each line is one commit. Nothing here changes behaviour.

1. Add the `frame` colour token and a `cell` component class to `global.css` (`rounded-3xl border-2 bg-white p-4 dark:bg-dark-surface`, frame colour from `--type-color` with the neutral frame as fallback). Remove the `h1, h2, h3 { font-family: display }` base rule so the display face is only ever chosen on purpose.
2. Detail page: switch `cellClass` and the hero to `cell`; replace `headingClass` with the cell-title role; sentence-case the defence sub-headings; back link to ink muted, labelled with the destination; Compare and Add to team as a 50/50 pill row.
3. Listers: tile radius and spotlight alpha; filter option label format; type glyph sprite and the `icon` badge size.
4. Home and Play: apply tile-title role explicitly; primary pill on the hero; drop the Play page title.
5. Games: remove the banner from `quiz`, `compare`, `team`; move title and score into the first cell; neutral frames on boards and setup sections; Pokémon frames on compare cards and team slots; paired pills split the row.
6. Settings sheet and search overlay: sentence-case the group labels; `min-h-11` on options.
7. Manifest: canvas theme and background colours, plus a dark `theme-color` meta.
8. Replace the generated `.claude/skills/design-system/SKILL.md` (it still says Inter and indigo) with a pointer to this file, and add one line to `CLAUDE.md` under Conventions.
