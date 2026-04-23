import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { getCachedPagesFrom, putCachedPage } from '@/utils/pokemonPagesCache'
import { interpolate, translations } from '@/utils/translations'
import { BackToTop } from './BackToTop'
import { PokemonTile } from './PokemonTile'
import { SkeletonCard } from './SkeletonCard'

type PokemonInfiniteScrollProps = {
  initialData: PokemonList
  initialPage?: number
  locale: Locale
}

const PAGE_SIZE = 30

export function PokemonInfiniteScroll({
  initialData,
  initialPage = 1,
  locale,
}: PokemonInfiniteScrollProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(initialPage)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(
    initialData.results.length < initialData.count
  )

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
        setPokemon((prev) => {
          const merged = [...prev, ...data.results]
          if (merged.length >= data.count) setHasMore(false)
          return merged
        })
        setPage(nextPage)
        putCachedPage(nextPage, PAGE_SIZE, data)
      }
    } catch (error) {
      console.error('Failed to load more Pokemon:', error)
    } finally {
      setLoading(false)
    }
  }, [page, loading, hasMore])

  useEffect(() => {
    if (inView && hasMore && !loading) loadMore()
  }, [inView, hasMore, loading, loadMore])

  // Hydrate any pages the user already scrolled past on a previous visit so
  // they don't start from page 1 every time. Also persist the server-rendered
  // page so it's available when offline.
  useEffect(() => {
    let cancelled = false
    putCachedPage(initialPage, PAGE_SIZE, initialData)
    getCachedPagesFrom(initialPage + 1, PAGE_SIZE).then((cached) => {
      if (cancelled || cached.length === 0) return
      const extras = cached.flatMap((entry) => entry.results)
      const last = cached[cached.length - 1]
      setPokemon((prev) => {
        const merged = [...prev, ...extras]
        if (merged.length >= last.count) setHasMore(false)
        return merged
      })
      setPage(last.page)
    })
    return () => {
      cancelled = true
    }
  }, [initialData, initialPage])

  // Warm the HTTP/SW cache for the next page while the browser is idle so the
  // first scroll-triggered load is instant.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const nextPage = page + 1
    const schedule =
      window.requestIdleCallback ??
      ((cb: IdleRequestCallback) =>
        window.setTimeout(
          () => cb({ didTimeout: false, timeRemaining: () => 0 }),
          500
        ))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const handle = schedule(() => {
      fetch(`/api/pokemon/page/${nextPage}`).catch(() => {})
    })
    return () => cancel(handle as number)
  }, [page])

  return (
    <div>
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
