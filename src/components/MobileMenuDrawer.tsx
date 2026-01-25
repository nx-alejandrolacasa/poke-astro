import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { PokemonSearch } from '@/components/PokemonSearch'
import { LanguageSelector } from '@/components/LanguageSelector'
import { DarkModeToggle } from '@/components/DarkModeToggle'

export function MobileMenuDrawer() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  // Close drawer on escape key
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

  return (
    <>
      {/* Hamburger button - visible on mobile only */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 sm:hidden dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label={t.header.menu}
        aria-expanded={isOpen}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:hidden dark:bg-gray-900 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.header.menu}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          <span className="font-semibold text-gray-900 text-lg dark:text-gray-100">
            {t.header.menu}
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label={t.header.close}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Drawer content */}
        <div className="flex flex-col gap-6 p-4">
          {/* Search */}
          <div>
            <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
              {t.search.placeholder}
            </label>
            <PokemonSearch />
          </div>

          {/* Pokédex button - full version */}
          <a
            className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#3466AF] to-purple-600 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#2855a0] hover:to-purple-700 hover:shadow-2xl active:scale-95"
            href="/pokedex"
            onClick={() => setIsOpen(false)}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {t.header.pokedex}
          </a>

          {/* Settings row */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <LanguageSelector />
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </>
  )
}
