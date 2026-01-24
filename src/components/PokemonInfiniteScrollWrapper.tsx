import { LanguageProvider } from '@/contexts/LanguageContext'
import { PokemonInfiniteScroll } from './PokemonInfiniteScroll'
import type { PokemonList } from '@/utils/pokemon'

type PokemonInfiniteScrollWrapperProps = {
  initialData: PokemonList
  initialPage?: number
}

export function PokemonInfiniteScrollWrapper({
  initialData,
  initialPage,
}: PokemonInfiniteScrollWrapperProps) {
  return (
    <LanguageProvider>
      <PokemonInfiniteScroll initialData={initialData} initialPage={initialPage} />
    </LanguageProvider>
  )
}
