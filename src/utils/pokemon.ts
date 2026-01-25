export type Pokemon = {
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  height: number
  name: string
  order: number
  species: { name: string; url: string }
  sprites: {
    other: {
      'official-artwork': {
        front_default: string
      }
    }
  }
  stats: { base_stat: number; stat: { name: string } }[]
  types: { type: { name: string } }[]
  weight: number
}

export type PokemonSpecies = {
  evolution_chain: { url: string }
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  genera: { genus: string; language: { name: string } }[]
  name: string
}

export type EvolutionChain = {
  chain: EvolutionNode
  id: number
}

export type EvolutionNode = {
  evolution_details: {
    min_level?: number
    trigger: { name: string }
  }[]
  evolves_to: EvolutionNode[]
  species: { name: string; url: string }
}

export type EvolutionTreeNode = {
  name: string
  speciesUrl: string
  evolvesTo: EvolutionTreeNode[]
}

export type TypeDetails = {
  damage_relations: {
    double_damage_from: { name: string }[]
    double_damage_to: { name: string }[]
    half_damage_from: { name: string }[]
    half_damage_to: { name: string }[]
    no_damage_from: { name: string }[]
    no_damage_to: { name: string }[]
  }
  name: string
  names: { language: { name: string }; name: string }[]
}

export type TypeDetailsWithTranslations = TypeDetails & {
  translatedName?: string
}

export type AbilityDetails = {
  name: string
  names: { language: { name: string }; name: string }[]
}

export type StatDetails = {
  name: string
  names: { language: { name: string }; name: string }[]
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
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon: ${name} (${res.status})`)
  }
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
    'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
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
  pageSize = 24
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
    'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0'
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

/**
 * Fetch Pokemon species data (includes evolution chain reference)
 */
export async function fetchPokemonSpecies(
  name: string
): Promise<PokemonSpecies | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
  if (!res.ok) {
    console.warn(`Failed to fetch species for ${name}: ${res.status}`)
    return null
  }
  return res.json()
}

/**
 * Fetch evolution chain data
 */
export async function fetchEvolutionChain(
  url: string
): Promise<EvolutionChain | null> {
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`Failed to fetch evolution chain: ${res.status}`)
    return null
  }
  return res.json()
}

/**
 * Fetch type details including damage relations
 */
export async function fetchTypeDetails(
  typeName: string
): Promise<TypeDetails | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`)
  if (!res.ok) {
    console.warn(`Failed to fetch type details for ${typeName}: ${res.status}`)
    return null
  }
  return res.json()
}

/**
 * Calculate type effectiveness for a Pokemon
 * Returns weaknesses, resistances, and immunities
 */
export async function calculateTypeEffectiveness(pokemon: Pokemon) {
  const typeDetailsResults = await Promise.all(
    pokemon.types.map(({ type }) => fetchTypeDetails(type.name))
  )

  // Filter out null results
  const typeDetails = typeDetailsResults.filter(
    (detail): detail is TypeDetails => detail !== null
  )

  const weaknesses = new Map<string, number>()
  const resistances = new Map<string, number>()
  const immunities = new Set<string>()

  // Initialize all types with 1x multiplier
  const multipliers = new Map<string, number>()

  // Process each type's damage relations
  for (const typeDetail of typeDetails) {
    // Double damage from (weaknesses)
    typeDetail.damage_relations.double_damage_from.forEach(({ name }) => {
      multipliers.set(name, (multipliers.get(name) || 1) * 2)
    })

    // Half damage from (resistances)
    typeDetail.damage_relations.half_damage_from.forEach(({ name }) => {
      multipliers.set(name, (multipliers.get(name) || 1) * 0.5)
    })

    // No damage from (immunities)
    typeDetail.damage_relations.no_damage_from.forEach(({ name }) => {
      multipliers.set(name, 0)
    })
  }

  // Categorize based on final multipliers
  multipliers.forEach((multiplier, type) => {
    if (multiplier === 0) {
      immunities.add(type)
    } else if (multiplier >= 2) {
      weaknesses.set(type, multiplier)
    } else if (multiplier <= 0.5) {
      resistances.set(type, multiplier)
    }
  })

  return {
    weaknesses: Array.from(weaknesses.entries()).map(([type, multiplier]) => ({
      type,
      multiplier,
    })),
    resistances: Array.from(resistances.entries()).map(
      ([type, multiplier]) => ({ type, multiplier })
    ),
    immunities: Array.from(immunities),
  }
}

/**
 * Parse evolution chain into a flat array of evolution stages
 * @deprecated Use parseEvolutionTree for proper branching evolution support
 */
export function parseEvolutionChain(chain: EvolutionNode): string[] {
  const evolutions: string[] = [chain.species.name]

  function traverse(node: EvolutionNode) {
    node.evolves_to.forEach((evolution) => {
      evolutions.push(evolution.species.name)
      traverse(evolution)
    })
  }

  traverse(chain)
  return evolutions
}

/**
 * Parse evolution chain into a tree structure that properly handles branching evolutions
 * (e.g., Scyther can evolve into either Scizor or Kleavor)
 */
export function parseEvolutionTree(chain: EvolutionNode): EvolutionTreeNode {
  return {
    name: chain.species.name,
    speciesUrl: chain.species.url,
    evolvesTo: chain.evolves_to.map((evo) => parseEvolutionTree(evo)),
  }
}

/**
 * Get translated name from a names array
 * @param names - Array of name objects with language information
 * @param languageCode - Language code (e.g., 'en', 'es')
 * @param fallback - Fallback value if translation not found
 */
export function getTranslatedName(
  names: { language: { name: string }; name: string }[],
  languageCode: string,
  fallback: string
): string {
  const translation = names.find((n) => n.language.name === languageCode)
  return translation?.name ?? fallback
}

/**
 * Fetch ability details with translations
 */
export async function fetchAbilityDetails(abilityName: string): Promise<AbilityDetails | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
  if (!res.ok) {
    console.warn(`Failed to fetch ability details for ${abilityName}: ${res.status}`)
    return null
  }
  return res.json()
}

/**
 * Fetch stat details with translations
 */
export async function fetchStatDetails(statName: string): Promise<StatDetails | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/stat/${statName}`)
  if (!res.ok) {
    console.warn(`Failed to fetch stat details for ${statName}: ${res.status}`)
    return null
  }
  return res.json()
}

/**
 * Get flavor text in a specific language from species data
 */
export function getFlavorText(species: PokemonSpecies, languageCode: string): string | null {
  const entry = species.flavor_text_entries.find((e) => e.language.name === languageCode)
  if (!entry) return null
  // Clean up flavor text (remove form feeds and extra whitespace)
  return entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}
