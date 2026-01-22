import type { APIRoute } from 'astro'
import { fetchPokemonPage } from '@/utils/pokemon'

export const GET: APIRoute = async ({ params }) => {
  const page = parseInt(params.page || '1')
  const pageSize = 24

  try {
    const pokemonPage = await fetchPokemonPage(page, pageSize)

    return new Response(JSON.stringify(pokemonPage), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch Pokemon' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
