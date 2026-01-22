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

/**
 * Fetch the total count of Pokémon without fetching all data
 */
export async function fetchPokemonCount(): Promise<number> {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1&offset=0')
  const data = await res.json()
  return data.count
}

/**
 * Fetch all Pokémon names (lightweight, only names - no full data)
 * Useful for generating static paths
 */
export async function fetchAllPokemonNames(): Promise<string[]> {
  const res: PokemonNamesList = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
  ).then((res) => res.json())

  return res.results.map(({ name }) => name)
}

/**
 * Fetch a specific page of Pokémon (optimized for pagination)
 * @param page - Page number (1-indexed)
 * @param pageSize - Number of Pokémon per page
 */
export async function fetchPokemonPage(
  page: number,
  pageSize: number = 24
): Promise<PokemonList> {
  const offset = (page - 1) * pageSize

  // First, get the list of Pokémon names for this page
  const res: PokemonNamesList = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`
  ).then((res) => res.json())

  // Then fetch full details for only these Pokémon
  const results = await Promise.all(
    res.results.map(({ name }) => fetchPokemonByName(name))
  )

  return {
    count: res.count,
    results,
  }
}

/**
 * @deprecated Use fetchPokemonPage for better performance
 * Fetch all Pokémon (WARNING: Very slow, fetches thousands of API requests)
 */
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
