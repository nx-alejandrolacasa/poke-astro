import { defineMiddleware } from 'astro:middleware'

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
  } else if (contentType.includes('text/html')) {
    // HTML pages: must revalidate on every request. Cloudflare Workers
    // doesn't purge edge cache on deployment, so stale HTML would reference
    // old hashed CSS/JS filenames that no longer exist (unstyled flash).
    response.headers.set('Cache-Control', 'public, no-cache')
  }

  return response
})
