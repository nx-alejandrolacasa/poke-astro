import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Adapter: Vercel when VERCEL is set, skip in dev mode, default to Cloudflare
async function getAdapter() {
  if (process.env.VERCEL) {
    const vercel = (await import('@astrojs/vercel')).default
    return vercel()
  }
  // Skip adapter in dev mode for clean local DX
  if (process.argv.includes('dev')) {
    return undefined
  }
  // Default to Cloudflare for production builds
  const cloudflare = (await import('@astrojs/cloudflare')).default
  return cloudflare()
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: await getAdapter(),
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['vite'],
    },
  },

  // Responsive images (stable in Astro 6, previously experimental)
  image: {
    layout: 'constrained',
  },

  // Experimental features
  experimental: {
    // Rust compiler: faster builds and better diagnostics (replaces Go compiler)
    // Requires @astrojs/compiler-rs native bindings — enable only when available
    // Disabled: causes @vite/env virtual module resolution failure in dev
    // rustCompiler: await import('@astrojs/compiler-rs')
    //   .then(() => true)
    //   .catch(() => false),
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
