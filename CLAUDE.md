# CLAUDE.md

Pokédex built with Astro 7, React islands and Tailwind 4, using data from [PokéAPI](https://pokeapi.co/docs/v2).

## Commands

```bash
npm run dev          # background dev server on :4321 (astro dev stop|status|logs)
npm run build
npm run check        # Biome lint + format (does not parse .astro)
npm run check:types  # astro sync && tsc --noEmit --runExternalCode
```

## Conventions

- Import with `@/…` (`@/components/Header.astro`), never relative paths.
- `.astro` components by default; React `.tsx` only when interactive. Use `import type` for types.
- Tailwind utilities only. Biome sorts classes using `src/styles/global.css` for the theme.
- Exact dependency versions, no `^` or `~`. Bump Astro and all three adapters together.

## Architecture

- Routes live under `src/pages/[locale]/` (`en`, `es`; default `es`). Unprefixed pages redirect.
- Data: `getAllPokemon()` in `src/utils/pokemon.ts` loads the whole Pokédex (1302 entries) with one PokéAPI GraphQL query, memoised per process. It feeds every prerendered lister and the static `/api/pokemon/index.json`, which the client uses for search, quiz, compare and team. Detail pages still use the REST API.
- Listers (`pokedex`, `type/[type]`, `generation/[id]`) are prerendered with the full filtered list of `PokemonSummary` as island props; there is no paging and no client fetch. Play pages (`play`, `quiz`, `compare`, `team`) are prerendered shells with `client:only` islands.
- Detail pages are `.astro` markup rendered on the server (ISR on Vercel). Only the hero (shiny toggle, zoom), cry buttons, description carousel and recents are islands. Type effectiveness comes from the static chart in `typeEffectiveness.ts`, not from the API.
- Accent colours: `src/data/accentColors.json` holds one dominant colour per Pokémon, extracted from the official artwork. Regenerate with `NODE_USE_ENV_PROXY=1 node scripts/extract-accent-colors.mjs` when new Pokémon appear (it only fetches missing IDs).
- Caching: `src/middleware.ts` is the only place that sets `Cache-Control`. HTML is `no-cache` on Cloudflare only, because it doesn't purge on deploy; Vercel keeps its ISR headers. The service worker caches only `index.json` and static assets.
- Adapter: Node in dev; Cloudflare when `CF_PAGES`, `WORKERS_CI_BUILD_UUID` or `DEPLOY_TARGET=cloudflare` is set; Vercel otherwise.

## Gotchas

- **React runtime is [TanStack Redact](https://tanstack.com/redact)** (Vite plugin, client, SSR and prerender). Build with `REDACT=false` (or `0`, `off`) to use real React if an island misbehaves. CI runs `check` and `check:types` on every push and PR.
- **TypeScript 7.1 beta.** `.astro` files are checked through `@astrojs/ts-content-mapper`. `astro check` doesn't support TS 7, and the Astro editor extension may not either.
- The `@vercel/analytics/astro` entry in `tsconfig.json` `paths` works around a TS 7 error in that package. Remove it once upstream fixes it.
- Keep the `resolve-vite-env` plugin in `astro.config.mjs`: Vite's client still imports `@vite/env`.
- `experimental.clientPrerender` stays off, because ClientRouter can't use Speculation Rules prerenders. Detail links use `data-astro-prefetch="tap"`.
- View transitions run for real except on iOS, where `Layout.astro` replaces `startViewTransition` with a pass-through (Safari snapshot bugs). The detail hero carries `view-transition-name: pokemon-{id}`; tiles only carry it as `data-view-transition`, and `Layout.astro` assigns it to the clicked tile at click time. Never name every tile: each named element is snapshotted and animated separately.
- `getStaticPaths` and `index.json` need `beta.pokeapi.co` at build time. If the GraphQL endpoint is down the build fails; there is no REST fallback.
