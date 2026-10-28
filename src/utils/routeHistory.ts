/** Written by the inline route tracker in Layout.astro. */
const KEY = 'poke-astro:routes'

export function readRouteHistory(): string[] {
  try {
    const routes = JSON.parse(sessionStorage.getItem(KEY) ?? '[]')
    return Array.isArray(routes) ? routes : []
  } catch {
    return []
  }
}

export function isDetailRoute(pathname: string): boolean {
  return /^\/(en|es)\/pokemon\//.test(pathname)
}

/**
 * Where "back" should go from a detail page: the most recent route that is
 * not a detail page (the lister you came from, or whatever page preceded a
 * chain of evolution clicks). Null when there is none.
 */
export function lastNonDetailRoute(current: string): string | null {
  const routes = readRouteHistory()
  let i = routes.length - 1
  while (i >= 0 && routes[i] === current) i--
  for (; i >= 0; i--) {
    if (!isDetailRoute(routes[i])) return routes[i]
  }
  return null
}
