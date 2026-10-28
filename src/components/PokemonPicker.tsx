import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import { officialArtworkUrl, optimizedImageUrl } from '@/utils/pokemon'
import { searchPokemon } from '@/utils/pokemonIndex'
import { translations } from '@/utils/translations'

type PokemonPickerProps = {
  index: PokemonRecord[]
  locale: Locale
  placeholder?: string
  autoFocus?: boolean
  onPick: (pokemon: PokemonRecord) => void
}

export function PokemonPicker({
  index,
  locale,
  placeholder,
  autoFocus,
  onPick,
}: PokemonPickerProps) {
  const t = translations[locale]
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const results = searchPokemon(index, query, locale, 6)

  useEffect(() => setSelected(0), [])

  const pick = (pokemon: PokemonRecord) => {
    onPick(pokemon)
    setQuery('')
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selected]) {
      e.preventDefault()
      pick(results[selected])
    } else if (e.key === 'Escape') {
      setQuery('')
    }
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setSelected(0)
        }}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? t.search.placeholder}
        disabled={index.length === 0}
        // biome-ignore lint/a11y/noAutofocus: the picker is the page's only input and the user just asked to add a Pokémon
        autoFocus={autoFocus}
        className="w-full rounded-full border border-black/[0.06] bg-surface-sunken px-4 py-2.5 text-sm text-ink placeholder-ink-faint focus:border-primary/30 focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:opacity-50 dark:border-white/[0.06] dark:bg-dark-raised dark:text-dark-ink dark:placeholder-dark-ink-faint"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={results.length > 0}
        aria-label={placeholder ?? t.search.placeholder}
      />
      {results.length > 0 && (
        <div
          role="listbox"
          className="absolute top-full right-0 left-0 z-30 mt-2 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-lg shadow-black/[0.06] backdrop-blur-xl dark:border-white/[0.08] dark:bg-dark-surface/90"
        >
          {results.map((pokemon, i) => (
            <button
              key={pokemon.id}
              type="button"
              role="option"
              aria-selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => pick(pokemon)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${i === selected ? 'bg-primary-50 text-primary-700 dark:bg-primary/10 dark:text-primary' : 'text-ink dark:text-dark-ink'}`}
            >
              <img
                src={optimizedImageUrl(officialArtworkUrl(pokemon.id), 32)}
                alt=""
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
              <span className="font-medium">{pokemon.names[locale]}</span>
              <span className="ml-auto font-mono text-xs opacity-40">
                #{pokemon.id}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
