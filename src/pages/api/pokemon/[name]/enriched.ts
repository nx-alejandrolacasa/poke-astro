import {
  calculateTypeEffectiveness,
  fetchEvolutionChain,
  fetchPokemonByName,
  fetchPokemonSpecies,
  fetchTypeDetails,
  getFlavorText,
  parseEvolutionChain,
  parseEvolutionTree,
} from '@utils/pokemon'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, url }) => {
  const { name } = params
  const language = url.searchParams.get('lang') || 'es'

  if (!name) {
    return new Response(JSON.stringify({ error: 'Pokemon name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Fetch Pokemon data and enriched information
    const pokemon = await fetchPokemonByName(name)
    const species = await fetchPokemonSpecies(name)
    const evolutionChainData = species
      ? await fetchEvolutionChain(species.evolution_chain.url)
      : null
    const evolutions = evolutionChainData
      ? parseEvolutionChain(evolutionChainData.chain)
      : []
    const evolutionTree = evolutionChainData
      ? parseEvolutionTree(evolutionChainData.chain)
      : null
    const typeEffectiveness = await calculateTypeEffectiveness(pokemon)

    // Get translated flavor text
    const flavorText = species ? getFlavorText(species, language) : null

    // Fetch type translations for type effectiveness
    const typeTranslationsPromises = [
      ...typeEffectiveness.weaknesses.map(({ type }) =>
        fetchTypeDetails(type).then((details) => ({
          original: type,
          translated:
            details?.names.find((n) => n.language.name === language)?.name ??
            type,
        }))
      ),
      ...typeEffectiveness.resistances.map(({ type }) =>
        fetchTypeDetails(type).then((details) => ({
          original: type,
          translated:
            details?.names.find((n) => n.language.name === language)?.name ??
            type,
        }))
      ),
      ...typeEffectiveness.immunities.map((type) =>
        fetchTypeDetails(type).then((details) => ({
          original: type,
          translated:
            details?.names.find((n) => n.language.name === language)?.name ??
            type,
        }))
      ),
    ]

    const typeTranslations = await Promise.all(typeTranslationsPromises)
    const translationMap = new Map(
      typeTranslations.map((t) => [t.original, t.translated])
    )

    // Apply translations to type effectiveness
    const translatedTypeEffectiveness = {
      weaknesses: typeEffectiveness.weaknesses.map(({ type, multiplier }) => ({
        type: translationMap.get(type) ?? type,
        multiplier,
      })),
      resistances: typeEffectiveness.resistances.map(
        ({ type, multiplier }) => ({
          type: translationMap.get(type) ?? type,
          multiplier,
        })
      ),
      immunities: typeEffectiveness.immunities.map(
        (type) => translationMap.get(type) ?? type
      ),
    }

    // Build species info for the detail page
    const speciesInfo = species
      ? {
          baseHappiness: species.base_happiness,
          captureRate: species.capture_rate,
          color: species.color?.name ?? null,
          eggGroups: species.egg_groups.map((g) => g.name),
          genderRate: species.gender_rate,
          genera: species.genera,
          generation: species.generation?.name ?? null,
          growthRate: species.growth_rate?.name ?? null,
          habitat: species.habitat?.name ?? null,
          hatchCounter: species.hatch_counter,
          isBaby: species.is_baby,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          shape: species.shape?.name ?? null,
          varieties: species.varieties
            .filter((v) => !v.is_default)
            .map((v) => v.pokemon.name),
        }
      : null

    return new Response(
      JSON.stringify({
        flavorText,
        evolutions,
        evolutionChainData,
        evolutionTree,
        typeEffectiveness: translatedTypeEffectiveness,
        speciesInfo,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control':
            'public, s-maxage=86400, stale-while-revalidate=604800', // Cache for 1 day, revalidate for 1 week
        },
      }
    )
  } catch (error) {
    console.error(`Error fetching enriched data for ${name}:`, error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch enriched Pokemon data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
