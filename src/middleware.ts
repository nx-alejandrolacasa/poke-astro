import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()

  // Add cache headers for SSR pages to restore CDN edge caching performance.
  // Pages are cached for 1 hour at the CDN edge with stale-while-revalidate
  // for 1 day, giving near-static performance while keeping content fresh.
  // This compensates for the switch from prerendering to on-demand SSR
  // needed due to workerd prerender limitations (withastro/astro#15684).
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    )
  }

  return response
})
