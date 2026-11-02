import { useEffect, useState } from 'react'
import type { PokemonRecord } from '@/utils/pokemon'
import { loadPokemonIndex } from '@/utils/pokemonIndex'

export function usePokemonIndex() {
  const [index, setIndex] = useState<PokemonRecord[]>([])
  const [error, setError] = useState(false)
  useEffect(() => {
    loadPokemonIndex()
      .then(setIndex)
      .catch(() => setError(true))
  }, [])
  return { index, loading: index.length === 0 && !error, error }
}
