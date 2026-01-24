import { DarkModeToggle } from './DarkModeToggle'
import { LanguageSelector } from './LanguageSelector'
import { HeaderPokedexButton } from './HeaderPokedexButton'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function HeaderActions() {
  return (
    <LanguageProvider>
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelector />
        <HeaderPokedexButton />
        <DarkModeToggle />
      </div>
    </LanguageProvider>
  )
}
