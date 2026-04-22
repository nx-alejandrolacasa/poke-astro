export type RecentVisit = {
  name: string
  displayName: string
  id: number
  typeColor: string
  types: string[]
  visitedAt: number
}

const DB_NAME = 'poke-astro'
const STORE_NAME = 'recent-visits'
const DB_VERSION = 1
// Store 6 so that when the current pokemon lands at the top, we still have
// 5 others to render as pills.
const MAX_VISITS = 6

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'name' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function getRecentVisits(): Promise<RecentVisit[]> {
  try {
    const db = await openDb()
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const req = tx.objectStore(STORE_NAME).getAll()
      req.onsuccess = () => {
        const all = (req.result as RecentVisit[]) ?? []
        resolve(all.sort((a, b) => b.visitedAt - a.visitedAt))
      }
      req.onerror = () => resolve([])
    })
  } catch {
    return []
  }
}

export async function addRecentVisit(
  visit: Omit<RecentVisit, 'visitedAt'>
): Promise<void> {
  try {
    const db = await openDb()
    const record: RecentVisit = { ...visit, visitedAt: Date.now() }
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.put(record)

      const allReq = store.getAll()
      allReq.onsuccess = () => {
        const all = (allReq.result as RecentVisit[]) ?? []
        all.sort((a, b) => b.visitedAt - a.visitedAt)
        for (const v of all.slice(MAX_VISITS)) {
          store.delete(v.name)
        }
      }
      tx.oncomplete = () => resolve()
      tx.onerror = () => resolve()
      tx.onabort = () => resolve()
    })
  } catch {
    // swallow — recent-visits is a best-effort enhancement
  }
}
