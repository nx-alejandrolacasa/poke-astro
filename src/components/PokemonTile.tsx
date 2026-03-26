import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage, getTypeColor } from '@utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

export function PokemonTile({ loading = false, pokemon, locale }: PokemonTileProps) {
  const typeColor = getTypeColor(pokemon)
  const t = translations[locale]

  return (
    <div
      className="holo-shimmer rounded-sm border border-gray-200 bg-white p-2 text-center shadow-sm transition-all duration-200 active:scale-[0.97] active:shadow-md md:p-3 dark:border-dex-border dark:bg-dex-surface glow-border"
      style={{ borderLeftWidth: '3px', borderLeftColor: typeColor }}
    >
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name}>
        <div className="relative aspect-square w-full">
          <div className="pointer-events-none absolute right-0.5 bottom-0.5 z-0 select-none font-mono font-black text-2xl text-gray-300/30 md:text-4xl dark:text-gray-600/30">
            #{pokemon.order.toString().padStart(3, '0')}
          </div>
          <img
            className="relative z-10 aspect-square w-full drop-shadow-sm"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>
        <div className="mt-1 md:mt-2">
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 text-xs capitalize md:text-sm dark:font-mono dark:text-xs dark:uppercase dark:tracking-wider dark:text-gray-200">
            {pokemon.name.replaceAll('-', ' ')}
          </span>
          <span
            className="mt-0.5 block font-mono text-[9px] uppercase tracking-wider opacity-70"
            style={{ color: typeColor }}
          >
            {pokemon.types.map(pt => t.types[pt.type.name as keyof typeof t.types] ?? pt.type.name).join(' / ')}
          </span>
        </div>
      </a>
    </div>
  )
}
