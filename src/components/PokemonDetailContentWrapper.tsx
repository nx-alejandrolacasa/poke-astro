import type { Locale } from '@/utils/i18n'
import { PokemonDetailContent } from './PokemonDetailContent'
import type { Pokemon } from '@/utils/pokemon'

type PokemonDetailContentWrapperProps = {
  pokemon: Pokemon
  pokemonName: string
  locale: Locale
}

export function PokemonDetailContentWrapper({
  pokemon,
  pokemonName,
  locale,
}: PokemonDetailContentWrapperProps) {
  return (
    <PokemonDetailContent pokemon={pokemon} pokemonName={pokemonName} locale={locale} />
  )
}
