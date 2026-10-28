import type { APIRoute } from 'astro'
import { getAllPokemon } from '@/utils/pokemon'

export const prerender = true

export const GET: APIRoute = async () => {
  const pokemon = await getAllPokemon()
  return new Response(JSON.stringify(pokemon), {
    headers: { 'Content-Type': 'application/json' },
  })
}
