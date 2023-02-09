import { PokemonTile } from '@components/PokemonTile'
import { fetchPokemonByName, Pokemon } from '@utils/pokemon'
import useSWR from 'swr'

type PokemonTileFetcherProps = {
  name: string
}

export function PokemonTileFetcher({ name }: PokemonTileFetcherProps) {
  const { data, error, isLoading } = useSWR(name, fetchPokemonByName)

  if (!data) {
    return null
  }

  return <PokemonTile pokemon={isLoading ? ({ name } as Pokemon) : data} />
}
