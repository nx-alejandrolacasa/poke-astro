import { RotatingText } from '@/components/RotatingText'
import type { Locale } from '@/utils/i18n'
import { typeColors } from '@/utils/pokemon'
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
    { name: locale === 'es' ? 'Generacion I' : 'Generation I', region: 'Kanto' },
    { name: locale === 'es' ? 'Generacion II' : 'Generation II', region: 'Johto' },
    { name: locale === 'es' ? 'Generacion III' : 'Generation III', region: 'Hoenn' },
    { name: locale === 'es' ? 'Generacion IV' : 'Generation IV', region: 'Sinnoh' },
    { name: locale === 'es' ? 'Generacion V' : 'Generation V', region: 'Unova' },
    { name: locale === 'es' ? 'Generacion VI' : 'Generation VI', region: 'Kalos' },
    { name: locale === 'es' ? 'Generacion VII' : 'Generation VII', region: 'Alola' },
    { name: locale === 'es' ? 'Generacion VIII' : 'Generation VIII', region: 'Galar' },
    { name: locale === 'es' ? 'Generacion IX' : 'Generation IX', region: 'Paldea' },
  ]

  return (
    <div className="space-y-12 pb-12 md:space-y-16 md:pb-16">
      {/* Hero Section */}
      <section className="space-y-6 pt-8 text-center md:pt-12">
        <h1 className="text-4xl font-bold tracking-tight text-ink md:text-6xl dark:text-dark-ink">
          {t.home.title}
        </h1>
        <p className="mx-auto max-w-2xl text-ink-muted text-base md:text-lg dark:text-dark-ink-muted">
          {interpolate(t.home.subtitle, { count: totalPokemon.toLocaleString(locale) })}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href={`/${locale}/pokedex`}
            className="chromatic-shadow inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-sm text-ink transition-all duration-300 hover:-translate-y-1 active:scale-95 md:px-10 md:py-4 md:text-base dark:bg-dark-surface dark:text-dark-ink"
          >
            {t.home.viewPokedex}
          </a>
          <a
            href={`/${locale}/types`}
            className="chromatic-shadow-b inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-sm text-ink transition-all duration-300 hover:-translate-y-1 active:scale-95 md:px-10 md:py-4 md:text-base dark:bg-dark-surface dark:text-dark-ink"
          >
            {t.header.typeChart} &rarr;
          </a>
        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-6">
        <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-ink-muted dark:text-dark-ink-muted">
          {t.home.byTheNumbers}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          <div className="chromatic-shadow rounded-2xl bg-white p-4 transition-all duration-300 md:p-6 dark:bg-dark-surface">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint dark:text-dark-ink-faint">{t.home.totalPokemon}</p>
            <p className="font-mono font-bold text-3xl text-ink md:text-4xl dark:text-dark-ink">{totalPokemon.toLocaleString(locale)}</p>
            <p className="text-xs text-ink-muted dark:text-dark-ink-muted">{t.home.speciesDiscovered}</p>
          </div>
          <div className="chromatic-shadow-b rounded-2xl bg-white p-4 transition-all duration-300 md:p-6 dark:bg-dark-surface">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint dark:text-dark-ink-faint">{t.home.types}</p>
            <p className="font-mono font-bold text-3xl text-ink md:text-4xl dark:text-dark-ink">{pokemonTypes.length}</p>
            <p className="text-xs text-ink-muted dark:text-dark-ink-muted">{t.home.uniqueTypes}</p>
          </div>
          <div className="chromatic-shadow-c rounded-2xl bg-white p-4 transition-all duration-300 md:p-6 dark:bg-dark-surface">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint dark:text-dark-ink-faint">{t.home.generations}</p>
            <p className="font-mono font-bold text-3xl text-ink md:text-4xl dark:text-dark-ink">{generations.length}</p>
            <p className="text-xs text-ink-muted dark:text-dark-ink-muted">{t.home.pokemonGenerations}</p>
          </div>
          <div className="chromatic-shadow rounded-2xl bg-white p-4 transition-all duration-300 md:p-6 dark:bg-dark-surface">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint dark:text-dark-ink-faint">{t.home.didYouKnow}</p>
            <RotatingText items={t.funFacts} intervalMs={5000} className="text-sm text-ink leading-relaxed dark:text-dark-ink" indicatorStyle="subtle" />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="space-y-8">
        <h2 className="text-center text-lg font-bold text-ink md:text-xl dark:text-dark-ink">{t.home.browseByCategory}</h2>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-dark-ink-muted">{t.home.pokemonTypes}</h3>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-9">
            {pokemonTypes.map((type) => {
              const color = typeColors[type] ?? '#a8a878'
              return (
                <a
                  key={type}
                  href={`/${locale}/type/${type}`}
                  className="chromatic-shadow-sm group rounded-xl p-2.5 text-center transition-all duration-300 md:p-3"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  <span className="font-semibold text-xs md:text-sm">{t.types[type as keyof typeof t.types]}</span>
                </a>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-dark-ink-muted">{t.home.byGeneration}</h3>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-9">
            {generations.map((gen, index) => (
              <a
                key={index}
                href={`/${locale}/generation/${index + 1}`}
                className="chromatic-shadow-sm group rounded-xl bg-white p-3 text-center transition-all duration-300 md:p-4 dark:bg-dark-surface"
              >
                <p className="font-bold text-sm text-ink transition-colors group-hover:text-primary md:text-base dark:text-dark-ink dark:group-hover:text-primary">{locale === 'es' ? 'Gen' : 'Gen'} {index + 1}</p>
                <p className="text-xs text-ink-muted dark:text-dark-ink-muted">{gen.region}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
