import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { loadPokemonIndex } from '@/utils/pokemonIndex'
import { translations } from '@/utils/translations'

type RandomPokemonTileProps = {
  locale: Locale
}

const ACCENT = '#705898'

export function RandomPokemonTile({ locale }: RandomPokemonTileProps) {
  const t = translations[locale]
  const [busy, setBusy] = useState(false)

  const surprise = async () => {
    setBusy(true)
    try {
      const species = (await loadPokemonIndex()).filter((p) => p.isDefault)
      const pick = species[Math.floor(Math.random() * species.length)]
      navigate(`/${locale}/pokemon/${pick.name}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={surprise}
      disabled={busy}
      className="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white p-4 text-center transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-60 dark:bg-dark-surface"
      style={{
        border: `2px solid ${ACCENT}`,
        backgroundImage: `radial-gradient(circle at 50% 35%, ${ACCENT}40, transparent 65%)`,
      }}
    >
      <svg
        className={`h-10 w-10 text-primary transition-transform group-hover:rotate-12 dark:text-dark-primary ${busy ? 'animate-spin' : ''}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8" cy="8" r="1" fill="currentColor" />
        <circle cx="16" cy="8" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="8" cy="16" r="1" fill="currentColor" />
        <circle cx="16" cy="16" r="1" fill="currentColor" />
      </svg>
      <span className="font-bold text-ink dark:text-dark-ink">
        {t.home.randomPokemon}
      </span>
    </button>
  )
}
