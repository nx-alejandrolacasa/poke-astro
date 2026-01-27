import { useLanguage } from '@/contexts/LanguageContext'

export function HeaderPokedexButton() {
  const { t } = useLanguage()

  return (
    <a
      className="rounded-xl bg-gradient-to-r from-primary-500 to-purple-400 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:from-primary-600 hover:to-purple-500 hover:shadow-2xl hover:scale-105 active:scale-95 dark:from-primary-400 dark:to-purple-300 dark:text-gray-900 dark:hover:from-primary-500 dark:hover:to-purple-400"
      href="/pokedex"
    >
      {t.header.pokedex}
    </a>
  )
}
