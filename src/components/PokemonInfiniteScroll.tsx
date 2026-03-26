import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'
import { PokemonTile } from './PokemonTile'

type PokemonInfiniteScrollProps = {
  initialData: PokemonList
  initialPage?: number
  locale: Locale
}

export function PokemonInfiniteScroll({ initialData, initialPage = 1, locale }: PokemonInfiniteScrollProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px' })

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
        const totalLoaded = pokemon.length + data.results.length
        if (totalLoaded >= data.count) setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, pokemon.length])

  useEffect(() => {
    if (inView && hasMore && !loading) loadMore()
  }, [inView, hasMore, loading, loadMore])

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none"><PokemonTile pokemon={poke} locale={locale} /></li>
        ))}
      </ul>
      {hasMore && (
        <div ref={ref} className="my-8 flex justify-center">
          {loading ? (
            <div className="text-center">
              <div className="radar-loader mx-auto" />
              <p className="mt-3 font-mono text-xs text-gray-500 dark:text-neon-blue/50">{t.scroll.loadingMore}</p>
            </div>
          ) : <div className="h-10" />}
        </div>
      )}
      {!hasMore && pokemon.length > 0 && (
        <div className="my-8 text-center">
          <p className="font-mono text-sm text-gray-500 dark:text-neon-blue/60">{t.scroll.caughtAll}</p>
          <p className="mt-1 font-mono text-xs text-gray-400 dark:text-gray-600">{interpolate(t.scroll.showingAll, { count: pokemon.length })}</p>
        </div>
      )}
    </div>
  )
}
