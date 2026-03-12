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
        <div className="flex items-center rounded-lg border-2 border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
          <theme-toggle data-locale={locale}></theme-toggle>
        </div>
        <HeaderPokedexButton locale={locale} />
      </div>
      {/* Mobile menu drawer */}
      <MobileMenuDrawer locale={locale} />
    </>
  )
}
