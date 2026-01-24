import { LanguageProvider } from '@/contexts/LanguageContext'
import { TypeInfiniteScroll } from './TypeInfiniteScroll'
import type { PokemonList } from '@/utils/pokemon'

type TypeInfiniteScrollWrapperProps = {
  initialData: PokemonList
  type: string
  typeColor: string
}

export function TypeInfiniteScrollWrapper({
  initialData,
  type,
  typeColor,
}: TypeInfiniteScrollWrapperProps) {
  return (
    <LanguageProvider>
      <TypeInfiniteScroll initialData={initialData} type={type} typeColor={typeColor} />
    </LanguageProvider>
  )
}
