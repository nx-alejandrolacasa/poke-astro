import type { Locale } from '@/utils/i18n'
import { PokemonInfiniteScroll } from './PokemonInfiniteScroll'
import type { PokemonList } from '@/utils/pokemon'

type PokemonInfiniteScrollWrapperProps = {
  initialData: PokemonList
  initialPage?: number
  locale: Locale
}

export function PokemonInfiniteScrollWrapper({
  initialData,
  initialPage,
  locale,
}: PokemonInfiniteScrollWrapperProps) {
  return (
    <PokemonInfiniteScroll
      initialData={initialData}
      initialPage={initialPage}
      locale={locale}
    />
  )
}
