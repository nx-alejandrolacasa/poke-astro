import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'
import { PokemonTile } from './PokemonTile'

type GenerationInfiniteScrollProps = {
  initialData: PokemonList
  generation: { id: number; name: string; region: string }
  generationColor: string
  locale: Locale
}

export function GenerationInfiniteScroll({ initialData, generation, generationColor, locale }: GenerationInfiniteScrollProps) {
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
      <div className="space-y-2 pt-4 md:pt-6">
        <a href={`/${locale}`} className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-primary dark:text-dark-ink-muted dark:hover:text-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          {t.pages.backToHome}
        </a>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-ink dark:text-dark-ink">
          {generation.name} <span className="text-ink-muted dark:text-dark-ink-muted">{generation.region}</span>
        </h1>
        <p className="text-sm text-ink-muted md:text-base dark:text-dark-ink-muted">{interpolate(t.pages.speciesCount, { count: initialData.count })}</p>
      </div>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (<li key={poke.name} className="list-none"><PokemonTile pokemon={poke} locale={locale} /></li>))}
      </ul>
      {hasMore && (
        <div ref={ref} className="my-10 flex justify-center">
          {loading ? (<div className="text-center"><div className="prismatic-loader mx-auto" /><p className="mt-3 text-xs text-ink-muted dark:text-dark-ink-muted">{t.scroll.loadingMore}</p></div>) : <div className="h-10" />}
        </div>
      )}
      {!hasMore && pokemon.length > 0 && (
        <div className="my-10 text-center">
          <p className="text-sm text-ink-muted dark:text-dark-ink-muted">{t.scroll.caughtAll}</p>
          <p className="mt-1 text-xs text-ink-faint dark:text-dark-ink-faint">{interpolate(t.scroll.showingAll, { count: pokemon.length })}</p>
        </div>
      )}
    </div>
  )
}
