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
})
