import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations, interpolate } from '@/utils/translations'
import { genHeaderClass } from '@/utils/typeColors'
import { PokemonTile } from './PokemonTile'

type GenerationInfiniteScrollProps = {
  initialData: PokemonList
  generation: {
    id: number
    name: string
    region: string
  }
  generationColor: string
  locale: Locale
}

export function GenerationInfiniteScroll({
  initialData,
  generation,
  locale,
}: GenerationInfiniteScrollProps) {
  const t = translations[locale]
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialData.results)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialData.count > initialData.results.length)

  const { ref, inView } = useInView({ threshold: 0, rootMargin: '500px' })

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const response = await fetch(`/api/generation/${generation.id}/${nextPage}`)
      const data: PokemonList = await response.json()
      if (data.results.length === 0) {
        setHasMore(false)
      } else {
        setPokemon((prev) => [...prev, ...data.results])
        setPage(nextPage)
        if (pokemon.length + data.results.length >= data.count) setHasMore(false)
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
      {/* Header */}
      <div className={`${genHeaderClass(generation.id)} relative overflow-hidden rounded-4xl p-8 text-center shadow-soft-lg md:p-12`}>
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white opacity-10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white opacity-10" />
        <h1 className="font-heading text-4xl font-bold text-white md:text-6xl">{generation.name}</h1>
        <p className="mt-2 font-heading text-2xl text-white/90 md:text-3xl">{generation.region} {t.pages.region}</p>
        <p className="mt-3 text-lg text-white/80 md:text-xl">{interpolate(t.pages.speciesCount, { count: initialData.count })}</p>
      </div>

      {/* Back Link */}
      <div>
        <a href={`/${locale}`} className="themed-text-secondary inline-flex items-center gap-2 font-heading font-bold transition-opacity hover:opacity-70">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          {t.pages.backToHome}
        </a>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (
          <li key={poke.name} className="list-none">
            <PokemonTile pokemon={poke} locale={locale} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div ref={ref} className="my-10 flex justify-center">
          {loading ? (
            <div className="text-center">
              <div className="ptype-fire pt-spinner mx-auto h-12 w-12 rounded-full border-t-4 border-transparent pokeball-spin" />
              <p className="themed-text-secondary mt-3 font-heading text-sm">{t.scroll.loadingMore}</p>
            </div>
          ) : (
            <div className="h-10" />
          )}
        </div>
      )}

      {!hasMore && pokemon.length > 0 && (
        <div className="my-10 text-center">
          <p className="themed-text-secondary font-heading text-lg font-bold">{t.scroll.caughtAll}</p>
          <p className="themed-text-secondary mt-1 text-sm">{interpolate(t.scroll.showingAll, { count: pokemon.length })}</p>
        </div>
      )}
    </div>
  )
}
