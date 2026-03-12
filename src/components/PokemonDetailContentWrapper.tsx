import type { Locale } from '@/utils/i18n'
import type { Pokemon } from '@/utils/pokemon'
import { PokemonDetailContent } from './PokemonDetailContent'

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
    <PokemonDetailContent
      pokemon={pokemon}
      pokemonName={pokemonName}
      locale={locale}
    />
  )
}
