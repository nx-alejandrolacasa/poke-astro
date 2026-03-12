import type { Locale } from '@/utils/i18n'

type LanguageSelectorProps = {
  locale: Locale
}

export function LanguageSelector({ locale }: LanguageSelectorProps) {
  const switchToLocale = (newLocale: Locale) => {
    if (newLocale === locale) return

    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '')
    const newPath = `/${newLocale}${pathWithoutLocale || ''}`

    window.location.href = newPath
  }

  return (
    <div
      className="flex items-center gap-0.5 rounded-xl p-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
    >
      <button
        type="button"
        onClick={() => switchToLocale('en')}
        className="rounded-lg px-3 py-1.5 font-heading text-sm font-bold transition-all"
        style={locale === 'en'
          ? { background: 'linear-gradient(135deg, #6390F0, #A190D0)', color: 'white' }
          : { color: 'var(--text-secondary)' }
        }
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchToLocale('es')}
        className="rounded-lg px-3 py-1.5 font-heading text-sm font-bold transition-all"
        style={locale === 'es'
          ? { background: 'linear-gradient(135deg, #6390F0, #A190D0)', color: 'white' }
          : { color: 'var(--text-secondary)' }
        }
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
