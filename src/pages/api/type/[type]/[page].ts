import type { APIRoute } from 'astro'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { fetchPokemonByNames, fetchTypeData } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const { type, page: pageParam } = params
  const page = Number.parseInt(pageParam || '1', 10)
  const pageSize = 30

  try {
    const typeData = await fetchTypeData(type!)

    const allPokemonRefs = typeData.pokemon.sort(
      (a: { pokemon: { url: string } }, b: { pokemon: { url: string } }) => {
        const idA = Number(a.pokemon.url.split('/').filter(Boolean).pop())
        const idB = Number(b.pokemon.url.split('/').filter(Boolean).pop())
        return idA - idB
      }
    )

    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const pokemonSlice = allPokemonRefs.slice(startIndex, endIndex)

    const pokemonNames = pokemonSlice.map(
      (p: { pokemon: { name: string } }) => p.pokemon.name
    )
    const results: Pokemon[] = (await fetchPokemonByNames(pokemonNames)).sort(
      (a, b) => a.id - b.id
    )

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
    return new Response(JSON.stringify({ error: 'Failed to fetch Pokemon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
