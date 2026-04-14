/**
 * Pokémon Type Effectiveness Data
 *
 * Complete type matchup data for both modern (Gen 2+) and Gen 1 rules.
 * Multipliers: 2 = super effective, 0.5 = not very effective, 0 = no effect
 * Normal effectiveness (1x) is omitted — only exceptions are stored.
 */

export const ALL_TYPES = [
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

export const GEN1_TYPES = [
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
] as const

export type PokemonType = (typeof ALL_TYPES)[number]

type EffectivenessMap = Partial<Record<PokemonType, number>>

/**
 * Modern type chart (Gen 6+, includes Fairy).
 * Key = attacking type, value = map of defending types with non-1x multipliers.
 */
export const MODERN_CHART: Record<PokemonType, EffectivenessMap> = {
  normal: { rock: 0.5, steel: 0.5, ghost: 0 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    grass: 2,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: {
    fire: 0.5,
    poison: 0.5,
    fighting: 2,
    dragon: 2,
    dark: 2,
    steel: 0.5,
  },
}

/**
 * Gen 1 type chart overrides.
 * Key differences from modern:
 * - No Dark, Steel, or Fairy types
 * - Ghost has no effect on Psychic (was a bug, later "fixed")
 * - Bug is super effective against Poison
 * - Poison is super effective against Bug
 * - Ice is normal effectiveness against Fire (not resisted)
 */
export const GEN1_CHART: Record<string, EffectivenessMap> = {
  ...Object.fromEntries(
    GEN1_TYPES.map((type) => {
      const modern = MODERN_CHART[type]
      // Filter out Dark, Steel, Fairy from all matchups
      const filtered: EffectivenessMap = {}
      for (const [def, mult] of Object.entries(modern)) {
        if (
          def !== 'dark' &&
          def !== 'steel' &&
          def !== 'fairy' &&
          GEN1_TYPES.includes(def as (typeof GEN1_TYPES)[number])
        ) {
          filtered[def as PokemonType] = mult
        }
      }
      return [type, filtered]
    })
  ),
  // Override specific Gen 1 differences
  ghost: { ghost: 2, psychic: 0, normal: 0 }, // Ghost couldn't hit Psychic in Gen 1
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 2, // Bug was super effective against Poison
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
  },
  poison: {
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    grass: 2,
    bug: 2, // Poison was super effective against Bug
  },
  ice: {
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    // Fire NOT listed = 1x (normal) in Gen 1
  },
}

/**
 * Get the effectiveness multiplier for an attacking type vs defending type.
 */
export function getEffectiveness(
  attacker: PokemonType,
  defender: PokemonType,
  gen1: boolean
): number {
  const chart = gen1 ? GEN1_CHART : MODERN_CHART
  const matchups = chart[attacker]
  if (!matchups) return 1
  return matchups[defender] ?? 1
}

/**
 * Get all matchups for a given attacking type.
 */
export function getAttackMatchups(
  attacker: PokemonType,
  gen1: boolean
): {
  superEffective: PokemonType[]
  notVeryEffective: PokemonType[]
  noEffect: PokemonType[]
} {
  const types = gen1 ? GEN1_TYPES : ALL_TYPES
  const superEffective: PokemonType[] = []
  const notVeryEffective: PokemonType[] = []
  const noEffect: PokemonType[] = []

  for (const defender of types) {
    const mult = getEffectiveness(attacker, defender, gen1)
    if (mult === 2) superEffective.push(defender)
    else if (mult === 0.5) notVeryEffective.push(defender)
    else if (mult === 0) noEffect.push(defender)
  }

  return { superEffective, notVeryEffective, noEffect }
}

/**
 * Get all defensive matchups for a given defending type.
 */
export function getDefenseMatchups(
  defender: PokemonType,
  gen1: boolean
): {
  weakTo: PokemonType[]
  resistantTo: PokemonType[]
  immuneTo: PokemonType[]
} {
  const types = gen1 ? GEN1_TYPES : ALL_TYPES
  const weakTo: PokemonType[] = []
  const resistantTo: PokemonType[] = []
  const immuneTo: PokemonType[] = []

  for (const attacker of types) {
    const mult = getEffectiveness(attacker, defender, gen1)
    if (mult === 2) weakTo.push(attacker)
    else if (mult === 0.5) resistantTo.push(attacker)
    else if (mult === 0) immuneTo.push(attacker)
  }

  return { weakTo, resistantTo, immuneTo }
}
