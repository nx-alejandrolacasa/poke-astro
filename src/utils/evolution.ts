import type { EvolutionDetail, EvolutionNode } from '@/utils/pokemon'
import { getPokemonName } from '@/utils/pokemon'
import type { Translations } from '@/utils/translations'
import { interpolate } from '@/utils/translations'

export type EvolutionStageEntry = {
  name: string
  speciesId: number
  evolutionDetails: EvolutionDetail[]
}

/** Flatten the chain into stages (depth levels), deduplicated by species. */
export function collectEvolutionStages(
  chain: EvolutionNode
): EvolutionStageEntry[][] {
  const stages: EvolutionStageEntry[][] = []
  function traverse(node: EvolutionNode, depth: number) {
    stages[depth] ??= []
    if (!stages[depth].some((p) => p.name === node.species.name)) {
      stages[depth].push({
        name: node.species.name,
        speciesId: Number(node.species.url.split('/').filter(Boolean).pop()),
        evolutionDetails: node.evolution_details ?? [],
      })
    }
    for (const child of node.evolves_to) traverse(child, depth + 1)
  }
  traverse(chain, 0)
  return stages
}

/**
 * The API returns one entry per game-version method (e.g. Leafeon evolves by
 * location in Gen IV and by item in Gen VIII). Pick the easiest to explain:
 * use-item > level-up with level > trade > happiness/affection > last.
 */
function pickBestEvolutionDetail(
  details: EvolutionDetail[]
): EvolutionDetail | null {
  if (details.length === 0) return null
  if (details.length === 1) return details[0]
  return (
    details.find((d) => d.trigger?.name === 'use-item' && d.item) ??
    details.find((d) => d.trigger?.name === 'level-up' && d.min_level) ??
    details.find((d) => d.trigger?.name === 'trade') ??
    details.find(
      (d) =>
        d.trigger?.name === 'level-up' && (d.min_happiness || d.min_affection)
    ) ??
    details[details.length - 1]
  )
}

export function getEvolutionConditionLabels(
  details: EvolutionDetail[],
  t: Translations
): string[] {
  const d = pickBestEvolutionDetail(details)
  if (!d) return []
  const item = (name: string) => t.evolutionItems[name] ?? getPokemonName(name)
  const type = (name: string) =>
    (t.types as Record<string, string>)[name] ?? getPokemonName(name)
  const labels: string[] = []
  const trigger = d.trigger?.name

  if (trigger === 'level-up' && d.min_level) {
    labels.push(interpolate(t.pokemon.evolveLevel, { level: d.min_level }))
  } else if (trigger === 'use-item' && d.item) {
    labels.push(interpolate(t.pokemon.evolveItem, { item: item(d.item.name) }))
  } else if (trigger === 'trade') {
    labels.push(
      d.trade_species
        ? interpolate(t.pokemon.evolveTradeWith, {
            species: getPokemonName(d.trade_species.name),
          })
        : t.pokemon.evolveTrade
    )
  }

  if (d.min_happiness)
    labels.push(
      interpolate(t.pokemon.evolveHappiness, { value: d.min_happiness })
    )
  if (d.min_affection)
    labels.push(
      interpolate(t.pokemon.evolveAffection, { value: d.min_affection })
    )
  if (d.min_beauty)
    labels.push(interpolate(t.pokemon.evolveBeauty, { value: d.min_beauty }))
  if (d.held_item)
    labels.push(
      interpolate(t.pokemon.evolveHeldItem, { item: item(d.held_item.name) })
    )
  if (d.known_move)
    labels.push(
      interpolate(t.pokemon.evolveKnownMove, {
        move: getPokemonName(d.known_move.name),
      })
    )
  if (d.known_move_type)
    labels.push(
      interpolate(t.pokemon.evolveKnownMoveType, {
        type: type(d.known_move_type.name),
      })
    )
  if (d.time_of_day)
    labels.push(
      interpolate(t.pokemon.evolveTimeOfDay, {
        time: t.timeOfDay[d.time_of_day] ?? getPokemonName(d.time_of_day),
      })
    )
  if (d.needs_overworld_rain) labels.push(t.pokemon.evolveRain)
  if (d.turn_upside_down) labels.push(t.pokemon.evolveUpsideDown)
  if (d.party_species)
    labels.push(
      interpolate(t.pokemon.evolvePartySpecies, {
        species: getPokemonName(d.party_species.name),
      })
    )
  if (d.party_type)
    labels.push(
      interpolate(t.pokemon.evolvePartyType, { type: type(d.party_type.name) })
    )
  if (d.gender === 1) labels.push(t.pokemon.evolveGenderFemale)
  if (d.gender === 2) labels.push(t.pokemon.evolveGenderMale)
  if (d.relative_physical_stats === 1)
    labels.push(t.pokemon.evolvePhysicalStatsHigher)
  if (d.relative_physical_stats === 0)
    labels.push(t.pokemon.evolvePhysicalStatsEqual)
  if (d.relative_physical_stats === -1)
    labels.push(t.pokemon.evolvePhysicalStatsLower)

  return labels
}
