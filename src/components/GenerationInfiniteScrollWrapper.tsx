import { LanguageProvider } from '@/contexts/LanguageContext'
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
}

export function GenerationInfiniteScrollWrapper({
  initialData,
  generation,
  generationColor,
}: GenerationInfiniteScrollWrapperProps) {
  return (
    <LanguageProvider>
      <GenerationInfiniteScroll
        initialData={initialData}
        generation={generation}
        generationColor={generationColor}
      />
    </LanguageProvider>
  )
}
