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
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get language from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (stored === 'en' || stored === 'es') {
        return stored
      }
      // Try to detect browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('es')) {
        return 'es'
      }
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
    }
  }

  useEffect(() => {
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language
    }
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
