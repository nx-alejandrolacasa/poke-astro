import { DarkModeToggle } from '@/components/DarkModeToggle'
import { LanguageSelector } from '@/components/LanguageSelector'
import { HeaderPokedexButton } from '@/components/HeaderPokedexButton'
import { MobileMenuDrawer } from '@/components/MobileMenuDrawer'
import type { Locale } from '@/utils/i18n'

type HeaderActionsProps = {
  locale: Locale
}

export function HeaderActions({ locale }: HeaderActionsProps) {
  return (
    <>
      {/* Desktop controls - hidden on mobile */}
      <div className="hidden items-center gap-2 sm:flex sm:gap-3">
        <LanguageSelector locale={locale} />
        <HeaderPokedexButton locale={locale} />
        <DarkModeToggle />
      </div>
      {/* Mobile menu drawer */}
      <MobileMenuDrawer locale={locale} />
    </>
  )
}
