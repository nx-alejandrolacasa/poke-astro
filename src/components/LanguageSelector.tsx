import type { Locale } from '@/utils/i18n'

type LanguageSelectorProps = {
  locale: Locale
}

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const switchToLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '')
    window.location.href = `/${newLocale}${pathWithoutLocale || ''}`
  }

  return (
    <div className="themed-bg themed-border flex items-center gap-0.5 rounded-xl border p-1">
      <button
        type="button"
        onClick={() => switchToLocale('en')}
        className={`rounded-lg px-3 py-1.5 font-heading text-sm font-bold transition-all ${locale === 'en' ? 'lang-active' : 'themed-text-secondary'}`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchToLocale('es')}
        className={`rounded-lg px-3 py-1.5 font-heading text-sm font-bold transition-all ${locale === 'es' ? 'lang-active' : 'themed-text-secondary'}`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
