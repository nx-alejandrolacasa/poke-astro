import { PokemonTile } from '@components/PokemonTile'
import type { Pokemon } from '@utils/pokemon'
import { useEffect, useState } from 'react'

async function fetchPokemonByName(name: string): Promise<Pokemon | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)

  if (res.ok) {
    return res.json()
  }

  return null
}

type PokemonTileFetcherProps = {
  name: string
}

export function PokemonTileFetcher({ name }: PokemonTileFetcherProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [pokemon, setPokemon] = useState<Pokemon>({ name } as Pokemon)

  useEffect(() => {
    const getPokemonData = async () => {
      const data = await fetchPokemonByName(name)

      if (data) {
        setPokemon(data)
        setLoading(false)
      }
    }

    getPokemonData().catch((err) => console.error(err))
  }, [name])

  return <PokemonTile loading={loading} pokemon={pokemon} />
}
