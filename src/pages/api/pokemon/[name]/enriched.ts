import {
  calculateTypeEffectiveness,
  fetchEvolutionChain,
  fetchPokemonByName,
  fetchPokemonSpecies,
  parseEvolutionChain,
} from '@utils/pokemon'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params }) => {
  const { name } = params

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
    const typeEffectiveness = await calculateTypeEffectiveness(pokemon)

    // Get English flavor text
    const flavorText = species?.flavor_text_entries
      .find((entry) => entry.language.name === 'en')
      ?.flavor_text.replace(/\f/g, ' ')

    return new Response(
      JSON.stringify({
        flavorText,
        evolutions,
        evolutionChainData,
        typeEffectiveness,
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
