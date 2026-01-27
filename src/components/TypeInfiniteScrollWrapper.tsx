import type { Locale } from '@/utils/i18n'
import { TypeInfiniteScroll } from './TypeInfiniteScroll'
import type { PokemonList } from '@/utils/pokemon'

type TypeInfiniteScrollWrapperProps = {
  initialData: PokemonList
  type: string
  typeColor: string
  locale: Locale
}

export function TypeInfiniteScrollWrapper({
  initialData,
  type,
  typeColor,
  locale,
}: TypeInfiniteScrollWrapperProps) {
  return (
    <TypeInfiniteScroll
      initialData={initialData}
      type={type}
      typeColor={typeColor}
      locale={locale}
    />
  )
}
