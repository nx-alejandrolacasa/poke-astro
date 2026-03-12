import type { Locale } from '@/utils/i18n'
import type { PokemonList } from '@/utils/pokemon'
import { TypeInfiniteScroll } from './TypeInfiniteScroll'

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
