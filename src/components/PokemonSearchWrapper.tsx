import type { Locale } from '@/utils/i18n'
import { PokemonSearch } from './PokemonSearch'

type PokemonSearchWrapperProps = {
  locale: Locale
}

export function PokemonSearchWrapper({ locale }: PokemonSearchWrapperProps) {
  return <PokemonSearch locale={locale} />
}
