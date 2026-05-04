import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type BackButtonProps = {
  locale: Locale
}

export function BackButton({ locale }: BackButtonProps) {
  const t = translations[locale]
  // Default to enabled so SSR/hydration match the common case where the user
  // arrived via in-app navigation; disable only after we confirm there's no
  // sensible previous page (no referrer, or referrer is off-origin).
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    // Modern Navigation API exposes canGoBack directly (PWA-friendly)
    const nav = (window as Window & { navigation?: { canGoBack?: boolean } })
      .navigation
    if (nav?.canGoBack != null) {
      setEnabled(nav.canGoBack)
      return
    }
    // Fallback: history.length > 1 means there is at least one prior entry
    // (covers PWA standalone mode where document.referrer is empty)
    if (window.history.length > 1) {
      setEnabled(true)
      return
    }
    // No history entries and no referrer — disable
    if (!document.referrer) {
      setEnabled(false)
      return
    }
    try {
      const ref = new URL(document.referrer)
      setEnabled(ref.origin === window.location.origin)
    } catch {
      setEnabled(false)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => {
        if (enabled) window.history.back()
      }}
      disabled={!enabled}
      aria-label={t.pages.back}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-white/60 bg-white/70 px-2.5 py-2.5 font-semibold text-red-500 text-sm shadow-lg shadow-black/[0.08] backdrop-blur-xl transition-all hover:bg-red-500/10 active:scale-95 disabled:pointer-events-none disabled:cursor-default disabled:opacity-40 md:px-4 md:py-2 dark:border-white/[0.08] dark:bg-dark-surface/70 dark:text-red-300 dark:shadow-black/30 dark:hover:bg-red-500/15"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="hidden md:inline">{t.pages.back}</span>
    </button>
  )
}
