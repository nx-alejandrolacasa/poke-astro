import { useCallback } from 'react'
import { BackButton } from '@/components/BackButton'
import { BackToTop } from '@/components/BackToTop'
import { RecentlyVisited } from '@/components/RecentlyVisited'
import { VirtualPokemonGrid } from '@/components/VirtualPokemonGrid'
import type { Locale } from '@/utils/i18n'
import type { PokemonList } from '@/utils/pokemon'

type PokemonInfiniteScrollProps = {
  initialData: PokemonList
  locale: Locale
}

const PAGE_SIZE = 30
const CACHE_NAMESPACE = 'pokedex'

export function PokemonInfiniteScroll({
  initialData,
  locale,
}: PokemonInfiniteScrollProps) {
  const fetchPage = useCallback(async (page: number) => {
    const res = await fetch(`/api/pokemon/page/${page}`)
    return (await res.json()) as PokemonList
  }, [])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <BackButton locale={locale} />
        <RecentlyVisited locale={locale} />
      </div>
      <VirtualPokemonGrid
        initialPokemon={initialData.results}
        totalCount={initialData.count}
        pageSize={PAGE_SIZE}
        fetchPage={fetchPage}
        cacheNamespace={CACHE_NAMESPACE}
        locale={locale}
      />
      <BackToTop />
    </div>
  )
}
