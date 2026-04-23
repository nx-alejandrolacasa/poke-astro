import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SettingsMenuContent } from '@/components/SettingsMenuContent'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type HeaderSettingsProps = {
  locale: Locale
  currentPath: string
}

export function HeaderSettings({ locale, currentPath: initialPath }: HeaderSettingsProps) {
  const t = translations[locale]
  const [open, setOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(initialPath)
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleAfterSwap = () => setCurrentPath(window.location.pathname)
    document.addEventListener('astro:after-swap', handleAfterSwap)
    return () => document.removeEventListener('astro:after-swap', handleAfterSwap)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const btn = buttonRef.current
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      setCoords({
        top: rect.bottom + 8,
        right: Math.max(8, window.innerWidth - rect.right),
      })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-ink-muted transition-all hover:bg-black/5 dark:text-dark-ink-muted dark:hover:bg-white/8"
        aria-label={t.settings.title}
        aria-expanded={open}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>

      {open && coords && typeof document !== 'undefined' && createPortal(
        <>
          <button
            type="button"
            aria-label={t.modal.close}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/10"
          />
          <div
            role="dialog"
            aria-label={t.settings.title}
            style={{ top: coords.top, right: coords.right }}
            className="fixed z-50 w-72 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl shadow-black/[0.12] backdrop-blur-xl dark:border-white/[0.08] dark:bg-dark-surface/90 dark:shadow-black/40"
          >
            <SettingsMenuContent locale={locale} currentPath={currentPath} onClose={() => setOpen(false)} />
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
