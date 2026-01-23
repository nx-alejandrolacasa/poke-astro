import { getPokemonImage } from '@utils/pokemon'
import type { Pokemon } from '@utils/pokemon'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
}

export function PokemonTile({ loading = false, pokemon }: PokemonTileProps) {
  return (
    <div className="text-center p-4 border-2 border-gray-200 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-500 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-colors">
      <a href={`/pokemon/${pokemon.name}`} title={pokemon.name}>
        <span className="block mb-4 font-bold text-sm md:text-md xl:text-xl capitalize text-ellipsis overflow-hidden whitespace-nowrap text-gray-900 dark:text-gray-100">
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
