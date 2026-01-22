# CLAUDE.md - AI Assistant Guide

## Project Overview

This is a **Pokémon Pokédex application** built with Astro, React, and Tailwind CSS. It demonstrates a modern static-first web application using the PokéAPI to display Pokémon data with server-side rendering and selective client-side interactivity.

**Tech Stack:**
- **Framework:** Astro v5.16.10 (SSR mode with static prerendering)
- **UI Library:** React 19.1.0 (for interactive components)
- **Styling:** Tailwind CSS 4.1.0 (utility-first CSS via Vite plugin)
- **Language:** TypeScript 5.8.3 (strict mode)
- **Deployment:** Vercel (serverless)
- **Data Source:** PokéAPI (https://pokeapi.co/api/v2/)

---

## Directory Structure

```
poke-astro/
├── src/
│   ├── components/          # Reusable UI components (Astro + React)
│   │   ├── Header.astro              # Navigation header
│   │   ├── PokemonTile.tsx           # React card component
│   │   ├── PokemonTileFetcher.astro  # Server-side Pokémon fetcher
│   │   ├── PokemonTileFetcher.tsx    # Client-side Pokémon fetcher
│   │   └── PokemonInfiniteScroll.tsx # Infinite scroll component (React)
│   ├── layouts/             # Layout templates
│   │   └── Layout.astro              # Root layout wrapper
│   ├── pages/               # File-based routing (Astro)
│   │   ├── index.astro               # Home page (/)
│   │   ├── pokedex.astro             # Pokédex with infinite scroll (/pokedex)
│   │   ├── api/
│   │   │   └── pokemon/
│   │   │       └── page/
│   │   │           └── [page].ts     # API endpoint for fetching pages
│   │   └── pokemon/
│   │       └── [name].astro          # Individual Pokémon (/pokemon/pikachu)
│   ├── utils/               # Utility functions and helpers
│   │   └── pokemon.ts                # PokéAPI data fetching utilities
│   └── env.d.ts             # TypeScript environment definitions
├── public/                  # Static assets (served as-is)
│   ├── favicon.png
│   ├── pokemon-logo.svg
│   ├── loading.svg
│   └── not-found.svg
│   ├── styles/               # Global styles
│   │   └── global.css                # Tailwind imports and theme config
├── .github/workflows/       # GitHub Actions CI/CD
├── middleware.ts            # Astro middleware (URL cleanup)
├── astro.config.mjs         # Astro configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── prettier.config.js       # Prettier configuration
└── .eslintrc.mjs            # ESLint configuration
```

---

## Routing Patterns

Astro uses **file-based routing** (similar to Next.js):

| File Path | URL | Description |
|-----------|-----|-------------|
| `pages/index.astro` | `/` | Home page with featured Pokémon |
| `pages/pokedex.astro` | `/pokedex` | Infinite scroll Pokédex (loads all Pokémon progressively) |
| `pages/pokemon/[name].astro` | `/pokemon/pikachu`, `/pokemon/charmander`, ... | Individual Pokémon detail pages |
| `pages/api/pokemon/page/[page].ts` | `/api/pokemon/page/1`, `/api/pokemon/page/2`, ... | API endpoints for paginated Pokémon data |

**Key routing features:**
- Dynamic routes use `[param]` syntax
- Static generation via `getStaticPaths()` function (only for Pokemon detail pages)
- Prerendering enabled with `export const prerender = true`
- API routes support server-side rendering for on-demand data fetching
- Infinite scroll eliminates need for pre-generating all paginated routes

---

## Component Architecture

### Astro Components (`.astro`)
- **Server-side rendered** by default
- Zero JavaScript shipped to client unless specified
- Use frontmatter (`---`) for logic and imports
- Access props via `Astro.props`

**Example pattern:**
```astro
---
import Component from '@components/Component'

export interface Props {
  title: string
}

const { title } = Astro.props
---

<div>
  <h1>{title}</h1>
  <Component />
</div>
```

### React Components (`.tsx`)
- **Client-side interactive** components
- Must be explicitly hydrated with `client:*` directives
- Use standard React patterns (hooks, state, props)

**Example pattern:**
```tsx
import { getPokemonImage } from '@utils/pokemon'
import type { Pokemon } from '@utils/pokemon'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
}

export function PokemonTile({ loading = false, pokemon }: PokemonTileProps) {
  return (
    <div className="...">
      {/* component content */}
    </div>
  )
}
```

**Important:** Use `import type` for type-only imports to avoid bundling issues.

### Hydration Strategies
- `client:only="react"` - Only renders on client (used for Pagination)
- `client:load` - Hydrates immediately on page load
- `client:idle` - Hydrates when browser is idle
- `client:visible` - Hydrates when component is visible

---

## Import Aliases

TypeScript path aliases are configured in `tsconfig.json`:

```json
{
  "paths": {
    "@*": ["src/*"]
  }
}
```

**Usage:**
- `@components/Header.astro` → `src/components/Header.astro`
- `@layouts/Layout.astro` → `src/layouts/Layout.astro`
- `@utils/pokemon` → `src/utils/pokemon.ts`

**Always use aliases** for cleaner imports across the codebase.

---

## Styling Conventions

### Tailwind CSS
- **Utility-first** approach - use Tailwind classes directly in JSX/Astro
- **No separate CSS files** - all styling is inline with Tailwind utilities
- **Prettier plugin** automatically sorts Tailwind classes

**Common patterns:**
```astro
<!-- Responsive grid -->
<ul class="grid gap-4 grid-cols-2 md:grid-cols-3">

<!-- Centered container with max width -->
<main class="mx-auto p-6 max-w-5xl">

<!-- Interactive hover states -->
<div class="border border-white hover:border-slate-500 rounded-xl shadow-lg">

<!-- Responsive text sizing -->
<span class="text-sm md:text-md xl:text-xl">
```

### Global Styles
- Tailwind CSS imported via `src/styles/global.css`
- Global CSS file imported in `Layout.astro`
- Minimal global styles in `Layout.astro` using `<style is:global>`
- Only for truly global styles (like font-family)

---

## Data Fetching Patterns

### Build-time Fetching (Static Generation)
Used in pages with `export const prerender = true`:

```astro
---
export const prerender = true
import { fetchPokemonCount, fetchPokemonPage } from '@utils/pokemon'

const PAGE_SIZE = 24

export async function getStaticPaths() {
  // Optimized: Only fetch the count, not all Pokémon data
  const totalPokemon = await fetchPokemonCount()
  const totalPages = Math.ceil(totalPokemon / PAGE_SIZE)

  // Generate paths for all pages
  const paths = []
  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: { page: String(i) },
      props: { pageNumber: i, totalPokemon },
    })
  }
  return paths
}

const { pageNumber, totalPokemon } = Astro.props
// Fetch only the 24 Pokémon for this specific page
const pokemonPage = await fetchPokemonPage(pageNumber, PAGE_SIZE)
---
```

### Utility Functions (`src/utils/pokemon.ts`)

**Performance-Optimized Functions (Recommended):**
- `fetchPokemonCount(): Promise<number>` - Get total count without fetching all data (1 API call)
- `fetchPokemonPage(page: number, pageSize?: number): Promise<PokemonList>` - Fetch specific page (24 Pokémon, ~25 API calls)
- `fetchAllPokemonNames(): Promise<string[]>` - Get all names only, no full data (1 API call)
- `fetchPokemonByName(name: string): Promise<Pokemon>` - Fetch single Pokémon by name

**Deprecated Functions:**
- `fetchAllPokemon(): Promise<PokemonList>` - ⚠️ **Deprecated**: Very slow, fetches thousands of API requests

**Helper Functions:**
- `getPokemonImage(pokemon: Pokemon): string` - Extract official artwork URL
- `getPokemonName(name: string): string` - Convert kebab-case to Title Case

### Type Definitions
All API responses are typed:
```typescript
type Pokemon = {
  height: number
  name: string
  order: number
  sprites: { other: { 'official-artwork': { front_default: string } } }
  types: { type: { name: string } }[]
  weight: number
}
```

---

## Development Workflow

### Commands
```bash
npm install           # Install dependencies
npm run dev           # Start dev server at localhost:3000
npm run build         # Build production site to ./dist/
npm run preview       # Preview build locally
npm run astro --help  # Astro CLI help
```

### Code Quality Tools

**ESLint:**
- Config: `.eslintrc.mjs`
- Plugins: `astro`, `tailwindcss`
- Parser: `astro-eslint-parser` for `.astro` files

**Prettier:**
- Config: `prettier.config.js`
- Plugin: `prettier-plugin-tailwindcss` (auto-sorts classes)

**TypeScript:**
- Config: `tsconfig.json`
- Extends: `astro/tsconfigs/strict`
- JSX: React JSX runtime

### Git Workflow
- **Main branch:** Primary development branch
- **CI/CD:** GitHub Actions (`.github/workflows/_studio.yml`)
- **Commits:** Clear, descriptive commit messages
- **Deployment:** Automatic deployment to Vercel on push

---

## Key Conventions for AI Assistants

### File Creation Guidelines
1. **Prefer editing existing files** over creating new ones
2. **New Astro pages** go in `src/pages/` (creates routes automatically)
3. **New components:**
   - Server-rendered → `src/components/*.astro`
   - Client-interactive → `src/components/*.tsx`
4. **Utilities** → `src/utils/*.ts`
5. **Static assets** → `public/` (served at root URL)

### Code Style Rules
1. **Use TypeScript** for all new `.ts` and `.tsx` files
2. **Define prop types** for all components (interfaces/types)
3. **Use import aliases** (`@components`, `@utils`, etc.)
4. **Tailwind utilities** over custom CSS
5. **Descriptive variable names** (no single-letter vars except loop indices)
6. **Functional components** for React (no class components)

### Performance Best Practices
1. **Default to Astro components** (zero JS by default)
2. **Only use React** when client-side interactivity is needed
3. **Use `prerender = true`** for static pages
4. **Optimize images** (use appropriate formats and sizes)
5. **Lazy load** heavy components with `client:idle` or `client:visible`

### Common Patterns

**Astro page with dynamic route:**
```astro
---
export const prerender = true

export async function getStaticPaths() {
  const data = await fetchData()
  return data.map(item => ({ params: { id: item.id }, props: { item } }))
}

const { item } = Astro.props
---

<Layout title={item.title}>
  <!-- content -->
</Layout>
```

**React component with TypeScript:**
```tsx
import { ComponentType } from 'react'

type ComponentProps = {
  prop1: string
  prop2?: number
}

export function Component({ prop1, prop2 = 0 }: ComponentProps) {
  return <div>{prop1} - {prop2}</div>
}
```

**Using React in Astro:**
```astro
---
import { InteractiveComponent } from '@components/InteractiveComponent'
---

<InteractiveComponent client:only="react" someProp="value" />
```

### Testing Changes
1. Run `npm run dev` and test locally
2. Check responsive design (mobile, tablet, desktop)
3. Verify all links work
4. Test in production build: `npm run build && npm run preview`
5. Check TypeScript types: `npm run astro check`

### Deployment
- **Platform:** Vercel (serverless)
- **Config:** `astro.config.mjs` with `adapter: vercel()`
- **Output mode:** `server` (SSR with selective prerendering)
- **Auto-deploy:** Pushes to main branch trigger deployment

---

## Common Tasks

### Adding a New Page
1. Create `src/pages/your-page.astro`
2. Use `Layout` component for consistent structure
3. Add `export const prerender = true` if static
4. Import necessary components with aliases

### Adding a New Component
1. Decide: Astro (`.astro`) or React (`.tsx`)?
2. Create in `src/components/`
3. Define prop types/interfaces
4. Export component (React) or use directly (Astro)
5. Import with alias: `@components/ComponentName`

### Modifying Styles
1. Use Tailwind utility classes
2. Check responsive variants: `md:`, `xl:`, etc.
3. Use hover states: `hover:border-slate-500`
4. Prettier will auto-sort classes

### API Integration
1. Add types in `src/utils/*.ts`
2. Create async fetch functions
3. Use in `getStaticPaths()` or component logic
4. Handle errors and loading states

---

## Environment Configuration

**Astro Config (`astro.config.mjs`):**
```javascript
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  output: 'server',                    // SSR mode
  integrations: [react()],             // React integration
  adapter: vercel({
    edgeMiddleware: false,             // Disable edge middleware for astro:middleware compatibility
  }),
  vite: {
    plugins: [tailwindcss()],          // Tailwind v4 via Vite plugin
  },
})
```

**TypeScript Config (`tsconfig.json`):**
```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "./",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "paths": { "@*": ["src/*"] }
  }
}
```

**Tailwind Config (`tailwind.config.js`):**
```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Tailwind CSS Import (`src/styles/global.css`):**
```css
@import "tailwindcss";

@theme {
  /* Custom theme configuration can go here */
}
```

---

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run astro check`
- Verify all imports use correct aliases
- Ensure all dynamic routes have `getStaticPaths()`

### Styling Not Applied
- Verify Tailwind classes are in `content` paths
- Check for typos in class names
- Ensure no conflicting CSS

### Component Not Interactive
- Add `client:*` directive to React components in Astro files
- Verify component is exported correctly
- Check browser console for errors

### API Fetching Issues
- Verify PokéAPI endpoint is correct
- Check network requests in browser DevTools
- Ensure types match API response structure

---

## Resources

- **Astro Docs:** https://docs.astro.build
- **Tailwind Docs:** https://tailwindcss.com/docs
- **PokéAPI Docs:** https://pokeapi.co/docs/v2
- **React Docs:** https://react.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs

---

## Project-Specific Notes

### Middleware
The `middleware.ts` file uses the Astro 5 middleware API with `defineMiddleware`:
```typescript
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((context, next) => {
  // Middleware logic
  return next()
})
```
- Redirects `/pokedex?page=1` to `/pokedex` for clean URLs
- Keeps other query parameters intact
- Uses the new `onRequest` export pattern (not default export)

### Infinite Scroll
- Uses `react-intersection-observer` for detecting when to load more
- Loads 24 Pokémon per page progressively as user scrolls
- Initial page (first 24) pre-rendered at build time for instant page load
- Subsequent pages fetched client-side via API endpoints
- Shows loading indicator while fetching
- Displays "You've caught 'em all!" message when reaching the end

### Image Handling
- Official artwork from PokéAPI sprites
- Fallback to `/not-found.svg` if image unavailable
- Loading state shows `/loading.svg`
- All images in `public/` directory

### Static Generation
- All pages are prerendered at build time
- `getStaticPaths()` generates all possible routes
- Enables fast page loads and SEO optimization
- Deployment creates static files + serverless functions

---

**Last Updated:** 2026-01-22
**Astro Version:** 5.16.10
**React Version:** 19.1.0
**Tailwind CSS Version:** 4.1.0
**TypeScript Version:** 5.8.3
**Node Version:** 20.x (recommended)

---

## Upgrade Notes (January 2026)

This project was upgraded from legacy versions to the latest stable releases:

### Major Version Upgrades
- **Astro:** 2.0.10 → 5.16.10 (3 major versions)
- **React:** 18.2.0 → 19.1.0 (1 major version)
- **Tailwind CSS:** 3.2.6 → 4.1.0 (1 major version)
- **TypeScript:** 4.9.5 → 5.8.3 (1 major version)

### Key Breaking Changes Addressed

**Astro 5:**
- Migrated middleware from default export to `onRequest` named export with `defineMiddleware`
- Updated Vercel adapter import from `@astrojs/vercel/serverless` to `@astrojs/vercel`
- Removed deprecated `@astrojs/tailwind` integration
- Type imports now use `import type` syntax for better tree-shaking

**Tailwind CSS 4:**
- Migrated from `@astrojs/tailwind` integration to `@tailwindcss/vite` plugin
- Created `src/styles/global.css` for Tailwind imports
- Updated config from CommonJS (`.cjs`) to ES modules (`.js`)
- Configuration now uses `@import "tailwindcss"` and `@theme` directive

**React 19:**
- Updated all React component type definitions
- Compatible with new React 19 features and hooks

**Dependencies:**
- All dependencies use fixed versions (no semver ranges) for security
- ESLint and Prettier updated to latest stable versions

**Performance Optimizations:**
- Replaced pagination with infinite scroll for better UX and faster builds
- **Build time drastically reduced**: Only pre-renders first page instead of all pages (~99% reduction)
- Infinite scroll loads 24 Pokémon at a time as user scrolls
- Created API endpoints (`/api/pokemon/page/[page]`) for on-demand data fetching
- Individual Pokémon pages now fetch only names list for static path generation
- New optimized functions: `fetchPokemonCount()`, `fetchPokemonPage()`, `fetchAllPokemonNames()`
- Intersection Observer API for efficient scroll detection
- Build completes in seconds instead of minutes
