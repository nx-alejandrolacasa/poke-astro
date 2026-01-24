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
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
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
