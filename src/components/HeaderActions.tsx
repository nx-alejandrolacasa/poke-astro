import { DarkModeToggle } from '@/components/DarkModeToggle'
import { LanguageSelector } from '@/components/LanguageSelector'
import { HeaderPokedexButton } from '@/components/HeaderPokedexButton'
import { MobileMenuDrawer } from '@/components/MobileMenuDrawer'
import { LanguageProvider } from '@/contexts/LanguageContext'

export function HeaderActions() {
  return (
    <LanguageProvider>
      {/* Desktop controls - hidden on mobile */}
      <div className="hidden items-center gap-2 sm:flex sm:gap-3">
        <LanguageSelector />
        <HeaderPokedexButton />
        <DarkModeToggle />
      </div>
      {/* Mobile menu drawer */}
      <MobileMenuDrawer />
    </LanguageProvider>
  )
}
