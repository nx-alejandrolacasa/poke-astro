import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react()],
  adapter: vercel({
    edgeMiddleware: false, // Disable edge middleware to fix astro:middleware compatibility
  }),
  vite: {
    plugins: [tailwindcss()],
  },
})
