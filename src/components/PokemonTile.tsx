import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage, getTypeColor } from '@utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

const shadowPalettes = [
  'chromatic-shadow',
  'chromatic-shadow-b',
  'chromatic-shadow-c',
]

function getShadowClass(pokemonOrder: number): string {
  return shadowPalettes[pokemonOrder % shadowPalettes.length]
}

export function PokemonTile({ loading = false, pokemon, locale }: PokemonTileProps) {
  const typeColor = getTypeColor(pokemon)
  const t = translations[locale]
  const shadowClass = getShadowClass(pokemon.order)

  return (
    <div
      className={`${shadowClass} rounded-2xl bg-white p-3 text-center transition-all duration-300 active:scale-[0.97] md:p-4 dark:bg-dark-surface`}
    >
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name}>
        <div className="relative aspect-square w-full">
          <div className="pointer-events-none absolute right-0.5 bottom-0.5 z-0 select-none font-mono font-black text-2xl text-ink/[0.06] md:text-4xl dark:text-dark-ink/[0.08]">
            #{pokemon.order.toString().padStart(3, '0')}
          </div>
          <img
            className="relative z-10 aspect-square w-full drop-shadow-sm"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>
        <div className="mt-2 md:mt-3">
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink text-sm capitalize md:text-base dark:text-dark-ink">
            {pokemon.name.replaceAll('-', ' ')}
          </span>
          <span
            className="mt-0.5 block text-xs font-medium capitalize opacity-70"
            style={{ color: typeColor }}
          >
            {pokemon.types.map(pt => t.types[pt.type.name as keyof typeof t.types] ?? pt.type.name).join(' / ')}
          </span>
        </div>
      </a>
    </div>
  )
}
