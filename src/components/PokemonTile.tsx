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
    <div className="holo-shimmer rounded-xl border-2 border-gray-200 bg-white p-2 text-center shadow-md transition-all hover:border-primary-400 hover:shadow-lg hover:scale-[1.02] md:p-3 dark:border-dex-border dark:bg-dex-surface glow-border">
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name}>
        <div className="relative aspect-square w-full">
          <div className="pointer-events-none absolute right-0.5 bottom-0.5 z-0 select-none font-mono font-black text-2xl text-gray-300/40 md:text-4xl dark:text-neon-cyan/15">
            #{pokemon.order.toString().padStart(3, '0')}
          </div>
          <img
            className="relative z-10 aspect-square w-full"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>
        <span className="mt-1 block overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 text-xs capitalize md:mt-2 md:text-sm dark:font-mono dark:text-xs dark:uppercase dark:tracking-wider dark:text-gray-200">
          {pokemon.name.replaceAll('-', ' ')}
        </span>
      </a>
    </div>
  )
}
