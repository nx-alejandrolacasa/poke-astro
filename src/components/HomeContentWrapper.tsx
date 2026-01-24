import { LanguageProvider } from '@/contexts/LanguageContext'
import { HomeContent } from './HomeContent'

type HomeContentWrapperProps = {
  totalPokemon: number
}

export function HomeContentWrapper({ totalPokemon }: HomeContentWrapperProps) {
  return (
    <LanguageProvider>
      <HomeContent totalPokemon={totalPokemon} />
    </LanguageProvider>
  )
}
