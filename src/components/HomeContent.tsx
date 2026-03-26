import { RotatingText } from '@/components/RotatingText'
import type { Locale } from '@/utils/i18n'
import { interpolate, translations } from '@/utils/translations'

type HomeContentProps = {
  totalPokemon: number
  locale: Locale
}

export function HomeContent({ totalPokemon, locale }: HomeContentProps) {
  const t = translations[locale]

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
  ]

  const generations = [
    { name: locale === 'es' ? 'Generación I' : 'Generation I', region: 'Kanto' },
    { name: locale === 'es' ? 'Generación II' : 'Generation II', region: 'Johto' },
    { name: locale === 'es' ? 'Generación III' : 'Generation III', region: 'Hoenn' },
    { name: locale === 'es' ? 'Generación IV' : 'Generation IV', region: 'Sinnoh' },
    { name: locale === 'es' ? 'Generación V' : 'Generation V', region: 'Unova' },
    { name: locale === 'es' ? 'Generación VI' : 'Generation VI', region: 'Kalos' },
    { name: locale === 'es' ? 'Generación VII' : 'Generation VII', region: 'Alola' },
    { name: locale === 'es' ? 'Generación VIII' : 'Generation VIII', region: 'Galar' },
    { name: locale === 'es' ? 'Generación IX' : 'Generation IX', region: 'Paldea' },
  ]

  return (
    <div className="space-y-8 pb-8 md:space-y-12 md:pb-12">
      {/* Hero Section */}
      <section className="space-y-4 pt-4 text-center md:pt-6">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-gray-900 md:text-5xl dark:bg-gradient-to-r dark:from-neon-blue dark:via-neon-cyan dark:to-neon-purple dark:bg-clip-text dark:text-transparent">
          {t.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-sm md:text-base dark:text-gray-400">
          {interpolate(t.home.subtitle, { count: totalPokemon.toLocaleString(locale) })}
        </p>
        <div>
          <a
            href={`/${locale}/pokedex`}
            className="inline-block rounded-lg border-2 border-primary-500 bg-primary-50 px-6 py-3 font-display text-xs font-bold uppercase tracking-wider text-primary-600 transition-all duration-300 hover:bg-primary-100 hover:shadow-lg md:px-8 md:py-4 md:text-sm dark:border-neon-blue dark:bg-neon-blue/10 dark:text-neon-cyan dark:hover:bg-neon-blue/20 dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.25)]"
          >
            {t.home.viewPokedex}
          </a>
        </div>
      </section>

      {/* Statistics Bento Grid */}
      <section className="space-y-3">
        <h2 className="text-center font-display text-xs font-bold uppercase tracking-widest text-gray-700 md:text-sm dark:text-neon-blue/70">
          {t.home.byTheNumbers}
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:gap-3">
          <div className="hud-corners rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] md:p-4 dark:border-dex-border dark:bg-dex-surface">
            <div className="space-y-0.5">
              <p className="font-display text-[9px] font-bold uppercase tracking-widest text-gray-500 md:text-[10px] dark:text-neon-blue/60">{t.home.totalPokemon}</p>
              <p className="font-mono font-black text-2xl text-gray-900 md:text-3xl dark:text-neon-cyan">{totalPokemon.toLocaleString(locale)}</p>
              <p className="text-gray-500 text-xs md:text-sm dark:text-gray-500">{t.home.speciesDiscovered}</p>
            </div>
          </div>
          <div className="hud-corners rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] md:p-4 dark:border-dex-border dark:bg-dex-surface">
            <div className="space-y-0.5">
              <p className="font-display text-[9px] font-bold uppercase tracking-widest text-gray-500 md:text-[10px] dark:text-neon-amber/60">{t.home.types}</p>
              <p className="font-mono font-black text-2xl text-gray-900 md:text-3xl dark:text-neon-amber">{pokemonTypes.length}</p>
              <p className="text-gray-500 text-xs md:text-sm dark:text-gray-500">{t.home.uniqueTypes}</p>
            </div>
          </div>
          <div className="hud-corners rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] md:p-4 dark:border-dex-border dark:bg-dex-surface">
            <div className="space-y-0.5">
              <p className="font-display text-[9px] font-bold uppercase tracking-widest text-gray-500 md:text-[10px] dark:text-neon-green/60">{t.home.generations}</p>
              <p className="font-mono font-black text-2xl text-gray-900 md:text-3xl dark:text-neon-green">{generations.length}</p>
              <p className="text-gray-500 text-xs md:text-sm dark:text-gray-500">{t.home.pokemonGenerations}</p>
            </div>
          </div>
          <div className="hud-corners rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-300 hover:shadow-lg md:p-4 dark:border-dex-border dark:bg-dex-surface">
            <div className="space-y-0.5">
              <p className="font-display text-[9px] font-bold uppercase tracking-widest text-gray-500 md:text-[10px] dark:text-neon-purple/60">{t.home.didYouKnow}</p>
              <RotatingText items={t.funFacts} intervalMs={5000} className="text-xs text-gray-700 leading-tight md:text-sm dark:text-gray-300" indicatorStyle="subtle" />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="space-y-4">
        <h2 className="text-center font-display text-sm font-bold uppercase tracking-widest text-gray-800 md:text-base dark:text-gray-200">{t.home.browseByCategory}</h2>
        <div>
          <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-gray-600 md:text-sm dark:text-neon-blue/50">{t.home.pokemonTypes}</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:grid-cols-9">
            {pokemonTypes.map((type) => (
              <a key={type} href={`/${locale}/type/${type}`} className="group rounded-lg border border-gray-200 bg-white p-2 text-center shadow-sm transition-all duration-200 hover:border-primary-400 hover:shadow-md hover:scale-105 md:p-3 dark:border-dex-border dark:bg-dex-surface dark:hover:border-neon-blue/50 dark:hover:shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <span className="font-semibold text-gray-700 text-xs transition-colors group-hover:text-primary-600 md:text-sm dark:font-mono dark:text-gray-400 dark:group-hover:text-neon-cyan">{t.types[type as keyof typeof t.types]}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-gray-600 md:text-sm dark:text-neon-blue/50">{t.home.byGeneration}</h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9">
            {generations.map((gen, index) => (
              <a key={index} href={`/${locale}/generation/${index + 1}`} className="group rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-primary-400 hover:shadow-md hover:scale-[1.02] md:p-4 dark:border-dex-border dark:bg-dex-surface dark:hover:border-neon-blue/50 dark:hover:shadow-[0_0_10px_rgba(59,130,246,0.1)]">
                <div className="space-y-0.5 text-center">
                  <p className="font-mono font-bold text-gray-700 text-sm transition-colors group-hover:text-primary-600 md:text-base dark:text-gray-300 dark:group-hover:text-neon-cyan">Gen {index + 1}</p>
                  <p className="text-gray-500 text-xs dark:text-gray-500">{gen.region}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
