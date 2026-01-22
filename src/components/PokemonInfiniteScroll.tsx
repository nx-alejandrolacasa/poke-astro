import { useState, useEffect, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import { PokemonTile } from './PokemonTile'
import type { Pokemon, PokemonList } from '@/utils/pokemon'

type PokemonInfiniteScrollProps = {
  initialData: PokemonList
  initialPage?: number
}

export function PokemonInfiniteScroll({
  initialData,
  initialPage = 1,
}: PokemonInfiniteScrollProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  })

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/pokemon/page/${nextPage}`)
      const data: PokemonList = await response.json()

      if (data.results.length === 0) {
        setHasMore(false)
      } else {
        setPokemon((prev) => [...prev, ...data.results])
        setPage(nextPage)

        // Check if we've reached the end
        const totalLoaded = pokemon.length + data.results.length
        if (totalLoaded >= data.count) {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Failed to load more Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, pokemon.length])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore()
    }
  }, [inView, hasMore, loading, loadMore])

  return (
    <div>
      <ul className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none">
            <PokemonTile pokemon={poke} />
          </li>
        ))}
      </ul>

      {/* Loading indicator and intersection observer trigger */}
      {hasMore && (
        <div ref={ref} className="flex justify-center my-8">
          {loading ? (
            <div className="text-center">
              <img
                src="/loading.svg"
                alt="Loading..."
                className="w-16 h-16 mx-auto animate-spin"
              />
              <p className="mt-2 text-gray-500">Loading more Pokémon...</p>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <div className="text-center my-8 text-gray-500">
          <p>You've caught 'em all! 🎉</p>
          <p className="text-sm mt-1">
            Showing all {pokemon.length} Pokémon
          </p>
        </div>
      )}
    </div>
  )
}
