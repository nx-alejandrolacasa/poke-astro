import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import { PokemonSearch } from '@/components/PokemonSearch'
import { LanguageSelector } from '@/components/LanguageSelector'
import { DarkModeToggle } from '@/components/DarkModeToggle'

type MobileMenuDrawerProps = {
  locale: Locale
}

export function MobileMenuDrawer({ locale }: MobileMenuDrawerProps) {
  const t = translations[locale]
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const drawerContent = (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`drawer-panel fixed inset-y-0 right-0 z-[100] flex w-80 max-w-[85vw] transform flex-col shadow-2xl transition-transform duration-300 ease-in-out sm:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={t.header.menu}
      >
        <div className="themed-border-b flex shrink-0 items-center justify-between p-4">
          <span className="font-heading text-lg font-bold">{t.header.menu}</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="themed-text-secondary rounded-xl p-2 transition-colors"
            aria-label={t.header.close}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 p-4">
          <div>
            <label className="themed-text-secondary mb-2 block font-heading text-sm font-bold">{t.search.placeholder}</label>
            <PokemonSearch locale={locale} />
          </div>

          <a
            className="btn-pokeball flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-heading font-bold text-white shadow-soft transition-all duration-300 active:translate-y-0.5"
            href={`/${locale}/pokedex`}
            onClick={() => setIsOpen(false)}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {t.header.pokedex}
          </a>

          <div className="glass-card flex items-center justify-between rounded-2xl p-3">
            <LanguageSelector locale={locale} />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="themed-text-secondary rounded-xl p-2 transition-colors sm:hidden"
        aria-label={t.header.menu}
        aria-expanded={isOpen}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {mounted && createPortal(drawerContent, document.body)}
    </>
  )
}
