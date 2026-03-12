import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage } from '@utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { getTypeColor } from '@/utils/typeColors'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

export function PokemonTile({ loading = false, pokemon, locale }: PokemonTileProps) {
  const primaryType = pokemon.types[0]?.type.name || 'normal'
  const typeColor = getTypeColor(primaryType)

  return (
    <div
      className="group relative overflow-hidden rounded-3xl shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
      style={{
        background: `linear-gradient(to bottom, var(--bg-card), ${typeColor.light}40)`,
        borderBottom: `3px solid ${typeColor.medium}80`,
      }}
    >
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name} className="block">
        {/* Type color glow behind the image */}
        <div
          className="absolute bottom-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
          style={{ backgroundColor: typeColor.accent }}
        />

        <div className="relative p-3 pb-1">
          {/* Number badge */}
          <span
            className="absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 font-heading text-[10px] font-bold md:text-xs"
            style={{ backgroundColor: `${typeColor.light}`, color: typeColor.dark }}
          >
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
          <span
            className="block truncate font-heading text-sm font-semibold capitalize md:text-base"
            style={{ color: typeColor.dark }}
          >
            {pokemon.name.replaceAll('-', ' ')}
          </span>
          {/* Type dots */}
          <div className="mt-1 flex items-center justify-center gap-1">
            {pokemon.types.map(({ type }) => {
              const tc = getTypeColor(type.name)
              return (
                <span
                  key={type.name}
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: tc.accent }}
                  title={type.name}
                />
              )
            })}
          </div>
        </div>
      </a>
    </div>
  )
}
