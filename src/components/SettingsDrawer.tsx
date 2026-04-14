import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '@/utils/i18n'
import { locales, localizeUrl } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type ThemeMode = 'auto' | 'light' | 'dark'

type SettingsDrawerProps = {
  locale: Locale
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    theme?: {
      setTheme: (mode: string) => void
      getTheme: () => string
    }
  }
}

export function SettingsDrawer({
  locale,
  isOpen,
  onClose,
}: SettingsDrawerProps) {
  const t = translations[locale]
  const [mounted, setMounted] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (window.theme) {
      const current = window.theme.getTheme()
      setThemeMode(current === 'dark' || current === 'light' ? current : 'auto')
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const applyTheme = (mode: ThemeMode) => {
    setThemeMode(mode)
    if (window.theme) {
      window.theme.setTheme(mode)
    }
  }

  const switchToLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    window.location.href = localizeUrl(window.location.pathname, newLocale)
  }

  const getLocaleDisplayName = (lang: Locale): string => {
    try {
      const displayNames = new Intl.DisplayNames([lang], { type: 'language' })
      const name = displayNames.of(lang) ?? lang
      return name.charAt(0).toUpperCase() + name.slice(1)
    } catch {
      return lang.toUpperCase()
    }
  }

  const themeModes: { key: ThemeMode; label: string }[] = [
    { key: 'auto', label: t.settings.auto },
    { key: 'light', label: t.settings.light },
    { key: 'dark', label: t.settings.dark },
  ]

  const drawerContent = (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-[100] flex w-80 max-w-[85vw] transform flex-col border-black/[0.06] border-l bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-white/[0.06] dark:bg-dark-surface ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
      >
        <div className="flex shrink-0 items-center justify-between border-surface-sunken border-b p-5 dark:border-dark-border">
          <h2 className="font-bold text-ink text-sm dark:text-dark-ink">
            {t.settings.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-ink-muted transition-all duration-150 hover:bg-black/5 active:scale-90 dark:text-dark-ink-muted dark:hover:bg-white/5"
            aria-label={t.header.close}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 p-5">
          <div className="rounded-2xl bg-surface-sunken p-4 dark:bg-dark-raised">
            <span className="mb-3 block font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
              {t.settings.theme}
            </span>
            <div className="flex gap-2">
              {themeModes.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyTheme(key)}
                  className={`flex-1 rounded-xl px-3 py-2 font-medium text-xs transition-all ${
                    themeMode === key
                      ? 'bg-white text-primary shadow-sm dark:bg-dark-surface dark:text-primary'
                      : 'text-ink-muted hover:bg-white/50 hover:text-ink dark:text-dark-ink-muted dark:hover:bg-dark-surface/50 dark:hover:text-dark-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-surface-sunken p-4 dark:bg-dark-raised">
            <span className="mb-3 block font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
              {t.settings.language}
            </span>
            <div className="flex gap-2">
              {locales.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => switchToLocale(lang)}
                  className={`flex-1 rounded-xl px-3 py-2 font-medium text-xs transition-all ${
                    locale === lang
                      ? 'bg-white text-primary shadow-sm dark:bg-dark-surface dark:text-primary'
                      : 'text-ink-muted hover:bg-white/50 hover:text-ink dark:text-dark-ink-muted dark:hover:bg-dark-surface/50 dark:hover:text-dark-ink'
                  }`}
                >
                  {getLocaleDisplayName(lang)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-surface-sunken border-t p-4 dark:border-dark-border">
          <p className="text-center text-[10px] text-ink-faint uppercase tracking-widest dark:text-dark-ink-faint">
            Pokedex v2.0
          </p>
        </div>
      </div>
    </>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
