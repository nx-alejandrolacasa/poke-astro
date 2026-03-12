import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage } from '@utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { ptypeClass } from '@/utils/typeColors'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

export function PokemonTile({ loading = false, pokemon, locale }: PokemonTileProps) {
  const primaryType = pokemon.types[0]?.type.name || 'normal'

  return (
    <div className={`${ptypeClass(primaryType)} group relative overflow-hidden rounded-3xl tile-type shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg`}>
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name} className="block">
        {/* Type color glow behind the image */}
        <div className="tile-glow pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40" />

        <div className="relative p-3 pb-1">
          {/* Number badge */}
          <span className="pt-number absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 font-heading text-[10px] font-bold md:text-xs">
            #{pokemon.order.toString().padStart(3, '0')}
          </span>

          {/* Pokemon image */}
          <img
            className="relative z-10 aspect-square w-full transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-105"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>

        {/* Name section */}
        <div className="relative px-3 pb-3 pt-1 text-center">
          <span className="pt-text block truncate font-heading text-sm font-semibold capitalize md:text-base">
            {pokemon.name.replaceAll('-', ' ')}
          </span>
          {/* Type dots */}
          <div className="mt-1 flex items-center justify-center gap-1">
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`${ptypeClass(type.name)} pt-dot h-2 w-2 rounded-full`}
                title={type.name}
              />
            ))}
          </div>
        </div>
      </a>
    </div>
  )
}
