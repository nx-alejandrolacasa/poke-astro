import type { APIRoute } from 'astro'
import type { Pokemon, PokemonList } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const { id, page: pageParam } = params
  const page = Number.parseInt(pageParam || '1', 10)
  const pageSize = 30

  try {
    // Fetch generation data from PokéAPI
    const genRes = await fetch(`https://pokeapi.co/api/v2/generation/${id}`)
    if (!genRes.ok) {
      return new Response(JSON.stringify({ error: 'Generation not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const genData = await genRes.json()
    const allSpecies = genData.pokemon_species

    // Calculate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const speciesSlice = allSpecies.slice(startIndex, endIndex)

    // Fetch full details for this page
    const pokemonPromises = speciesSlice.map(
      async (species: { name: string }) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`)
        if (!res.ok) return null
        return res.json()
      }
    )

    const resultsWithNull = await Promise.all(pokemonPromises)
    const results: Pokemon[] = resultsWithNull.filter(
      (p): p is Pokemon => p !== null
    )

    // Sort by order number
    results.sort((a, b) => a.order - b.order)

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
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Pokemon' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
