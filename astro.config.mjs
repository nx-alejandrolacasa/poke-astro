import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
// Using function form to access the `command` parameter ("dev" | "build" | "preview")
export default defineConfig(async ({ command }) => {
  // Adapter: Vercel when VERCEL is set, Node for dev, default to Cloudflare for builds
  async function getAdapter() {
    if (process.env.VERCEL) {
      const vercel = (await import('@astrojs/vercel')).default
      return vercel()
    }
    if (command === 'dev') {
      const node = (await import('@astrojs/node')).default
      return node({ mode: 'standalone' })
    }
    const cloudflare = (await import('@astrojs/cloudflare')).default
    return cloudflare()
  }

  return {
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
  }
})
