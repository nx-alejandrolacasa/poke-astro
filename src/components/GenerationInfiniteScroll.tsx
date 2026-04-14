import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'
import { BackToTop } from './BackToTop'
import { PokemonTile } from './PokemonTile'
import { SkeletonCard } from './SkeletonCard'

type GenerationInfiniteScrollProps = {
  initialData: PokemonList
  generation: { id: number; name: string; region: string }
  generationColor: string
  locale: Locale
}

export function GenerationInfiniteScroll({
  initialData,
  generation,
  generationColor: _generationColor,
  locale,
}: GenerationInfiniteScrollProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialData.count > initialData.results.length
  )

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px' })

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(
        `/api/generation/${generation.id}/${nextPage}`
      )
      const data: PokemonList = await response.json()
      if (data.results.length === 0) {
        setHasMore(false)
      } else {
        setPokemon((prev) => [...prev, ...data.results])
        setPage(nextPage)
        if (pokemon.length + data.results.length >= data.count)
          setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore, pokemon.length, generation.id])

  useEffect(() => {
    if (inView && hasMore && !loading) loadMore()
  }, [inView, hasMore, loading, loadMore])

  return (
    <div className="space-y-8">
      {/* Colored banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-surface-sunken p-6 md:p-8 dark:from-dark-raised dark:to-dark-surface">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-bold text-2xl text-ink tracking-tight md:text-3xl dark:text-dark-ink">
              {generation.name}
            </h1>
            <p className="font-medium text-ink-muted text-sm dark:text-dark-ink-muted">
              {generation.region} &middot; {interpolate(t.pages.speciesCount, { count: initialData.count })}
            </p>
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none">
            <PokemonTile pokemon={poke} locale={locale} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div ref={ref}>
          {loading ? (
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={`skeleton-${i.toString()}`} className="list-none">
                  <SkeletonCard />
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}
      {!hasMore && pokemon.length > 0 && (
        <div className="my-10 text-center">
          <p className="text-ink-muted text-sm dark:text-dark-ink-muted">
            {t.scroll.caughtAll}
          </p>
          <p className="mt-1 text-ink-faint text-xs dark:text-dark-ink-faint">
            {interpolate(t.scroll.showingAll, { count: pokemon.length })}
          </p>
        </div>
      )}
      <BackToTop />
    </div>
  )
}
