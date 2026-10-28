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
- Listers (`pokedex`, `type/[type]`, `generation/[id]`) are prerendered. Detail pages are SSR (ISR on Vercel).
- Infinite scroll: `VirtualPokemonGrid` places results at index `(page-1)*pageSize+i`, so `/api/*` pages must be full. Fetch Pokémon by species ID, because species names can 404 at `/pokemon/{name}`.
- Caching: `src/middleware.ts` is the only place that sets `Cache-Control`. HTML is `no-cache` on purpose, because Cloudflare doesn't purge on deploy. Client pages are cached in IndexedDB (`pokemonPagesCache.ts`).
- Adapter: Node in dev; Cloudflare when `CF_PAGES`, `WORKERS_CI_BUILD_UUID` or `DEPLOY_TARGET=cloudflare` is set; Vercel otherwise.

## Gotchas

- **React runtime is [TanStack Redact](https://tanstack.com/redact)** (Vite plugin, client, SSR and prerender). Build with `REDACT=false` (or `0`, `off`) to use real React if an island misbehaves. CI runs `check` and `check:types` on every push and PR.
- **TypeScript 7.1 beta.** `.astro` files are checked through `@astrojs/ts-content-mapper`. `astro check` doesn't support TS 7, and the Astro editor extension may not either.
- The `@vercel/analytics/astro` entry in `tsconfig.json` `paths` works around a TS 7 error in that package. Remove it once upstream fixes it.
- Keep the `resolve-vite-env` plugin in `astro.config.mjs`: Vite's client still imports `@vite/env`.
- `experimental.clientPrerender` stays off, because ClientRouter can't use Speculation Rules prerenders. Detail links use `data-astro-prefetch="tap"`.
