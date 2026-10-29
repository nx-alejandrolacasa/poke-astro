import accentColorsJson from '@/data/accentColors.json'
import type { Locale } from '@/utils/i18n'

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
  names: { language: { name: string }; name: string }[]
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

export type PokemonForm = {
  form_name: string
  form_names: { language: { name: string }; name: string }[]
  is_mega: boolean
  name: string
  names: { language: { name: string }; name: string }[]
  pokemon: { name: string; url: string }
}

export type AbilityDetails = {
  name: string
  names: { language: { name: string }; name: string }[]
}

export type PokemonSummary = {
  id: number
  name: string
  names: Record<Locale, string>
  types: string[]
  accent: string | null
}

export type PokemonRecord = PokemonSummary & {
  generation: number
  isDefault: boolean
  isLegendary: boolean
  isMythical: boolean
  /** Base stats in PokéAPI order: HP, Atk, Def, Sp. Atk, Sp. Def, Speed */
  stats: number[]
  height: number
  weight: number
}

export const STAT_NAMES = [
  'hp',
  'attack',
  'defense',
  'special-attack',
  'special-defense',
  'speed',
] as const

const accentColors: Record<string, string> = accentColorsJson

const GRAPHQL_URL = 'https://beta.pokeapi.co/graphql/v1beta'
const LANGUAGE_IDS: Record<Locale, number> = { es: 7, en: 9 }

const ALL_POKEMON_QUERY = `{
  pokemon_v2_pokemon(order_by: {id: asc}) {
    id name height weight is_default
    pokemon_v2_pokemontypes(order_by: {slot: asc}) { pokemon_v2_type { name } }
    pokemon_v2_pokemonstats(order_by: {stat_id: asc}) { base_stat }
    pokemon_v2_pokemonspecy {
      generation_id is_legendary is_mythical
      pokemon_v2_pokemonspeciesnames(where: {language_id: {_in: [7, 9]}}) { name language_id }
    }
  }
}`

type GraphqlPokemon = {
  id: number
  name: string
  height: number
  weight: number
  is_default: boolean
  pokemon_v2_pokemontypes: { pokemon_v2_type: { name: string } }[]
  pokemon_v2_pokemonstats: { base_stat: number }[]
  pokemon_v2_pokemonspecy: {
    generation_id: number
    is_legendary: boolean
    is_mythical: boolean
    pokemon_v2_pokemonspeciesnames: { name: string; language_id: number }[]
  } | null
}

let allPokemonPromise: Promise<PokemonRecord[]> | undefined

/**
 * The whole Pokédex in one request. Memoised for the process lifetime, which
 * at build time means every prerendered lister and the static index share a
 * single GraphQL round trip.
 */
export function getAllPokemon(): Promise<PokemonRecord[]> {
  allPokemonPromise ??= fetchAllPokemonRecords().catch((error) => {
    allPokemonPromise = undefined
    throw error
  })
  return allPokemonPromise
}

async function fetchAllPokemonRecords(): Promise<PokemonRecord[]> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: ALL_POKEMON_QUERY }),
  })
  if (!res.ok) throw new Error(`PokéAPI GraphQL failed: ${res.status}`)
  const { data, errors } = await res.json()
  if (errors?.length) throw new Error(errors[0].message)
  return (data.pokemon_v2_pokemon as GraphqlPokemon[]).map(toRecord)
}

function toRecord(p: GraphqlPokemon): PokemonRecord {
  const fallback = getPokemonName(p.name)
  const speciesNames = p.is_default
    ? (p.pokemon_v2_pokemonspecy?.pokemon_v2_pokemonspeciesnames ?? [])
    : []
  const nameFor = (locale: Locale) =>
    speciesNames.find((n) => n.language_id === LANGUAGE_IDS[locale])?.name ??
    fallback
  return {
    id: p.id,
    name: p.name,
    names: { en: nameFor('en'), es: nameFor('es') },
    types: p.pokemon_v2_pokemontypes.map((t) => t.pokemon_v2_type.name),
    accent: accentColors[p.id] ?? null,
    generation: p.pokemon_v2_pokemonspecy?.generation_id ?? 0,
    isDefault: p.is_default,
    isLegendary: p.pokemon_v2_pokemonspecy?.is_legendary ?? false,
    isMythical: p.pokemon_v2_pokemonspecy?.is_mythical ?? false,
    stats: p.pokemon_v2_pokemonstats.map((s) => s.base_stat),
    height: p.height,
    weight: p.weight,
  }
}

export function generationsWithType(all: PokemonRecord[], type: string) {
  return [
    ...new Set(
      all
        .filter((p) => p.isDefault && p.types.includes(type))
        .map((p) => p.generation)
    ),
  ]
}

export function typesInGeneration(all: PokemonRecord[], generation: number) {
  return [
    ...new Set(
      all
        .filter((p) => p.isDefault && p.generation === generation)
        .flatMap((p) => p.types)
    ),
  ]
}

export function getAccentColor(id: number): string | null {
  return accentColors[id] ?? null
}

export function toSummary({
  id,
  name,
  names,
  types,
  accent,
}: PokemonRecord): PokemonSummary {
  return { id, name, names, types, accent }
}

export async function fetchPokemonByName(name: string): Promise<Pokemon> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon: ${name} (${res.status})`)
  }
  return res.json()
}

export function getPokemonImage(pokemon: Pokemon) {
  return (
    pokemon?.sprites?.other?.['official-artwork']?.front_default ??
    '/not-found.svg'
  )
}

export function officialArtworkUrl(id: number | string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

/** Must stay a subset of imagesConfig.sizes in astro.config.mjs */
const VERCEL_IMAGE_SIZES = [128, 256, 512]

/**
 * Route a remote sprite URL through Vercel Image Optimization (resized,
 * AVIF/WebP, edge-cached across deployments). `width` is the largest CSS
 * pixel size the image renders at; it's doubled for retina and rounded up
 * to an allowed size. Returns the URL unchanged in dev, on Cloudflare, and
 * for local assets like /not-found.svg.
 */
export function optimizedImageUrl(url: string, width: number): string {
  if (!import.meta.env.PUBLIC_VERCEL_IMAGES || !url.startsWith('https://')) {
    return url
  }
  const w =
    VERCEL_IMAGE_SIZES.find((s) => s >= width * 2) ??
    VERCEL_IMAGE_SIZES[VERCEL_IMAGE_SIZES.length - 1]
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${w}&q=75`
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

export function contrastInk(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff'
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

export async function fetchPokemonForm(
  name: string
): Promise<PokemonForm | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${name}`)
  if (!res.ok) {
    console.warn(`Failed to fetch form for ${name}: ${res.status}`)
    return null
  }
  return res.json()
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
