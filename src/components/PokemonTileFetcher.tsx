import { PokemonTile } from '@components/PokemonTile'
import type { Pokemon } from '@utils/pokemon'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'

async function fetchPokemonByName(name: string): Promise<Pokemon | null> {
  const res = await fetch(`/api/pokemon/${name}`)

  if (res.ok) {
    return res.json()
  }

  return null
}

type PokemonTileFetcherProps = {
  name: string
  locale: Locale
}

export function PokemonTileFetcher({ name, locale }: PokemonTileFetcherProps) {
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

  return <PokemonTile loading={loading} pokemon={pokemon} locale={locale} />
}
