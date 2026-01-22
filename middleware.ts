import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url)
  const page = url.searchParams.get('page')

  if (url.pathname === '/pokedex' && page === '1') {
    url.searchParams.delete('page')
    return Response.redirect(url)
  }

  return next()
})
