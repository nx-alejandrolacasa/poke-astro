import type { Locale } from '@/utils/i18n'
import { HomeContent } from './HomeContent'

type HomeContentWrapperProps = {
  totalPokemon: number
  locale: Locale
}

export function HomeContentWrapper({ totalPokemon, locale }: HomeContentWrapperProps) {
  return <HomeContent totalPokemon={totalPokemon} locale={locale} />
}
