import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations, interpolate } from '@/utils/translations'
import { PokemonTile } from './PokemonTile'

type TypeInfiniteScrollProps = {
  initialData: PokemonList
  type: string
  typeColor: string
  locale: Locale
}

export function TypeInfiniteScroll({
  initialData,
  type,
  typeColor,
  locale,
}: TypeInfiniteScrollProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialData.count > initialData.results.length)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '500px',
  })

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/type/${type}/${nextPage}`)
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
  }, [page, loading, hasMore, pokemon.length, type])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore()
    }
  }, [inView, hasMore, loading, loadMore])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className={`bg-gradient-to-r ${typeColor} rounded-2xl p-8 md:p-12 text-center shadow-xl`}>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          {t.pages.typeTitle} {t.types[type as keyof typeof t.types]}
        </h1>
        <p className="text-lg md:text-xl text-white/90">
          {interpolate(t.pages.speciesCount, { count: initialData.count })}
        </p>
      </div>

      {/* Back Link */}
      <div>
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary-600 dark:text-primary-300 dark:hover:text-primary-400 transition-colors font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {t.pages.backToHome}
        </a>
      </div>

      {/* Pokémon Grid */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none">
            <PokemonTile pokemon={poke} locale={locale} />
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
              <p className="mt-2 text-gray-500 dark:text-gray-400">{t.scroll.loadingMore}</p>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <div className="my-8 text-center text-gray-500 dark:text-gray-400">
          <p>{t.scroll.caughtAll}</p>
          <p className="mt-1 text-sm">
            {interpolate(t.scroll.showingAll, { count: pokemon.length })}
          </p>
        </div>
      )}
    </div>
  )
}
