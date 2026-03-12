import type { Locale } from '@/utils/i18n'
import { translations, interpolate } from '@/utils/translations'
import { RotatingText } from '@/components/RotatingText'
import { ptypeClass, genCardClass } from '@/utils/typeColors'

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
    <div className="space-y-10 pb-8 md:space-y-14 md:pb-12">
      {/* Hero Section */}
      <section className="home-hero relative overflow-hidden rounded-4xl px-6 py-10 text-center md:px-12 md:py-16">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full border-[24px] border-current opacity-[0.06]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full border-[20px] border-current opacity-[0.04]" />

        <h1 className="font-heading text-4xl font-bold tracking-tight text-[#2D1B0E] md:text-6xl lg:text-7xl">
          {t.home.title}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-[#6B5744] md:text-lg">
          {interpolate(t.home.subtitle, { count: totalPokemon.toLocaleString(locale) })}
        </p>
        <div className="mt-6">
          <a
            href={`/${locale}/pokedex`}
            className="btn-rainbow inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-heading text-lg font-bold text-white shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-xl md:px-10 md:py-5 md:text-xl"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {t.home.viewPokedex}
          </a>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="space-y-4">
        <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
          {t.home.byTheNumbers}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {/* Total Pokemon */}
          <div className={`${ptypeClass('water')} glass-card overflow-hidden rounded-3xl p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md md:p-5`}>
            <div className="space-y-1">
              <p className="pt-text font-heading text-xs font-bold uppercase tracking-wider md:text-sm">{t.home.totalPokemon}</p>
              <p className="pt-accent-text font-heading text-3xl font-bold md:text-4xl">{totalPokemon.toLocaleString(locale)}</p>
              <p className="pt-text text-sm">{t.home.speciesDiscovered}</p>
            </div>
          </div>

          {/* Types */}
          <div className={`${ptypeClass('fire')} glass-card overflow-hidden rounded-3xl p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md md:p-5`}>
            <div className="space-y-1">
              <p className="pt-text font-heading text-xs font-bold uppercase tracking-wider md:text-sm">{t.home.types}</p>
              <p className="pt-accent-text font-heading text-3xl font-bold md:text-4xl">{pokemonTypes.length}</p>
              <p className="pt-text text-sm">{t.home.uniqueTypes}</p>
            </div>
          </div>

          {/* Generations */}
          <div className={`${ptypeClass('grass')} glass-card overflow-hidden rounded-3xl p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md md:p-5`}>
            <div className="space-y-1">
              <p className="pt-text font-heading text-xs font-bold uppercase tracking-wider md:text-sm">{t.home.generations}</p>
              <p className="pt-accent-text font-heading text-3xl font-bold md:text-4xl">{generations.length}</p>
              <p className="pt-text text-sm">{t.home.pokemonGenerations}</p>
            </div>
          </div>

          {/* Fun Fact */}
          <div className={`${ptypeClass('electric')} glass-card overflow-hidden rounded-3xl p-4 shadow-soft transition-all duration-300 hover:shadow-soft-md md:p-5`}>
            <div className="space-y-1">
              <p className="pt-text font-heading text-xs font-bold uppercase tracking-wider md:text-sm">{t.home.didYouKnow}</p>
              <RotatingText
                items={t.funFacts}
                intervalMs={5000}
                className="text-sm leading-snug md:text-base"
                indicatorStyle="subtle"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="space-y-4">
        <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
          {t.home.pokemonTypes}
        </h2>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 md:gap-3 lg:grid-cols-9">
          {pokemonTypes.map((type) => (
            <a
              key={type}
              href={`/${locale}/type/${type}`}
              className={`${ptypeClass(type)} type-btn group relative overflow-hidden rounded-2xl p-3 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md md:p-4`}
            >
              <div className="pt-dot mx-auto mb-1.5 h-3 w-3 rounded-full md:h-4 md:w-4" />
              <span className="pt-text block font-heading text-xs font-bold md:text-sm">
                {t.types[type as keyof typeof t.types]}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Browse by Generation */}
      <section className="space-y-4">
        <h2 className="text-center font-heading text-2xl font-bold md:text-3xl">
          {t.home.byGeneration}
        </h2>
        <div className="grid grid-cols-3 gap-2 md:gap-3 lg:grid-cols-5 xl:grid-cols-9">
          {generations.map((gen, index) => (
            <a
              key={index}
              href={`/${locale}/generation/${index + 1}`}
              className={`${genCardClass(index + 1)} group overflow-hidden rounded-2xl p-4 text-center shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md md:p-5`}
            >
              <p className="font-heading text-lg font-bold text-[#2D1B0E] md:text-xl">
                {index + 1}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#6B5744]">
                {gen.region}
              </p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
