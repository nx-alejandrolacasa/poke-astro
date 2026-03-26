import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type ThemeMode = 'auto' | 'light' | 'dark'

type SettingsDrawerProps = {
  locale: Locale
  isOpen: boolean
  onClose: () => void
}

export function SettingsDrawer({ locale, isOpen, onClose }: SettingsDrawerProps) {
  const t = translations[locale]
  const [mounted, setMounted] = useState(false)
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      setThemeMode(saved)
    } else {
      setThemeMode('auto')
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
    if (mode === 'auto') {
      localStorage.removeItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    } else if (mode === 'dark') {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    } else {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    }
  }

  const switchToLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    const currentPath = window.location.pathname
    const pathWithoutLocale = currentPath.replace(/^\/(en|es)/, '')
    window.location.href = `/${newLocale}${pathWithoutLocale || ''}`
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
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-[100] flex w-80 max-w-[85vw] transform flex-col shadow-2xl transition-transform duration-300 ease-in-out bg-white dark:bg-dex-panel border-l border-gray-200 dark:border-dex-border ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.settings.title}
      >
        {/* Drawer header */}
        <div className="flex shrink-0 items-center justify-between p-5 border-b border-gray-200 dark:border-dex-border">
          <h2 className="font-display font-bold text-sm uppercase tracking-widest text-gray-900 dark:text-neon-cyan">
            {t.settings.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dex-surface"
            aria-label={t.header.close}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer content */}
        <div className="flex flex-1 flex-col gap-8 p-5">
          {/* Theme Mode */}
          <div className="hud-corners rounded-lg border border-gray-200 p-4 dark:border-dex-border">
            <label className="mb-3 block font-display text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-primary/70">
              {t.settings.theme}
            </label>
            <div className="flex gap-2">
              {themeModes.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyTheme(key)}
                  className={`flex-1 rounded-md px-3 py-2 font-mono text-xs font-medium transition-all border ${
                    themeMode === key
                      ? 'border-primary-500 text-primary-600 bg-primary-50 shadow-sm dark:border-primary dark:text-neon-cyan dark:bg-primary/10 dark:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                      : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-dex-border dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dex-surface'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="hud-corners rounded-lg border border-gray-200 p-4 dark:border-dex-border">
            <label className="mb-3 block font-display text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-primary/70">
              {t.settings.language}
            </label>
            <div className="flex gap-2">
              {(['en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => switchToLocale(lang)}
                  className={`flex-1 rounded-md px-3 py-2 font-mono text-xs font-medium transition-all border ${
                    locale === lang
                      ? 'border-primary-500 text-primary-600 bg-primary-50 shadow-sm dark:border-primary dark:text-neon-cyan dark:bg-primary/10 dark:shadow-[0_0_8px_rgba(59,130,246,0.2)]'
                      : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:border-dex-border dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-dex-surface'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Español'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div className="border-t border-gray-200 p-4 dark:border-dex-border">
          <p className="font-mono text-[10px] text-center text-gray-400 uppercase tracking-widest dark:text-gray-600">
            Pokédex v2.0
          </p>
        </div>
      </div>
    </>
  )

  if (!mounted) return null
  return createPortal(drawerContent, document.body)
}
