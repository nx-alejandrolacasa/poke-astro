import { getPokemonImage, Pokemon } from '@utils/pokemon'

type PokemonTileProps = {
  loading?: boolean
  pokemon: Pokemon
}

export function PokemonTile({ loading = false, pokemon }: PokemonTileProps) {
  return (
    <div className="text-center p-4 border border-white hover:border-slate-500 rounded-xl shadow-lg">
      <a href={`/pokemon/${pokemon.name}`} title={pokemon.name}>
        <span className="block mb-4 font-bold text-sm md:text-md xl:text-xl capitalize text-ellipsis overflow-hidden whitespace-nowrap">
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
