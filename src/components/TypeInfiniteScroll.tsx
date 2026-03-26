import { useCallback, useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'
import { PokemonTile } from './PokemonTile'

type TypeInfiniteScrollProps = {
  initialData: PokemonList
  type: string
  typeColor: string
  locale: Locale
}

export function TypeInfiniteScroll({ initialData, type, typeColor, locale }: TypeInfiniteScrollProps) {
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
      const response = await fetch(`/api/type/${type}/${nextPage}`)
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
  }, [page, loading, hasMore, pokemon.length, type])

  useEffect(() => {
    if (inView && hasMore && !loading) loadMore()
  }, [inView, hasMore, loading, loadMore])

  return (
    <div className="space-y-8">
      <div className={`bg-gradient-to-r ${typeColor} rounded-2xl p-8 md:p-12 text-center shadow-xl relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-wider mb-4">{t.pages.typeTitle} {t.types[type as keyof typeof t.types]}</h1>
          <p className="text-sm md:text-base text-white/70 font-mono">{interpolate(t.pages.speciesCount, { count: initialData.count })}</p>
        </div>
      </div>
      <div>
        <a href={`/${locale}`} className="inline-flex items-center gap-2 font-mono text-sm text-primary-600 transition-colors hover:text-primary-700 dark:text-neon-blue/70 dark:hover:text-neon-cyan">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          {t.pages.backToHome}
        </a>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {pokemon.map((poke) => (<li key={poke.name} className="list-none"><PokemonTile pokemon={poke} locale={locale} /></li>))}
      </ul>
      {hasMore && (
        <div ref={ref} className="my-8 flex justify-center">
          {loading ? (<div className="text-center"><div className="radar-loader mx-auto" /><p className="mt-3 font-mono text-xs text-gray-500 dark:text-neon-blue/50">{t.scroll.loadingMore}</p></div>) : <div className="h-10" />}
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
