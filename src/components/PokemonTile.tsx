import { TypeBadge } from '@/components/TypeBadge'
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

  return (
    <div
      className="overflow-hidden rounded-2xl bg-white p-4 text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] dark:bg-dark-surface"
      style={{
        border: `2px solid ${accent}`,
        backgroundImage: `radial-gradient(circle at 50% 35%, ${accent}2e, transparent 65%)`,
      }}
    >
      <a
        href={`/${locale}/pokemon/${pokemon.name}`}
        title={pokemon.names[locale]}
        data-astro-prefetch="tap"
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
            style={{ viewTransitionName: `pokemon-${pokemon.id}` }}
          />
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block overflow-hidden text-base font-semibold text-ellipsis whitespace-nowrap text-ink dark:text-dark-ink">
            {pokemon.names[locale]}
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type}
                label={t.types[type as keyof typeof t.types] ?? type}
                size="sm"
              />
            ))}
          </div>
        </div>
      </a>
    </div>
  )
}
