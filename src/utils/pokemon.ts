export type Pokemon = {
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  base_experience: number | null
  cries: {
    latest: string | null
    legacy: string | null
  }
  height: number
  held_items: {
    item: { name: string; url: string }
    version_details: {
      rarity: number
      version: { name: string; url: string }
    }[]
  }[]
  /** National Pokédex number. Use this for display — `order` is a family-grouped
   * sort index that skips slots (Mega/regional variants), so it leaves gaps. */
  id: number
  name: string
  order: number
  species: { name: string; url: string }
  sprites: {
    front_default: string | null
    front_shiny: string | null
    front_female: string | null
    front_shiny_female: string | null
    other: {
      dream_world: {
        front_default: string | null
        front_female: string | null
      }
      home: {
        front_default: string | null
        front_female: string | null
        front_shiny: string | null
        front_shiny_female: string | null
      }
      'official-artwork': {
        front_default: string | null
        front_shiny: string | null
      }
      showdown: {
        front_default: string | null
        front_shiny: string | null
      }
    }
  }
  stats: { base_stat: number; stat: { name: string } }[]
  types: { type: { name: string } }[]
  weight: number
}

export type PokemonSpecies = {
  base_happiness: number | null
  capture_rate: number
  color: { name: string } | null
  egg_groups: { name: string; url: string }[]
  evolution_chain: { url: string }
  flavor_text_entries: {
    flavor_text: string
    language: { name: string }
    version?: { name: string }
  }[]
  gender_rate: number
  genera: { genus: string; language: { name: string } }[]
  generation: { name: string; url: string }
  growth_rate: { name: string; url: string }
  habitat: { name: string } | null
  hatch_counter: number | null
  is_baby: boolean
  is_legendary: boolean
  is_mythical: boolean
  name: string
  shape: { name: string } | null
  varieties: {
    is_default: boolean
    pokemon: { name: string; url: string }
  }[]
}

export type EvolutionChain = {
  chain: EvolutionNode
  id: number
}

export type EvolutionDetail = {
  gender: number | null
  held_item: { name: string } | null
  item: { name: string } | null
  known_move: { name: string } | null
  known_move_type: { name: string } | null
  location: { name: string } | null
  min_affection: number | null
  min_beauty: number | null
  min_happiness: number | null
  min_level: number | null
  needs_overworld_rain: boolean
  party_species: { name: string } | null
  party_type: { name: string } | null
  relative_physical_stats: number | null
  time_of_day: string
  trade_species: { name: string } | null
  trigger: { name: string }
  turn_upside_down: boolean
}

export type EvolutionNode = {
  evolution_details: EvolutionDetail[]
  evolves_to: EvolutionNode[]
  is_baby: boolean
  species: { name: string; url: string }
}

export type EvolutionTreeNode = {
  name: string
  speciesUrl: string
  evolutionDetails: EvolutionDetail[]
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
  pageSize = 30
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

  // Sort by National Pokédex number
  results.sort((a, b) => a.id - b.id)

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

/** Canonical Pokémon types, used for generating type-listing routes and
 * rendering the type grid on the home page. */
export const POKEMON_TYPES = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type PokemonType = (typeof POKEMON_TYPES)[number]

/** Solid color for a Pokémon type — used for card accents, borders, badges */
export const typeColors: Record<string, string> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  electric: '#f8d030',
  grass: '#78c850',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
}

export function getTypeColor(pokemon: Pokemon): string {
  const primaryType = pokemon.types[0]?.type.name ?? 'normal'
  return typeColors[primaryType] ?? typeColors.normal
}

/** Representative Pokémon (by National Dex ID) for each type — used to pick a
 * sprite for the type cards shown on the homepage and the Type Chart page. */
export const typeRepresentativePokemon: Record<string, number> = {
  normal: 143, // Snorlax
  fire: 6, // Charizard
  water: 9, // Blastoise
  electric: 172, // Pichu
  grass: 3, // Venusaur
  ice: 131, // Lapras
  fighting: 68, // Machamp
  poison: 109, // Koffing
  ground: 51, // Dugtrio
  flying: 18, // Pidgeot
  psychic: 150, // Mewtwo
  bug: 12, // Butterfree
  rock: 95, // Onix
  ghost: 94, // Gengar
  dragon: 149, // Dragonite
  dark: 197, // Umbreon
  steel: 208, // Steelix
  fairy: 35, // Clefairy
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
    evolutionDetails: chain.evolution_details ?? [],
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
export async function fetchAbilityDetails(
  abilityName: string
): Promise<AbilityDetails | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${abilityName}`)
  if (!res.ok) {
    console.warn(
      `Failed to fetch ability details for ${abilityName}: ${res.status}`
    )
    return null
  }
  return res.json()
}

/**
 * Fetch stat details with translations
 */
export async function fetchStatDetails(
  statName: string
): Promise<StatDetails | null> {
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
export function getFlavorText(
  species: PokemonSpecies,
  languageCode: string
): string | null {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === languageCode
  )
  if (!entry) return null
  // Clean up flavor text (remove form feeds and extra whitespace)
  return entry.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
