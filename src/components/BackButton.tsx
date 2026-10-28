import { navigate } from 'astro:transitions/client'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { isDetailRoute, lastNonDetailRoute } from '@/utils/routeHistory'
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
  const [target, setTarget] = useState<string | null>(null)

  useEffect(() => {
    const path = window.location.pathname
    const fromDetail = isDetailRoute(path) ? lastNonDetailRoute(path) : null
    setTarget(fromDetail)
    if (fromDetail) {
      setEnabled(true)
      return
    }
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
        if (target) navigate(target)
        else if (enabled) window.history.back()
      }}
      disabled={!enabled}
      aria-label={t.pages.back}
      className="-ml-1 inline-flex shrink-0 cursor-pointer items-center gap-1 py-1 pr-2 text-sm font-semibold text-red-500 transition-all hover:text-red-600 active:scale-95 disabled:pointer-events-none disabled:cursor-default disabled:opacity-40 dark:text-red-300 dark:hover:text-red-200"
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
      <span>{t.pages.back}</span>
    </button>
  )
}
