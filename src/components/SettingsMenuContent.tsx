import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { locales, localizeUrl } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type ThemeMode = 'auto' | 'light' | 'dark'

declare global {
  interface Window {
    theme?: {
      getTheme: () => ThemeMode
      setTheme: (mode: ThemeMode) => void
    }
  }
}

const THEME_ICON_PATHS: Record<ThemeMode, string> = {
  auto: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  light:
    'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  dark: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
}

type SettingsMenuContentProps = {
  locale: Locale
  currentPath: string
  onClose: () => void
}

export function SettingsMenuContent({
  locale,
  currentPath,
  onClose,
}: SettingsMenuContentProps) {
  const t = translations[locale]
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('auto')

  useEffect(() => {
    if (window.theme) setCurrentTheme(window.theme.getTheme())
    const sync = (e: Event) => {
      const detail = (e as CustomEvent).detail as { theme?: ThemeMode } | undefined
      if (detail?.theme) setCurrentTheme(detail.theme)
    }
    document.addEventListener('theme-changed', sync)
    return () => document.removeEventListener('theme-changed', sync)
  }, [])

  const applyTheme = (mode: ThemeMode) => {
    window.theme?.setTheme(mode)
    setCurrentTheme(mode)
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-ink text-sm dark:text-dark-ink">{t.settings.title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-black/5 hover:text-ink dark:text-dark-ink-muted dark:hover:bg-white/8 dark:hover:text-dark-ink"
          aria-label={t.modal.close}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="mb-2 font-semibold text-ink-muted text-xs uppercase tracking-wider dark:text-dark-ink-muted">{t.settings.language}</p>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {locales.map((loc) => (
          <a
            key={loc}
            href={localizeUrl(currentPath, loc)}
            className={`flex items-center justify-center rounded-xl px-3 py-2 font-semibold text-sm transition-colors ${
              locale === loc
                ? 'bg-primary/15 text-primary dark:bg-dark-primary/20 dark:text-dark-primary'
                : 'bg-black/5 text-ink-muted hover:bg-black/10 dark:bg-white/5 dark:text-dark-ink-muted dark:hover:bg-white/10'
            }`}
          >
            {loc.toUpperCase()}
          </a>
        ))}
      </div>

      <p className="mb-2 font-semibold text-ink-muted text-xs uppercase tracking-wider dark:text-dark-ink-muted">{t.settings.theme}</p>
      <div className="grid grid-cols-3 gap-2">
        {(['auto', 'light', 'dark'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => applyTheme(mode)}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 font-semibold text-xs transition-colors ${
              currentTheme === mode
                ? 'bg-primary/15 text-primary dark:bg-dark-primary/20 dark:text-dark-primary'
                : 'bg-black/5 text-ink-muted hover:bg-black/10 dark:bg-white/5 dark:text-dark-ink-muted dark:hover:bg-white/10'
            }`}
            aria-pressed={currentTheme === mode}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={THEME_ICON_PATHS[mode]} />
            </svg>
            {t.settings[mode]}
          </button>
        ))}
      </div>
    </>
  )
}
