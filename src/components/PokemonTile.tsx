import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage } from '@utils/pokemon'
import type { Locale } from '@/utils/i18n'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

export function PokemonTile({ loading = false, pokemon, locale }: PokemonTileProps) {
  return (
    <div className="rounded-lg border-2 border-gray-200 bg-white p-2 text-center shadow-md transition-all hover:border-primary hover:shadow-lg hover:scale-[1.02] md:rounded-xl md:p-3 dark:border-gray-700 dark:bg-gray-800">
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name}>
        <div className="relative aspect-square w-full">
          {/* Order number - positioned behind the Pokemon image */}
          <div className="pointer-events-none absolute right-0.5 bottom-0.5 z-0 select-none font-black text-2xl text-gray-300/40 md:text-4xl dark:text-gray-400/50">
            #{pokemon.order.toString().padStart(3, '0')}
          </div>
          {/* Pokemon image - positioned in front */}
          <img
            className="relative z-10 aspect-square w-full"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>
        <span className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 text-xs capitalize md:mt-2 md:text-sm dark:text-gray-100">
          {pokemon.name.replaceAll('-', ' ')}
        </span>
      </a>
    </div>
  )
}
