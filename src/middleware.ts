import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()
  const { pathname } = context.url
  const contentType = response.headers.get('content-type') || ''

  if (pathname.startsWith('/api/')) {
    // API responses (JSON): cache aggressively at the edge. Pokemon data
    // rarely changes, so 1h edge cache + 1d stale-while-revalidate is safe.
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
    )
  } else if (contentType.includes('text/html')) {
    // HTML pages: must revalidate on every request. Cloudflare Workers
    // doesn't purge edge cache on deployment, so stale HTML would reference
    // old hashed CSS/JS filenames that no longer exist (unstyled flash).
    response.headers.set('Cache-Control', 'public, no-cache')
  }

  return response
})
