import type { ReactNode } from 'react'
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
      {filters}
      <VirtualPokemonGrid pokemon={pokemon} locale={locale} />
      <BackToTop />
    </div>
  )
}
