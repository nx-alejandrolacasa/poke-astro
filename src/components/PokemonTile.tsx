import type { Pokemon } from '@utils/pokemon'
import { getPokemonImage } from '@utils/pokemon'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
}

export function PokemonTile({ loading = false, pokemon }: PokemonTileProps) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-4 text-center shadow-lg transition-all hover:border-primary hover:shadow-xl hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-800">
      <a href={`/pokemon/${pokemon.name}`} title={pokemon.name}>
        <span className="mb-4 block overflow-hidden text-ellipsis whitespace-nowrap font-bold text-gray-900 text-sm capitalize md:text-md xl:text-xl dark:text-gray-100">
          {pokemon.name.replaceAll('-', ' ')}
        </span>
        <img
          className="aspect-square w-full"
          src={loading ? '/loading.svg' : getPokemonImage(pokemon)}
          alt={`${pokemon.name} official artwork`}
        />
      </a>
    </div>
  )
}
