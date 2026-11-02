import type { CSSProperties } from 'react'
import { TypeBadge } from '@/components/ui/TypeBadge'
import type { Locale } from '@/utils/i18n'
import type { PokemonSummary } from '@/utils/pokemon'
import {
  officialArtworkUrl,
  optimizedImageUrl,
  typeColors,
} from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type PokemonTileProps = {
  pokemon: PokemonSummary
  locale: Locale
}

export function PokemonTile({ pokemon, locale }: PokemonTileProps) {
  const accent = pokemon.accent ?? typeColors[pokemon.types[0]] ?? '#a8a878'
  const t = translations[locale]
  const badges = (size: 'icon' | 'sm') =>
    pokemon.types.map((type) => (
      <TypeBadge
        key={type}
        type={type}
        label={t.types[type as keyof typeof t.types] ?? type}
        size={size}
      />
    ))

  return (
    <div
      className="cell cell-own overflow-hidden text-center transition-all focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:-translate-y-0.5 active:scale-[0.98]"
      style={
        {
          '--type-color': accent,
          backgroundImage: `radial-gradient(circle at 50% 35%, ${accent}33, transparent 65%)`,
        } as CSSProperties
      }
    >
      <a
        href={`/${locale}/pokemon/${pokemon.name}`}
        title={pokemon.names[locale]}
        data-astro-prefetch="tap"
        className="focus:outline-none"
      >
        <div className="relative aspect-square w-full">
          <span className="absolute top-0 right-0 z-0 font-mono text-sm font-black text-ink/20 md:text-base dark:text-dark-ink/20">
            #{pokemon.id.toString().padStart(3, '0')}
          </span>
          <img
            className="relative z-10 aspect-square w-full"
            src={optimizedImageUrl(officialArtworkUrl(pokemon.id), 256)}
            alt={`${pokemon.names[locale]} official artwork`}
            loading="lazy"
            data-view-transition={`pokemon-${pokemon.id}`}
          />
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap text-ink dark:text-dark-ink">
            {pokemon.names[locale]}
          </span>
          <div className="flex justify-center gap-1 md:hidden">
            {badges('icon')}
          </div>
          <div className="hidden justify-center gap-1 md:flex">
            {badges('sm')}
          </div>
        </div>
      </a>
    </div>
  )
}
