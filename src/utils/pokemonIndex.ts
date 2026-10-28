import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'

let indexPromise: Promise<PokemonRecord[]> | undefined

/** The static, prerendered Pokédex index. Fetched once per page lifetime. */
export function loadPokemonIndex(): Promise<PokemonRecord[]> {
  indexPromise ??= fetch('/api/pokemon/index.json')
    .then((res) => {
      if (!res.ok) throw new Error(`index.json ${res.status}`)
      return res.json() as Promise<PokemonRecord[]>
    })
    .catch((error) => {
      indexPromise = undefined
      throw error
    })
  return indexPromise
}

export function normalizeSearch(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

/**
 * Matches the slug, the localized name or the Pokédex number. Prefix matches
 * and default forms rank first so "char" shows Charmander before Charizard
 * Mega X.
 */
export function searchPokemon(
  index: PokemonRecord[],
  query: string,
  locale: Locale,
  limit: number
): PokemonRecord[] {
  const q = normalizeSearch(query).replaceAll(' ', '-')
  if (!q) return []
  const scored: { p: PokemonRecord; score: number }[] = []
  for (const p of index) {
    const slug = p.name
    const localized = normalizeSearch(p.names[locale]).replaceAll(' ', '-')
    let score = -1
    if (String(p.id) === q) score = 0
    else if (slug.startsWith(q) || localized.startsWith(q)) score = 1
    else if (slug.includes(q) || localized.includes(q)) score = 2
    if (score < 0) continue
    scored.push({ p, score: score * 2 + (p.isDefault ? 0 : 1) })
  }
  return scored
    .sort((a, b) => a.score - b.score || a.p.id - b.p.id)
    .slice(0, limit)
    .map((s) => s.p)
}
