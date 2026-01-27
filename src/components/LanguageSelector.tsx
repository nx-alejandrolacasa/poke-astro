import type { Locale } from '@/utils/i18n'

type LanguageSelectorProps = {
  locale: Locale
}

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const switchToLocale = (newLocale: Locale) => {
    if (newLocale === locale) return

    // Get current path and replace the locale prefix
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '')
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`

    window.location.href = newPath
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border-2 border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => switchToLocale('en')}
        className={`rounded-md px-3 py-1.5 font-semibold text-sm transition-all ${
          locale === 'en'
            ? 'bg-primary-400 text-white shadow-md dark:bg-primary-500'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchToLocale('es')}
        className={`rounded-md px-3 py-1.5 font-semibold text-sm transition-all ${
          locale === 'es'
            ? 'bg-primary-400 text-white shadow-md dark:bg-primary-500'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
