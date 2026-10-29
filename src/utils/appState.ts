import type { RecentVisit } from '@/utils/recentVisits'
import { getRecentVisits, replaceRecentVisits } from '@/utils/recentVisits'

const KEY_PREFIX = 'poke-astro:'

type AppState = {
  v: 1
  local: Record<string, string>
  recents: RecentVisit[]
}

function readLocal(): Record<string, string> {
  const local: Record<string, string> = {}
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(KEY_PREFIX)) local[key] = localStorage.getItem(key) ?? ''
  }
  return local
}

export async function encodeAppState(): Promise<string> {
  const state: AppState = {
    v: 1,
    local: readLocal(),
    recents: await getRecentVisits(),
  }
  const bytes = new TextEncoder().encode(JSON.stringify(state))
  // ponytail: spread caps at ~100KB of state; chunk if history ever grows
  return btoa(String.fromCharCode(...bytes))
}

function decode(code: string): AppState {
  const bytes = Uint8Array.from(atob(code.trim()), (c) => c.charCodeAt(0))
  const state = JSON.parse(new TextDecoder().decode(bytes))
  const valid =
    state?.v === 1 &&
    typeof state.local === 'object' &&
    Array.isArray(state.recents) &&
    Object.entries(state.local).every(
      ([k, v]) => k.startsWith(KEY_PREFIX) && typeof v === 'string'
    )
  if (!valid) throw new Error('Invalid app state')
  return state
}

export async function restoreAppState(code: string): Promise<void> {
  const state = decode(code)
  for (const key of Object.keys(readLocal())) localStorage.removeItem(key)
  for (const [key, value] of Object.entries(state.local)) {
    localStorage.setItem(key, value)
  }
  await replaceRecentVisits(state.recents)
}
