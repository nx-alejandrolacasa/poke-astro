import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { getPokemonName } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type BottomTabNavProps = {
  locale: Locale
  currentPath: string
}

export function BottomTabNav({ locale, currentPath }: BottomTabNavProps) {
  const t = translations[locale]
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [allNames, setAllNames] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/pokemon/names')
      .then((res) => res.json())
      .then((data) => {
        setAllNames(data.names)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([])
      setSelectedIndex(-1)
      return
    }
    const filtered = allNames
      .filter((name) => name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 6)
    setSuggestions(filtered)
    setSelectedIndex(-1)
  }, [query, allNames])

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (searchOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSearchOpen(false)
          setQuery('')
        }
      }
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [searchOpen])

  const navigateTo = (name: string) => {
    window.location.href = `/${locale}/pokemon/${name}`
    setSearchOpen(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        navigateTo(suggestions[selectedIndex])
      } else if (suggestions.length > 0) {
        navigateTo(suggestions[0])
      }
    }
  }

  const tabs = [
    {
      label: t.header.home,
      href: `/${locale}`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      match: (path: string) => path === `/${locale}` || path === `/${locale}/`,
    },
    {
      label: t.header.pokedex,
      href: `/${locale}/pokedex`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="8.5" y2="12" />
          <line x1="15.5" y1="12" x2="22" y2="12" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      ),
      match: (path: string) =>
        path.startsWith(`/${locale}/pokedex`)
        || path.startsWith(`/${locale}/pokemon/`)
        || path.startsWith(`/${locale}/type/`)
        || path.startsWith(`/${locale}/generation/`),
    },
    {
      label: t.header.typeChart,
      href: `/${locale}/types`,
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
        </svg>
      ),
      match: (path: string) => path.startsWith(`/${locale}/types`),
    },
  ]

  return (
    <>
      {/* Search overlay — full viewport. Input + close button pinned at the
          top; only the suggestions list scrolls. Covers the bottom nav while
          open, with a dedicated close (X) since the nav is hidden behind the
          on-screen keyboard anyway. */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-xl transition-opacity duration-200 lg:hidden dark:bg-dark-surface/95 ${
          searchOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!searchOpen}
      >
        {/* Input + close — pinned at top */}
        <div className="flex-shrink-0 border-black/[0.06] border-b p-3 dark:border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isLoading ? t.search.loading : t.search.placeholder}
                disabled={isLoading}
                className="w-full rounded-full border border-black/[0.06] bg-surface-sunken px-4 py-3 pr-10 text-ink text-base placeholder-ink-faint transition-all focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 disabled:opacity-50 dark:border-white/[0.06] dark:bg-dark-raised dark:text-dark-ink dark:placeholder-dark-ink-faint"
                role="combobox"
                aria-label="Search Pokemon"
                aria-autocomplete="list"
                aria-expanded={suggestions.length > 0}
              />
              <svg
                className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-ink-faint dark:text-dark-ink-faint"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="button"
              onClick={() => { setSearchOpen(false); setQuery('') }}
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink dark:text-dark-ink-muted dark:hover:bg-dark-raised dark:hover:text-dark-ink"
              aria-label={t.modal.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable results */}
        <div className="flex-1 overflow-y-auto p-2" role="listbox">
          {suggestions.length > 0
            ? suggestions.map((name, index) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => navigateTo(name)}
                  className={`block w-full rounded-xl px-4 py-3 text-left text-base transition-colors ${
                    index === selectedIndex
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary/10 dark:text-primary'
                      : 'text-ink hover:bg-surface-sunken dark:text-dark-ink dark:hover:bg-dark-raised'
                  }`}
                  role="option"
                  aria-selected={index === selectedIndex}
                >
                  <span className="font-medium">{getPokemonName(name)}</span>
                  <span className="ml-2 text-xs opacity-40">#{name}</span>
                </button>
              ))
            : query && !isLoading
              ? (
                  <p className="px-4 py-3 text-ink-muted text-sm dark:text-dark-ink-muted">
                    {t.search.noResults}
                  </p>
                )
              : (
                  <p className="px-4 py-6 text-center text-ink-faint text-sm dark:text-dark-ink-faint">
                    {locale === 'es' ? 'Escribe para buscar...' : 'Type to search...'}
                  </p>
                )
          }
        </div>
      </div>

      {/* Tab bar — floating pill + standalone search circle, iOS 26 style */}
      <nav className="fixed bottom-3 left-0 right-0 z-40 flex items-center gap-2 px-3 sm:px-4 lg:hidden" aria-label="Main navigation">
        <div className="flex h-14 flex-1 items-center justify-between gap-1 rounded-full border border-white/60 bg-white/70 px-2.5 shadow-lg shadow-black/[0.08] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-dark-surface/70 dark:shadow-black/30">
          {tabs.map((tab) => {
            const isActive = tab.match(currentPath)
            return (
              <a
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 transition-all ${
                  isActive
                    ? 'bg-primary/12 text-primary dark:bg-dark-primary/15 dark:text-dark-primary'
                    : 'text-ink-muted active:scale-95 dark:text-dark-ink-muted'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon}
                {isActive && <span className="text-xs font-semibold">{tab.label}</span>}
              </a>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() => { setSearchOpen((prev) => !prev); if (searchOpen) setQuery('') }}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/70 text-ink-muted shadow-lg shadow-black/[0.08] backdrop-blur-2xl transition-transform active:scale-95 dark:border-white/[0.08] dark:bg-dark-surface/70 dark:text-dark-ink-muted dark:shadow-black/30"
          aria-label={t.header.search}
          aria-expanded={searchOpen}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </nav>
    </>
  )
}
