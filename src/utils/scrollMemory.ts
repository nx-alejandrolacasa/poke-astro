const PREFIX = 'poke-astro:scroll:'

export type ScrollSnapshot = { scrollY: number; itemCount: number }

export function saveScrollSnapshot(key: string, itemCount: number): void {
  if (typeof window === 'undefined') return
  try {
    const snap: ScrollSnapshot = { scrollY: window.scrollY, itemCount }
    sessionStorage.setItem(`${PREFIX}${key}`, JSON.stringify(snap))
  } catch {
    // sessionStorage may be disabled (private mode, quota) — fail silently
  }
}

export function getScrollSnapshot(key: string): ScrollSnapshot | null {
  if (typeof window === 'undefined') return null
  try {
    const v = sessionStorage.getItem(`${PREFIX}${key}`)
    if (v == null) return null
    const parsed = JSON.parse(v) as Partial<ScrollSnapshot>
    if (
      typeof parsed?.scrollY !== 'number' ||
      typeof parsed?.itemCount !== 'number'
    ) {
      return null
    }
    return { scrollY: parsed.scrollY, itemCount: parsed.itemCount }
  } catch {
    return null
  }
}
