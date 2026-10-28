import type { ReactNode } from 'react'
import { BackButton } from '@/components/BackButton'
import { BackToTop } from '@/components/BackToTop'
import { RecentlyVisited } from '@/components/RecentlyVisited'
import { VirtualPokemonGrid } from '@/components/VirtualPokemonGrid'
import type { Locale } from '@/utils/i18n'
import type { PokemonSummary } from '@/utils/pokemon'

type PokemonListerProps = {
  pokemon: PokemonSummary[]
  locale: Locale
  banner?: ReactNode
  filters?: ReactNode
}

export function PokemonLister({
  pokemon,
  locale,
  banner,
  filters,
}: PokemonListerProps) {
  return (
    <div className="space-y-8">
      <div className="flex min-h-9 items-center gap-2">
        <BackButton locale={locale} />
        <RecentlyVisited locale={locale} />
      </div>
      {filters && <div>{filters}</div>}
      {banner && <div>{banner}</div>}
      <VirtualPokemonGrid pokemon={pokemon} locale={locale} />
      <BackToTop />
    </div>
  )
}
