import { defineConfig } from 'astro/config'

// https://astro.build/config
import react from '@astrojs/react'

// https://astro.build/config
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
import vercel from '@astrojs/vercel/serverless'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [react(), tailwind()],
  adapter: vercel(),
})
