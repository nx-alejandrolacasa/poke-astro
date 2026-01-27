import type { Language, Translations } from './translations'
import { translations } from './translations'

export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'es'

/**
 * Validates and returns a locale, defaulting to 'es' if invalid
 */
export function getLocale(locale: string | undefined): Locale {
  if (locale === 'en' || locale === 'es') {
    return locale
  }
  return defaultLocale
}

/**
 * Gets the translations object for a given locale
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale as Language]
}

/**
 * Helper to get both locale and translations from a URL param
 */
export function getI18n(localeParam: string | undefined) {
  const locale = getLocale(localeParam)
  const t = getTranslations(locale)
  return { locale, t }
}

/**
 * Builds a localized URL path
 */
export function localizeUrl(path: string, locale: Locale): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  // Remove existing locale prefix if present
  const pathWithoutLocale = cleanPath.replace(/^(en|es)\//, '').replace(/^(en|es)$/, '')
  // Build new path with locale
  return `/${locale}${pathWithoutLocale ? `/${pathWithoutLocale}` : ''}`
}

/**
 * Gets the alternate locale (for language switcher)
 */
export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en'
}

/**
 * Gets all locale paths for getStaticPaths
 */
export function getLocalePaths() {
  return locales.map((locale) => ({ params: { locale } }))
}
