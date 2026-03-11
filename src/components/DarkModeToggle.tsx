import { useState, useEffect } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type Theme = 'auto' | 'dark' | 'light'

declare global {
  interface Window {
    theme?: {
      setTheme: (theme: Theme | string) => void
      getTheme: () => Theme
    }
  }
}

type DarkModeToggleProps = {
  locale: Locale
}

const themeOrder: Theme[] = ['auto', 'light', 'dark']

export function DarkModeToggle({ locale }: DarkModeToggleProps) {
  const t = translations[locale]
  const [current, setCurrent] = useState<Theme>('auto')

  useEffect(() => {
    setCurrent(window.theme?.getTheme() ?? 'auto')
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setCurrent(detail?.theme ?? 'auto')
    }
    document.addEventListener('theme-changed', handler)
    return () => document.removeEventListener('theme-changed', handler)
  }, [])

  const cycle = () => {
    const nextIndex = (themeOrder.indexOf(current) + 1) % themeOrder.length
    const next = themeOrder[nextIndex]
    window.theme?.setTheme(next)
    setCurrent(next)
  }

  const label = t.theme[current]

  return (
    <button
      type="button"
      onClick={cycle}
      className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-400 to-indigo-500 px-3 py-2 font-medium text-white text-sm shadow-sm transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-600 hover:shadow-md active:scale-95 dark:from-orange-400 dark:to-yellow-500 dark:text-gray-900 dark:hover:from-orange-500 dark:hover:to-yellow-600"
      title={`${t.theme.label}: ${label}`}
      aria-label={`${t.theme.label}: ${label}`}
    >
      {/* Sun icon - light mode */}
      {current === 'light' && (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      {/* Moon icon - dark mode */}
      {current === 'dark' && (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
      {/* Monitor icon - auto mode */}
      {current === 'auto' && (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  )
}
