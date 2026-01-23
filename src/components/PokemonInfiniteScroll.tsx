import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { PokemonTile } from './PokemonTile'

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
    rootMargin: '500px',
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
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none">
            <PokemonTile pokemon={poke} />
          </li>
        ))}
      </ul>

      {/* Loading indicator and intersection observer trigger */}
      {hasMore && (
        <div ref={ref} className="my-8 flex justify-center">
          {loading ? (
            <div className="text-center">
              <img
                src="/loading.svg"
                alt="Loading..."
                className="mx-auto h-16 w-16 animate-spin"
              />
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Loading more Pokémon...
              </p>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <div className="my-8 text-center text-gray-500 dark:text-gray-400">
          <p>You've caught 'em all! 🎉</p>
          <p className="mt-1 text-sm">Showing all {pokemon.length} Pokémon</p>
        </div>
      )}
    </div>
  )
}
