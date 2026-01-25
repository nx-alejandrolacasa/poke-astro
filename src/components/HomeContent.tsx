import { useLanguage } from '@/contexts/LanguageContext'
import { interpolate } from '@/utils/translations'

type HomeContentProps = {
  totalPokemon: number
}

export function HomeContent({ totalPokemon }: HomeContentProps) {
  const { t, language } = useLanguage()

  const pokemonTypes = [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ]

  const generations = [
    { name: language === 'es' ? 'Generación I' : 'Generation I', region: 'Kanto' },
    { name: language === 'es' ? 'Generación II' : 'Generation II', region: 'Johto' },
    { name: language === 'es' ? 'Generación III' : 'Generation III', region: 'Hoenn' },
    { name: language === 'es' ? 'Generación IV' : 'Generation IV', region: 'Sinnoh' },
    { name: language === 'es' ? 'Generación V' : 'Generation V', region: 'Unova' },
    { name: language === 'es' ? 'Generación VI' : 'Generation VI', region: 'Kalos' },
    { name: language === 'es' ? 'Generación VII' : 'Generation VII', region: 'Alola' },
    { name: language === 'es' ? 'Generación VIII' : 'Generation VIII', region: 'Galar' },
    { name: language === 'es' ? 'Generación IX' : 'Generation IX', region: 'Paldea' },
  ]

  const randomFact = t.funFacts[Math.floor(Math.random() * t.funFacts.length)]

  return (
    <div className="space-y-8 pb-8 md:space-y-12 md:pb-12">
      {/* Hero Section - Compact */}
      <section className="space-y-4 pt-4 text-center md:pt-6">
        <h1 className="bg-gradient-to-r from-[#3466AF] via-purple-500 to-pink-500 bg-clip-text font-bold text-4xl text-transparent md:text-6xl">
          {t.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg dark:text-gray-300">
          {interpolate(t.home.subtitle, { count: totalPokemon.toLocaleString() })}
        </p>
        <div>
          <a
            href="/pokedex"
            className="inline-block rounded-xl bg-gradient-to-r from-[#3466AF] to-purple-600 px-6 py-3 font-semibold text-base text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-[#2855a0] hover:to-purple-700 hover:shadow-2xl md:px-8 md:py-4 md:text-lg"
          >
            {t.home.viewPokedex}
          </a>
        </div>
      </section>

      {/* Bento Grid Statistics - All in one row on landscape tablets */}
      <section className="space-y-3">
        <h2 className="text-center font-bold text-xl text-gray-900 md:text-2xl dark:text-white">
          {t.home.byTheNumbers}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
          {/* Total Pokemon */}
          <div className="rounded-lg border-2 border-[#3466AF]/30 bg-gradient-to-br from-[#3466AF] to-purple-600 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-[#3466AF]/60 hover:shadow-2xl md:p-4 dark:border-[#3466AF]/50 dark:hover:border-[#3466AF]/80">
            <div className="space-y-0.5">
              <p className="font-semibold text-white/90 text-[10px] uppercase tracking-wider md:text-xs">
                {t.home.totalPokemon}
              </p>
              <p className="font-black text-2xl text-white md:text-3xl">
                {totalPokemon.toLocaleString()}
              </p>
              <p className="text-white/90 text-[10px] md:text-xs">{t.home.speciesDiscovered}</p>
            </div>
          </div>

          {/* Types */}
          <div className="rounded-lg border-2 border-pink-400/30 bg-gradient-to-br from-pink-500 to-red-600 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-pink-400/60 hover:shadow-2xl md:p-4 dark:border-pink-400/50 dark:hover:border-pink-400/80">
            <div className="space-y-0.5">
              <p className="font-semibold text-white/90 text-[10px] uppercase tracking-wider md:text-xs">
                {t.home.types}
              </p>
              <p className="font-black text-2xl text-white md:text-3xl">{pokemonTypes.length}</p>
              <p className="text-white/90 text-[10px] md:text-xs">{t.home.uniqueTypes}</p>
            </div>
          </div>

          {/* Generations */}
          <div className="rounded-lg border-2 border-green-400/30 bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-green-400/60 hover:shadow-2xl md:p-4 dark:border-green-400/50 dark:hover:border-green-400/80">
            <div className="space-y-0.5">
              <p className="font-semibold text-white/90 text-[10px] uppercase tracking-wider md:text-xs">
                {t.home.generations}
              </p>
              <p className="font-black text-2xl text-white md:text-3xl">{generations.length}</p>
              <p className="text-white/90 text-[10px] md:text-xs">{t.home.pokemonGenerations}</p>
            </div>
          </div>

          {/* Fun Fact Card */}
          <div className="rounded-lg border-2 border-yellow-400/30 bg-gradient-to-br from-yellow-500 to-orange-600 p-3 shadow-lg transition-all duration-300 hover:border-yellow-400/60 hover:shadow-2xl md:p-4 dark:border-yellow-400/50 dark:hover:border-yellow-400/80">
            <div className="space-y-0.5">
              <p className="font-semibold text-white/90 text-[10px] uppercase tracking-wider md:text-xs">
                {t.home.didYouKnow}
              </p>
              <p className="text-[10px] text-white leading-tight md:text-xs">{randomFact}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Categories - Compact */}
      <section className="space-y-4">
        <h2 className="text-center font-bold text-2xl text-gray-900 md:text-3xl dark:text-white">
          {t.home.browseByCategory}
        </h2>

        {/* Types Grid - More columns on tablets */}
        <div>
          <h3 className="mb-3 font-semibold text-lg text-gray-900 md:text-xl dark:text-white">
            {t.home.pokemonTypes}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
            {pokemonTypes.map((type) => (
              <a
                key={type}
                href={`/type/${type}`}
                className="group relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-2 text-center shadow-md transition-all duration-300 hover:scale-105 hover:border-[#3466AF] hover:from-gray-200 hover:to-gray-300 hover:shadow-xl md:p-3 dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:hover:border-[#3466AF] dark:hover:from-gray-600 dark:hover:to-gray-700"
              >
                <span className="font-semibold text-gray-900 text-xs transition-colors group-hover:text-[#3466AF] md:text-sm dark:text-white dark:group-hover:text-[#3466AF]">
                  {t.types[type as keyof typeof t.types]}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Generations Grid - More compact */}
        <div>
          <h3 className="mb-3 font-semibold text-lg text-gray-900 md:text-xl dark:text-white">
            {t.home.byGeneration}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {generations.map((gen, index) => (
              <a
                key={index}
                href={`/generation/${index + 1}`}
                className="group rounded-lg border-2 border-gray-300 bg-gradient-to-br from-gray-100 to-gray-200 p-3 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-[#3466AF] hover:from-gray-200 hover:to-gray-300 hover:shadow-xl md:p-4 dark:border-gray-600 dark:from-gray-700 dark:to-gray-800 dark:hover:border-[#3466AF] dark:hover:from-gray-600 dark:hover:to-gray-700"
              >
                <div className="space-y-0.5 text-center">
                  <p className="font-bold text-gray-900 text-sm transition-colors group-hover:text-[#3466AF] md:text-base dark:text-white dark:group-hover:text-[#3466AF]">
                    {language === 'es' ? `Gen ${index + 1}` : `Gen ${index + 1}`}
                  </p>
                  <p className="text-gray-600 text-xs dark:text-gray-300">
                    {gen.region}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
