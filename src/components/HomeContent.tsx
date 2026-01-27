import { useLanguage } from '@/contexts/LanguageContext'
import { interpolate } from '@/utils/translations'
import { RotatingText } from '@/components/RotatingText'

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

  return (
    <div className="space-y-8 pb-8 md:space-y-12 md:pb-12">
      {/* Hero Section - Compact */}
      <section className="space-y-4 pt-4 text-center md:pt-6">
        <h1 className="bg-gradient-to-r from-primary-600 via-purple-400 to-pink-400 bg-clip-text font-bold text-4xl text-transparent md:text-6xl dark:from-primary-400 dark:via-purple-300 dark:to-pink-300">
          {t.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-lg dark:text-gray-300">
          {interpolate(t.home.subtitle, { count: totalPokemon.toLocaleString() })}
        </p>
        <div>
          <a
            href="/pokedex"
            className="inline-block rounded-xl bg-gradient-to-r from-primary-500 to-purple-400 px-6 py-3 font-semibold text-base text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-primary-600 hover:to-purple-500 hover:shadow-2xl md:px-8 md:py-4 md:text-lg dark:from-primary-400 dark:to-purple-300 dark:text-gray-900 dark:hover:from-primary-500 dark:hover:to-purple-400"
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
          <div className="rounded-lg border-2 border-primary-300/50 bg-gradient-to-br from-primary-200 to-purple-200 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary-400/60 hover:shadow-2xl md:p-4 dark:border-primary-500/30 dark:from-primary-800/80 dark:to-purple-800/80 dark:hover:border-primary-400/50">
            <div className="space-y-0.5">
              <p className="font-semibold text-primary-700 text-xs uppercase tracking-wider md:text-sm dark:text-primary-200">
                {t.home.totalPokemon}
              </p>
              <p className="font-black text-2xl text-primary-800 md:text-3xl dark:text-white">
                {totalPokemon.toLocaleString()}
              </p>
              <p className="text-primary-700 text-sm md:text-base dark:text-primary-200">{t.home.speciesDiscovered}</p>
            </div>
          </div>

          {/* Types */}
          <div className="rounded-lg border-2 border-pink-300/50 bg-gradient-to-br from-pink-200 to-rose-200 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-pink-400/60 hover:shadow-2xl md:p-4 dark:border-pink-500/30 dark:from-pink-800/80 dark:to-rose-800/80 dark:hover:border-pink-400/50">
            <div className="space-y-0.5">
              <p className="font-semibold text-pink-700 text-xs uppercase tracking-wider md:text-sm dark:text-pink-200">
                {t.home.types}
              </p>
              <p className="font-black text-2xl text-pink-800 md:text-3xl dark:text-white">{pokemonTypes.length}</p>
              <p className="text-pink-700 text-sm md:text-base dark:text-pink-200">{t.home.uniqueTypes}</p>
            </div>
          </div>

          {/* Generations */}
          <div className="rounded-lg border-2 border-teal-300/50 bg-gradient-to-br from-teal-200 to-emerald-200 p-3 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-teal-400/60 hover:shadow-2xl md:p-4 dark:border-teal-500/30 dark:from-teal-800/80 dark:to-emerald-800/80 dark:hover:border-teal-400/50">
            <div className="space-y-0.5">
              <p className="font-semibold text-teal-700 text-xs uppercase tracking-wider md:text-sm dark:text-teal-200">
                {t.home.generations}
              </p>
              <p className="font-black text-2xl text-teal-800 md:text-3xl dark:text-white">{generations.length}</p>
              <p className="text-teal-700 text-sm md:text-base dark:text-teal-200">{t.home.pokemonGenerations}</p>
            </div>
          </div>

          {/* Fun Fact Card */}
          <div className="rounded-lg border-2 border-amber-300/50 bg-gradient-to-br from-amber-200 to-orange-200 p-3 shadow-lg transition-all duration-300 hover:border-amber-400/60 hover:shadow-2xl md:p-4 dark:border-amber-500/30 dark:from-amber-800/80 dark:to-orange-800/80 dark:hover:border-amber-400/50">
            <div className="space-y-0.5">
              <p className="font-semibold text-amber-700 text-xs uppercase tracking-wider md:text-sm dark:text-amber-200">
                {t.home.didYouKnow}
              </p>
              <RotatingText
                items={t.funFacts}
                intervalMs={5000}
                className="text-sm text-amber-800 leading-tight md:text-base dark:text-amber-100"
                indicatorStyle="subtle"
              />
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
                className="group relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-2 text-center shadow-md transition-all duration-300 hover:scale-105 hover:border-primary-400 hover:from-primary-50 hover:to-purple-50 hover:shadow-xl md:p-3 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-primary-500 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30"
              >
                <span className="font-semibold text-gray-700 text-xs transition-colors group-hover:text-primary-600 md:text-sm dark:text-gray-200 dark:group-hover:text-primary-400">
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
                className="group rounded-lg border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-3 shadow-md transition-all duration-300 hover:scale-[1.02] hover:border-primary-400 hover:from-primary-50 hover:to-purple-50 hover:shadow-xl md:p-4 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900 dark:hover:border-primary-500 dark:hover:from-primary-900/30 dark:hover:to-purple-900/30"
              >
                <div className="space-y-0.5 text-center">
                  <p className="font-bold text-gray-700 text-sm transition-colors group-hover:text-primary-600 md:text-base dark:text-gray-200 dark:group-hover:text-primary-400">
                    {language === 'es' ? `Gen ${index + 1}` : `Gen ${index + 1}`}
                  </p>
                  <p className="text-gray-500 text-xs dark:text-gray-400">
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
