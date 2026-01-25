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
  const language = url.searchParams.get('lang') || 'en'

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
          translated: details?.names.find((n) => n.language.name === language)?.name ?? type,
        }))
      ),
      ...typeEffectiveness.resistances.map(({ type }) =>
        fetchTypeDetails(type).then((details) => ({
          original: type,
          translated: details?.names.find((n) => n.language.name === language)?.name ?? type,
        }))
      ),
      ...typeEffectiveness.immunities.map((type) =>
        fetchTypeDetails(type).then((details) => ({
          original: type,
          translated: details?.names.find((n) => n.language.name === language)?.name ?? type,
        }))
      ),
    ]

    const typeTranslations = await Promise.all(typeTranslationsPromises)
    const translationMap = new Map(typeTranslations.map((t) => [t.original, t.translated]))

    // Apply translations to type effectiveness
    const translatedTypeEffectiveness = {
      weaknesses: typeEffectiveness.weaknesses.map(({ type, multiplier }) => ({
        type: translationMap.get(type) ?? type,
        multiplier,
      })),
      resistances: typeEffectiveness.resistances.map(({ type, multiplier }) => ({
        type: translationMap.get(type) ?? type,
        multiplier,
      })),
      immunities: typeEffectiveness.immunities.map(
        (type) => translationMap.get(type) ?? type
      ),
    }

    return new Response(
      JSON.stringify({
        flavorText,
        evolutions,
        evolutionChainData,
        evolutionTree,
        typeEffectiveness: translatedTypeEffectiveness,
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
