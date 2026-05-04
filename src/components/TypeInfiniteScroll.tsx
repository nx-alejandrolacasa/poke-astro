import { useCallback } from 'react'
import { BackButton } from '@/components/BackButton'
import { BackToTop } from '@/components/BackToTop'
import { RecentlyVisited } from '@/components/RecentlyVisited'
import { VirtualPokemonGrid } from '@/components/VirtualPokemonGrid'
import type { Locale } from '@/utils/i18n'
import type { PokemonList } from '@/utils/pokemon'
import { typeColors } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'

type TypeInfiniteScrollProps = {
  initialData: PokemonList
  type: string
  typeColor: string
  locale: Locale
}

const PAGE_SIZE = 30

export function TypeInfiniteScroll({
  initialData,
  type,
  locale,
}: TypeInfiniteScrollProps) {
  const t = translations[locale]
  const cacheNamespace = `type:${type}`
  const fetchPage = useCallback(
    async (page: number) => {
      const res = await fetch(`/api/type/${type}/${page}`)
      return (await res.json()) as PokemonList
    },
    [type]
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton locale={locale} />
        <RecentlyVisited locale={locale} />
      </div>
      {/* Colored banner */}
      <div
        className="rounded-2xl p-6 md:p-8"
        style={{ backgroundColor: `${typeColors[type] ?? '#a8a878'}18` }}
      >
        <h1 className="font-bold text-2xl text-ink tracking-tight md:text-3xl dark:text-dark-ink">
          {t.types[type as keyof typeof t.types]}
        </h1>
        <p className="text-ink-muted text-sm dark:text-dark-ink-muted">
          {interpolate(t.pages.speciesCount, { count: initialData.count })}
        </p>
      </div>
      <VirtualPokemonGrid
        initialPokemon={initialData.results}
        totalCount={initialData.count}
        pageSize={PAGE_SIZE}
        fetchPage={fetchPage}
        cacheNamespace={cacheNamespace}
        locale={locale}
      />
      <BackToTop />
    </div>
  )
}
