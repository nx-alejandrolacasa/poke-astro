import { navigate } from 'astro:transitions/client'
import { useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { loadPokemonIndex } from '@/utils/pokemonIndex'
import { translations } from '@/utils/translations'

type RandomPokemonButtonProps = {
  locale: Locale
}

export function RandomPokemonButton({ locale }: RandomPokemonButtonProps) {
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
      className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-primary-600 active:scale-95 disabled:opacity-60"
    >
      <svg
        className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`}
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
      {t.home.randomPokemon}
    </button>
  )
}
