import { defineMiddleware } from 'astro:middleware'

const isVercel = typeof process !== 'undefined' && !!process.env.VERCEL

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()
  const { pathname } = context.url
  const contentType = response.headers.get('content-type') || ''

  if (pathname.startsWith('/api/')) {
    // API responses (JSON): Pokémon data is effectively immutable, so cache
    // hard at the edge. Browsers still revalidate hourly, but the edge serves
    // 1-week-old bytes instantly and SWR refreshes for up to 30 days.
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=604800, stale-while-revalidate=2592000'
    )
  } else if (contentType.includes('text/html') && !isVercel) {
    // Cloudflare Workers doesn't purge its edge cache on deployment, so stale
    // HTML would reference hashed CSS/JS filenames that no longer exist.
    // Vercel's ISR cache is invalidated per deployment, so it keeps its own
    // headers.
    response.headers.set('Cache-Control', 'public, no-cache')
  }

  return response
})
