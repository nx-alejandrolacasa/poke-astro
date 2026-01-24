import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Language, Translations } from '@/utils/translations'
import { translations } from '@/utils/translations'

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

// Default context value for SSR
const defaultContextValue: LanguageContextType = {
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
}

const LanguageContext = createContext<LanguageContextType>(defaultContextValue)

const LANGUAGE_STORAGE_KEY = 'pokemon-language'

type LanguageProviderProps = {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Always start with 'en' for SSR consistency
  const [language, setLanguageState] = useState<Language>('en')

  // Load stored language preference on client after hydration
  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (stored === 'en' || stored === 'es') {
      setLanguageState(stored)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('es')) {
        setLanguageState('es')
      }
    }

    // Listen for language changes from other React islands
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LANGUAGE_STORAGE_KEY && (e.newValue === 'en' || e.newValue === 'es')) {
        setLanguageState(e.newValue)
      }
    }

    // Listen for custom language change event (for same-window updates)
    const handleLanguageChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>
      if (customEvent.detail === 'en' || customEvent.detail === 'es') {
        setLanguageState(customEvent.detail)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('language-change', handleLanguageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('language-change', handleLanguageChange)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    // Dispatch custom event to sync across React islands
    window.dispatchEvent(new CustomEvent('language-change', { detail: lang }))
  }

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language
  }, [language])

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  return context
}
