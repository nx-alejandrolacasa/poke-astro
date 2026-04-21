import Pokedex from 'pokedex-promise-v2'

/**
 * Shared Pokedex client singleton.
 *
 * The library uses `axios` + `node-cache` internally, both of which are
 * compatible with Node (Vercel), Cloudflare Workers (`nodejs_compat` flag)
 * and local dev (Node via @astrojs/node adapter).
 *
 * In serverless environments the in-memory cache lives only for the duration
 * of a single invocation, but it still deduplicates calls within a request.
 */
export const pokeapi = new Pokedex({
  protocol: 'https',
  hostName: 'pokeapi.co',
  versionPath: '/api/v2/',
  cacheLimit: 60 * 60 * 1000, // 1 hour
  timeout: 30 * 1000, // 30 seconds
})
