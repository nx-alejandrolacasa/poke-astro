import { PokemonTile } from '@components/PokemonTile'
import { fetchPokemonByName, Pokemon } from '@utils/pokemon'
import { useEffect, useState } from 'react'

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
  }, [])

  return <PokemonTile loading={loading} pokemon={pokemon} />
}
