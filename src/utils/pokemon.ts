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

export type PokemonListItem = {
  name: string
  url: string
}

export type PokemonList = {
  count: number
  results: PokemonListItem[]
}

export async function fetchPokemonByName(
  name: string
): Promise<Pokemon | null> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + name)

  if (res.ok) {
    return res.json()
  }

  return null
}

export async function fetchPokemonList(page: number = 1): Promise<PokemonList> {
  const offset = page > 0 ? (page - 1) * 24 : 1

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=24&offset=${offset}`
  )

  if (res.ok) {
    return res.json()
  }

  return {
    count: 0,
    results: [],
  }
}

export function getPokemonImage(pokemon: Pokemon) {
  return (
    pokemon.sprites.other['official-artwork'].front_default ?? '/not-found.svg'
  )
}
