export type Pokemon = {
  height: number
  name: string
  order: number
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  types: { type: { name: string } }[]
  weight: number
}

export type PokemonList = {
  count: number
  results: Pokemon[]
}

export type PokemonNamesList = {
  count: number
  results: { name: string }[]
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
  return res.json()
}

export async function fetchAllPokemon(): Promise<PokemonList> {
  const res: PokemonNamesList = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
  ).then((res) => res.json())

  const results = await Promise.all(
    res.results.map(({ name }) => fetchPokemonByName(name))
  )

  return {
    ...res,
    results,
  }
}

export function getPokemonImage(pokemon: Pokemon) {
  return (
    pokemon?.sprites?.other?.['official-artwork']?.front_default ??
    '/not-found.svg'
  )
}

export function getPokemonName(name: string) {
  return name
    .replaceAll('-', ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
