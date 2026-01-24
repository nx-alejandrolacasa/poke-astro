import { LanguageProvider } from '@/contexts/LanguageContext'
import { PokemonSearch } from './PokemonSearch'

export function PokemonSearchWrapper() {
  return (
    <LanguageProvider>
      <PokemonSearch />
    </LanguageProvider>
  )
}
