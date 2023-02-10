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

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)
  return res.json()
}

export async function fetchPokemonList(page: number = 1): Promise<PokemonList> {
  const offset = page > 0 ? (page - 1) * 24 : 1

  console.log('Starting list fetch')

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=24&offset=${offset}`
  ).then((res) => res.json() as unknown as PokemonList)

  console.log('List was fetched, count', res.count)

  const results = await Promise.all(
    res.results.map(({ name }) => fetchPokemonByName(name))
  )

  console.log('Pokemon info fetched')

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
