const STATIC_CACHE = 'pokedex-static-v5'
const API_CACHE = 'pokedex-api-v1'

const STATIC_ASSETS = [
  '/favicon.ico',
  '/favicon.svg',
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/pokemon-logo.svg',
  '/loading.svg',
  '/not-found.svg',
]

// API endpoints whose responses are safe to cache offline. Pokémon data is
// effectively immutable; stale-while-revalidate gives instant cache hits with
// silent background refresh.
const CACHEABLE_API_PATTERNS = [
  /^\/api\/pokemon\/page\/\d+$/,
  /^\/api\/pokemon\/names$/,
  /^\/api\/pokemon\/[^/]+\/enriched/,
  /^\/api\/generation\/[^/]+\/\d+$/,
  /^\/api\/type\/[^/]+\/\d+$/,
]

const API_CACHE_MAX_ENTRIES = 300

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  const keep = new Set([STATIC_CACHE, API_CACHE])
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => !keep.has(name)).map((name) => caches.delete(name))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(event.request, STATIC_CACHE))
    return
  }

  if (CACHEABLE_API_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(event.request, API_CACHE))
  }
  // Everything else (HTML, hashed build assets) goes to network untouched to
  // avoid serving stale shells with broken asset references.
})

function cacheFirst(request, cacheName) {
  return caches.match(request).then(
    (cached) =>
      cached ||
      fetch(request).then((response) => {
        const clone = response.clone()
        caches.open(cacheName).then((cache) => cache.put(request, clone))
        return response
      })
  )
}

function staleWhileRevalidate(request, cacheName) {
  return caches.open(cacheName).then((cache) =>
    cache.match(request).then((cached) => {
      const networkPromise = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone()
            cache.put(request, clone).then(() => trimCache(cacheName, API_CACHE_MAX_ENTRIES))
          }
          return response
        })
        .catch(() => cached)
      return cached || networkPromise
    })
  )
}

function trimCache(cacheName, maxEntries) {
  return caches.open(cacheName).then((cache) =>
    cache.keys().then((keys) => {
      if (keys.length <= maxEntries) return
      return Promise.all(
        keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key))
      )
    })
  )
}
