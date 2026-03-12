import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next()

  // HTML pages must not be edge-cached because Cloudflare Workers doesn't
  // purge its CDN cache on new deployments. Stale HTML references old hashed
  // asset filenames (CSS/JS) that no longer exist, causing an unstyled flash.
  // Hashed assets are already long-cached by the browser via their filenames.
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('text/html')) {
    response.headers.set(
      'Cache-Control',
      'public, no-cache'
    )
  }

  return response
})
