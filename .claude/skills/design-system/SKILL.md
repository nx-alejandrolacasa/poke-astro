---
name: design-system
description: poke-astro visual rules. Read before writing or changing any markup or Tailwind classes in this repo.
---

The design system lives in `docs/design-system.md`. Read it before touching markup; it is the source of truth and this file only points at it.

The five rules in one breath:

1. Everything is a cell on one grid. Use the `cell` class (24px radius, 2px frame, `p-4`). Add `cell-own` and an inline `--type-color` when the cell is about one Pokémon or one game; otherwise the frame stays neutral.
2. Frame colour means ownership. No other frame colours, no shadows on cells, no nested cells (use a well: `rounded-lg bg-surface-sunken dark:bg-dark-raised`).
3. Dela Gothic One only for cell titles: `font-display text-[13px] text-ink dark:text-dark-ink`. Tile titles are Dela 18. Never uppercase, never letter-spacing, headings never coloured.
4. JetBrains Mono only for numbers.
5. Ghost Purple (`primary`) marks interactive or selected things only. One primary pill per screen; two pills sharing a row use `grid grid-cols-2 gap-2`, primary on the right.

Sentence case everywhere. Buttons say what happens, back links say where they go, empty slots say what to do. Type badges never wrap: `size="icon"` on narrow tiles.
