import type { Locale } from '@/utils/i18n'
import type { PokemonList } from '@/utils/pokemon'
import { GenerationInfiniteScroll } from './GenerationInfiniteScroll'

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
