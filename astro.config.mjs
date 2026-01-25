import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// Conditional adapter based on deployment platform
async function getAdapter() {
  if (process.env.VERCEL) {
    const vercel = (await import('@astrojs/vercel')).default
    return vercel()
  }
  const cloudflare = (await import('@astrojs/cloudflare')).default
  return cloudflare()
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: await getAdapter(),
  vite: {
    plugins: [tailwindcss()],
  },
})
