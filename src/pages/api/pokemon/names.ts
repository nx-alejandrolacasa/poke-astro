import type { APIRoute } from 'astro'
import { fetchAllPokemonNames } from '@/utils/pokemon'

export const GET: APIRoute = async () => {
  try {
    const names = await fetchAllPokemonNames()

    return new Response(
      JSON.stringify({
        names,
        count: names.length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          // Cache for 1 hour (Pokemon names don't change often)
          'Cache-Control': 'public, max-age=3600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Pokemon names:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch Pokemon names',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
