import { getPokemonImage, Pokemon } from '@utils/pokemon'

type PokemonTileProps = {
  pokemon: Pokemon
}

export function PokemonTile({ pokemon }: PokemonTileProps) {
  return (
    <div className="text-center p-4 border border-slate-800 rounded-xl">
      <a href={`/pokemon/${pokemon.name}`} title={pokemon.name}>
        <span className="block mb-4 font-bold text-xl capitalize text-ellipsis overflow-hidden whitespace-nowrap">
          {pokemon.name.replaceAll('-', ' ')}
        </span>
        <img
          className="aspect-square"
          src={getPokemonImage(pokemon)}
          alt={`${pokemon.name} official artwork`}
        />
      </a>
    </div>
  )
}
