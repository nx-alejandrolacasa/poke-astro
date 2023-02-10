export default function middleware(request) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page')

  if (url.pathname === '/pokedex' && page === 1) {
    url.pathname = '/pokedex'
    return Response.redirect(url)
  }

  return undefined
}
