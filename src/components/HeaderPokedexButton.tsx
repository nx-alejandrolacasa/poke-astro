import { useLanguage } from '@/contexts/LanguageContext'

export function HeaderPokedexButton() {
  const { t } = useLanguage()

  return (
    <>
      {/* Desktop version - with text */}
      <a
        className="hidden rounded-xl bg-gradient-to-r from-[#3466AF] to-purple-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#2855a0] hover:to-purple-700 hover:shadow-2xl hover:scale-105 active:scale-95 sm:inline-block"
        href="/pokedex"
      >
        {t.header.pokedex}
      </a>
      {/* Mobile version - Pokéball icon only */}
      <a
        className="flex items-center justify-center rounded-full bg-gradient-to-r from-[#3466AF] to-purple-600 p-2.5 shadow-lg transition-all duration-300 hover:from-[#2855a0] hover:to-purple-700 hover:shadow-2xl hover:scale-105 active:scale-95 sm:hidden"
        href="/pokedex"
        aria-label={t.header.pokedex}
        title={t.header.pokedex}
      >
        <svg
          className="h-5 w-5 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </a>
    </>
  )
}
