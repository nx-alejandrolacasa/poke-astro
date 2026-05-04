import { useCallback } from 'react'
import { BackButton } from '@/components/BackButton'
import { BackToTop } from '@/components/BackToTop'
import { RecentlyVisited } from '@/components/RecentlyVisited'
import { VirtualPokemonGrid } from '@/components/VirtualPokemonGrid'
import type { Locale } from '@/utils/i18n'
import type { PokemonList } from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'

type GenerationInfiniteScrollProps = {
  initialData: PokemonList
  generation: { id: number; name: string; region: string }
  generationColor: string
  locale: Locale
}

const PAGE_SIZE = 30

export function GenerationInfiniteScroll({
  initialData,
  generation,
  locale,
}: GenerationInfiniteScrollProps) {
  const t = translations[locale]
  const cacheNamespace = `generation:${generation.id}`
  const fetchPage = useCallback(
    async (page: number) => {
      const res = await fetch(`/api/generation/${generation.id}/${page}`)
      return (await res.json()) as PokemonList
    },
    [generation.id]
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BackButton locale={locale} />
        <RecentlyVisited locale={locale} />
      </div>
      {/* Colored banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-surface-sunken p-6 md:p-8 dark:from-dark-raised dark:to-dark-surface">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="font-bold text-2xl text-ink tracking-tight md:text-3xl dark:text-dark-ink">
              {generation.name}
            </h1>
            <p className="font-medium text-ink-muted text-sm dark:text-dark-ink-muted">
              {generation.region} &middot;{' '}
              {interpolate(t.pages.speciesCount, { count: initialData.count })}
            </p>
          </div>
        </div>
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
