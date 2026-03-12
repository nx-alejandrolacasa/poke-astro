import { useState, useEffect, useCallback } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type Theme = 'auto' | 'dark' | 'light'

type DarkModeToggleProps = {
  locale: Locale
}

declare global {
  interface Window {
    theme?: { setTheme: (t: string) => void; getTheme: () => string }
  }
}

const themeOrder: Theme[] = ['auto', 'light', 'dark']

const icons: Record<Theme, { label: string; d: string }> = {
  light: {
    label: 'Sun',
    d: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  },
  dark: {
    label: 'Moon',
    d: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z',
  },
  auto: {
    label: 'Monitor',
    d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
}

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || stored === 'light') return stored
  } catch {}
  return null
}

function getPreferredTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(setting: Theme): 'dark' | 'light' {
  return setting === 'dark' || setting === 'light' ? setting : getPreferredTheme()
}

function applyTheme(setting: Theme) {
  // Use window.theme if available (inline script ran), otherwise apply directly
  if (window.theme) {
    window.theme.setTheme(setting)
    return
  }

  // Fallback: apply theme directly (inline script blocked by CSP)
  const resolved = resolveTheme(setting)
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved

  try {
    if (setting === 'dark' || setting === 'light') {
      localStorage.setItem('theme', setting)
    } else {
      localStorage.removeItem('theme')
    }
  } catch {}

  document.dispatchEvent(
    new CustomEvent('theme-changed', { detail: { theme: setting } })
  )
}

function getCurrentTheme(): Theme {
  if (window.theme) return window.theme.getTheme() as Theme
  return getStoredTheme() || 'auto'
}

export function DarkModeToggle({ locale }: DarkModeToggleProps) {
  const t = translations[locale]
  const [current, setCurrent] = useState<Theme>('auto')

  useEffect(() => {
    const theme = getCurrentTheme()
    setCurrent(theme)
    // Apply on mount in case the inline head script was blocked by CSP
    applyTheme(theme)

    const onThemeChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.theme) setCurrent(detail.theme as Theme)
    }
    document.addEventListener('theme-changed', onThemeChanged)
    return () => document.removeEventListener('theme-changed', onThemeChanged)
  }, [])

  const cycle = useCallback(() => {
    setCurrent((prev) => {
      const nextIndex = (themeOrder.indexOf(prev) + 1) % themeOrder.length
      const next = themeOrder[nextIndex]
      applyTheme(next)
      return next
    })
  }, [])

  const label = t.theme[current]
  const icon = icons[current]

  return (
    <div className="flex items-center rounded-lg border-2 border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={cycle}
        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 font-semibold text-sm text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        title={`${t.theme.label}: ${label}`}
        aria-label={`${t.theme.label}: ${label}`}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.d} />
        </svg>
        <span>{label}</span>
      </button>
    </div>
  )
}
