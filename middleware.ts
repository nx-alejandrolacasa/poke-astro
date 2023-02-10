export default function middleware(request: Request) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page')!

  if (url.pathname === '/pokedex' && page === '1') {
    url.searchParams.delete('page')
    return Response.redirect(url)
  }

  return undefined
}
