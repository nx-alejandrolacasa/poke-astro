import type { APIRoute } from 'astro'
import { fetchPokemonByName } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const { name } = params

  if (!name) {
    return new Response(
      JSON.stringify({ error: 'Pokemon name is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    const pokemon = await fetchPokemonByName(name)

    return new Response(JSON.stringify(pokemon), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error(`Error fetching Pokemon ${name}:`, error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Pokemon data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
