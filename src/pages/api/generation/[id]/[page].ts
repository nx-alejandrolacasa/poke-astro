import type { APIRoute } from 'astro'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { fetchGenerationData, fetchPokemonByNames } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const { id, page: pageParam } = params
  const page = Number.parseInt(pageParam || '1', 10)
  const pageSize = 30

  try {
    const generationId = Number(id)
    if (!Number.isInteger(generationId) || generationId < 1) {
      return new Response(
        JSON.stringify({ error: 'Invalid generation ID' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const genData = await fetchGenerationData(generationId)

    const allSpecies = genData.pokemon_species.sort(
      (a: { url: string }, b: { url: string }) => {
        const idA = Number(a.url.split('/').filter(Boolean).pop())
        const idB = Number(b.url.split('/').filter(Boolean).pop())
        return idA - idB
      }
    )

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const speciesSlice = allSpecies.slice(startIndex, endIndex)

    const speciesNames = speciesSlice.map(
      (species: { name: string }) => species.name
    )
    const results: Pokemon[] = (await fetchPokemonByNames(speciesNames)).sort(
      (a, b) => a.id - b.id
    )

    const response: PokemonList = {
      count: allSpecies.length,
      results,
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Failed to fetch generation Pokemon:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch Pokemon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
