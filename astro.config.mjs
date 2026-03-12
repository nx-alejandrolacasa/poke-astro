import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Conditional adapter based on deployment platform
async function getAdapter() {
  if (process.env.VERCEL) {
    const vercel = (await import('@astrojs/vercel')).default
    return vercel()
  }
  // Default to Cloudflare adapter (for Cloudflare Pages and local development)
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
  },

  // Responsive images (stable in Astro 6, previously experimental)
  image: {
    layout: 'constrained',
  },

  // Experimental features
  experimental: {
    // Rust compiler: faster builds and better diagnostics (replaces Go compiler)
    // Requires @astrojs/compiler-rs native bindings — enable only when available
    rustCompiler: await import('@astrojs/compiler-rs')
      .then(() => true)
      .catch(() => false),
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
