import type { Pokemon } from './pokemon'

const DB_NAME = 'poke-astro'
const STORE_NAME = 'pokemon-pages'
const DB_VERSION = 2
// Pokémon data is effectively immutable; a week is plenty to refresh once the
// SW SWR has had a chance to revalidate while still booting from cache on
// return visits.
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

export type CachedPage = {
  page: number
  pageSize: number
  count: number
  results: Pokemon[]
  cachedAt: number
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('recent-visits')) {
        db.createObjectStore('recent-visits', { keyPath: 'name' })
      }
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function pageKey(page: number, pageSize: number) {
  return `page:${pageSize}:${page}`
}

export async function getCachedPage(
  page: number,
  pageSize: number
): Promise<CachedPage | null> {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).get(pageKey(page, pageSize))
      req.onsuccess = () => {
        const record = req.result as (CachedPage & { key: string }) | undefined
        if (!record) return resolve(null)
        if (Date.now() - record.cachedAt > MAX_AGE_MS) return resolve(null)
        resolve(record)
      }
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export async function getCachedPagesFrom(
  startPage: number,
  pageSize: number
): Promise<CachedPage[]> {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).getAll()
      req.onsuccess = () => {
        const all = (req.result as (CachedPage & { key: string })[]) ?? []
        const fresh = all.filter(
          (entry) =>
            entry.pageSize === pageSize &&
            entry.page >= startPage &&
            Date.now() - entry.cachedAt <= MAX_AGE_MS
        )
        fresh.sort((a, b) => a.page - b.page)
        // Only return a contiguous run starting at startPage — we don't want
        // to show pages 2 and 5 with a gap in between.
        const contiguous: CachedPage[] = []
        let expected = startPage
        for (const entry of fresh) {
          if (entry.page !== expected) break
          contiguous.push(entry)
          expected += 1
        }
        resolve(contiguous)
      }
      req.onerror = () => resolve([])
    })
  } catch {
    return []
  }
}

export async function putCachedPage(
  page: number,
  pageSize: number,
  data: { count: number; results: Pokemon[] }
): Promise<void> {
  try {
    const db = await openDb()
    const record = {
      key: pageKey(page, pageSize),
      page,
      pageSize,
      count: data.count,
      results: data.results,
      cachedAt: Date.now(),
    }
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(record)
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
      tx.onabort = () => resolve()
    })
  } catch {
    // best-effort cache; ignore failures
  }
}
