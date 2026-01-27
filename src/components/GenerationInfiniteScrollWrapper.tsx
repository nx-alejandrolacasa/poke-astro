import type { Locale } from '@/utils/i18n'
import { GenerationInfiniteScroll } from './GenerationInfiniteScroll'
import type { PokemonList } from '@/utils/pokemon'

type GenerationInfiniteScrollWrapperProps = {
  initialData: PokemonList
  generation: {
    id: number
    name: string
    region: string
  }
  generationColor: string
  locale: Locale
}

export function GenerationInfiniteScrollWrapper({
  initialData,
  generation,
  generationColor,
  locale,
}: GenerationInfiniteScrollWrapperProps) {
  return (
    <GenerationInfiniteScroll
      initialData={initialData}
      generation={generation}
      generationColor={generationColor}
      locale={locale}
    />
  )
}
