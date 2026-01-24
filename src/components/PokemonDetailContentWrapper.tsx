import { LanguageProvider } from '@/contexts/LanguageContext'
import { PokemonDetailContent } from './PokemonDetailContent'
import type { Pokemon } from '@/utils/pokemon'

type PokemonDetailContentWrapperProps = {
  pokemon: Pokemon
  pokemonName: string
}

export function PokemonDetailContentWrapper({
  pokemon,
  pokemonName,
}: PokemonDetailContentWrapperProps) {
  return (
    <LanguageProvider>
      <PokemonDetailContent pokemon={pokemon} pokemonName={pokemonName} />
    </LanguageProvider>
  )
}
