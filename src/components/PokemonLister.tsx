import type { ReactNode } from 'react'
import { BackButton } from '@/components/BackButton'
import { BackToTop } from '@/components/BackToTop'
import { VirtualPokemonGrid } from '@/components/VirtualPokemonGrid'
import type { Locale } from '@/utils/i18n'
import type { PokemonSummary } from '@/utils/pokemon'

type PokemonListerProps = {
  pokemon: PokemonSummary[]
  locale: Locale
  filters?: ReactNode
}

export function PokemonLister({
  pokemon,
  locale,
  filters,
}: PokemonListerProps) {
  return (
    <div className="space-y-8">
      <div className="flex min-h-9 items-center gap-3">
        <BackButton locale={locale} />
        <div className="min-w-0 flex-1">{filters}</div>
      </div>
      <VirtualPokemonGrid pokemon={pokemon} locale={locale} />
      <BackToTop />
    </div>
  )
}
