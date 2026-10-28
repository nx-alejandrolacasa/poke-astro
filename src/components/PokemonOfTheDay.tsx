import { useEffect, useState } from 'react'
import { TypeBadge } from '@/components/TypeBadge'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import {
  officialArtworkUrl,
  optimizedImageUrl,
  typeColors,
} from '@/utils/pokemon'
import { loadPokemonIndex } from '@/utils/pokemonIndex'
import { translations } from '@/utils/translations'

type PokemonOfTheDayProps = {
  locale: Locale
}

const STORAGE_KEY = 'poke-astro:pokemon-of-the-day'

function localDateKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function readStoredPick(): { date: string; id: number } | null {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
  } catch {
    return null
  }
}

function pickForToday(index: PokemonRecord[]): PokemonRecord {
  const species = index.filter((p) => p.isDefault)
  const today = localDateKey()
  const stored = readStoredPick()
  const kept =
    stored?.date === today ? species.find((p) => p.id === stored.id) : undefined
  const chosen = kept ?? species[Math.floor(Math.random() * species.length)]
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ date: today, id: chosen.id })
  )
  return chosen
}

export function PokemonOfTheDay({ locale }: PokemonOfTheDayProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<PokemonRecord | null>(null)

  useEffect(() => {
    loadPokemonIndex()
      .then((index) => setPokemon(pickForToday(index)))
      .catch(() => {})
  }, [])

  if (!pokemon) {
    return (
      <div className="skeleton-shimmer h-full w-full rounded-3xl" aria-busy />
    )
  }

  const accent = pokemon.accent ?? typeColors[pokemon.types[0]] ?? '#a8a878'

  return (
    <a
      href={`/${locale}/pokemon/${pokemon.name}`}
      data-astro-prefetch="tap"
      className="group flex h-full flex-col items-center justify-center gap-1 rounded-3xl bg-white p-4 text-center transition-all hover:-translate-y-1 active:scale-[0.98] dark:bg-dark-surface"
      style={{
        border: `2px solid ${accent}`,
        backgroundImage: `radial-gradient(circle at 50% 35%, ${accent}40, transparent 65%)`,
      }}
    >
      <span className="text-[11px] font-bold tracking-wider text-ink-muted uppercase dark:text-dark-ink-muted">
        {t.home.pokemonOfTheDay}
      </span>
      <img
        src={optimizedImageUrl(officialArtworkUrl(pokemon.id), 256)}
        alt=""
        className="min-h-0 w-auto flex-1 object-contain transition-transform group-hover:scale-110"
        data-view-transition={`pokemon-${pokemon.id}`}
      />
      <span className="text-xl font-bold text-ink dark:text-dark-ink">
        <span className="mr-2 font-mono text-sm opacity-40">
          #{pokemon.id.toString().padStart(3, '0')}
        </span>
        {pokemon.names[locale]}
      </span>
      <div className="flex gap-1">
        {pokemon.types.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            label={t.types[type as keyof typeof t.types] ?? type}
          />
        ))}
      </div>
    </a>
  )
}
