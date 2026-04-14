import { TypeBadge } from '@/components/TypeBadge'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage, getTypeColor } from '@utils/pokemon'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
  locale: Locale
}

export function PokemonTile({
  loading = false,
  pokemon,
  locale,
}: PokemonTileProps) {
  const typeColor = getTypeColor(pokemon)
  const t = translations[locale]

  return (
    <div
      className="shadow-md overflow-hidden rounded-2xl bg-white p-4 text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] dark:bg-dark-surface"
      style={{ border: `2px solid ${typeColor}` }}
    >
      <a href={`/${locale}/pokemon/${pokemon.name}`} title={pokemon.name}>
        <div className="relative aspect-square w-full">
          <span className="absolute top-0 right-0 z-0 font-black font-mono text-sm text-ink/20 md:text-base dark:text-dark-ink/20">
            #{pokemon.order.toString().padStart(3, '0')}
          </span>
          <img
            className="relative z-10 aspect-square w-full drop-shadow-sm"
            src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-ink text-base capitalize dark:text-dark-ink">
            {pokemon.name.replaceAll('-', ' ')}
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {pokemon.types.map((pt) => (
              <TypeBadge
                key={pt.type.name}
                type={pt.type.name}
                label={t.types[pt.type.name as keyof typeof t.types] ?? pt.type.name}
                size="sm"
              />
            ))}
          </div>
        </div>
      </a>
    </div>
  )
}
