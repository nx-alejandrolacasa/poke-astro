import { fileURLToPath } from 'node:url'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Detect dev mode via npm script name (set by npm to "dev", "build", "preview", etc.)
const isDev = process.env.npm_lifecycle_event === 'dev' || process.env.npm_lifecycle_event === 'start'

// Adapter: Node for dev; Cloudflare when running on Cloudflare Pages
// (CF_PAGES) or Workers Builds (WORKERS_CI_BUILD_UUID), or when explicitly
// requested via DEPLOY_TARGET=cloudflare. Defaults to Vercel for builds.
const isCloudflareCI =
  !!process.env.CF_PAGES ||
  !!process.env.WORKERS_CI_BUILD_UUID ||
  process.env.DEPLOY_TARGET === 'cloudflare'

const adapter = await (async () => {
  if (isDev) {
    const node = (await import('@astrojs/node')).default
    return node({ mode: 'standalone' })
  }
  if (isCloudflareCI) {
    const cloudflare = (await import('@astrojs/cloudflare')).default
    return cloudflare()
  }
  const vercel = (await import('@astrojs/vercel')).default
  return vercel()
})()

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter,
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      // Workaround: Vite 7 Environment API processes client.mjs through
      // EnvironmentPluginContainer where @vite/env virtual module can't resolve.
      // Map it to the actual file on disk.
      {
        name: 'resolve-vite-env',
        resolveId(id) {
          if (id === '@vite/env') {
            return fileURLToPath(new URL('node_modules/vite/dist/client/env.mjs', import.meta.url))
          }
        },
      },
    ],
  },

  // Responsive images (stable in Astro 6, previously experimental)
  image: {
    layout: 'constrained',
  },

  // Experimental features
  experimental: {
    // Queued rendering: up to 2x faster rendering with queue-based engine
    queuedRendering: {
      enabled: true,
    },
    // Chrome DevTools workspace support for live editing
    chromeDevtoolsWorkspace: true,
    // Client-side prerendering with Speculation Rules API
    clientPrerender: true,
    // Content collection intellisense in editors
    contentIntellisense: true,
    // SVGO optimization for SVG assets
    svgo: true,
  },
})
