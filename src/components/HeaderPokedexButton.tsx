import { useLanguage } from '@/contexts/LanguageContext'

export function HeaderPokedexButton() {
  const { t } = useLanguage()

  return (
    <a
      className="rounded-xl bg-gradient-to-r from-[#3466AF] to-purple-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#2855a0] hover:to-purple-700 hover:shadow-2xl hover:scale-105 active:scale-95 sm:px-5 sm:py-2.5"
      href="/pokedex"
    >
      {t.header.pokedex}
    </a>
  )
}
