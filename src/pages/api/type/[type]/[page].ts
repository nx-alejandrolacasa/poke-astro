import type { APIRoute } from 'astro'
import type { Pokemon, PokemonList } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const { type, page: pageParam } = params
  const page = Number.parseInt(pageParam || '1', 10)
  const pageSize = 30

  try {
    // Fetch type data from PokéAPI
    const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}`)
    if (!typeRes.ok) {
      return new Response(JSON.stringify({ error: 'Type not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const typeData = await typeRes.json()
    const allPokemonRefs = typeData.pokemon

    // Calculate pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const pokemonSlice = allPokemonRefs.slice(startIndex, endIndex)

    // Fetch full details for this page
    const pokemonPromises = pokemonSlice.map(
      async (p: { pokemon: { url: string } }) => {
        const res = await fetch(p.pokemon.url)
        return res.json()
      }
    )

    const results: Pokemon[] = await Promise.all(pokemonPromises)

    // Sort by order number
    results.sort((a, b) => a.order - b.order)

    const response: PokemonList = {
      count: allPokemonRefs.length,
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
    console.error('Failed to fetch type Pokemon:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Pokemon' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
