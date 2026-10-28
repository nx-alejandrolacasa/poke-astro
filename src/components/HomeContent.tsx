import { Carousel } from '@/components/Carousel'
import { GENERATIONS } from '@/utils/generations'
import type { Locale } from '@/utils/i18n'
import {
  officialArtworkUrl,
  optimizedImageUrl,
  POKEMON_TYPES,
  typeColors,
  typeRepresentativePokemon,
} from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type HomeContentProps = {
  locale: Locale
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff'
}

const PLAY_LINKS = [
  { path: 'quiz', key: 'quiz', mascot: 25, color: '#f4d67b' },
  { path: 'compare', key: 'compare', mascot: 150, color: '#997a96' },
  { path: 'team', key: 'team', mascot: 448, color: '#6896a8' },
] as const

export function HomeContent({ locale }: HomeContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-8 pb-8 md:space-y-12 md:pb-12">
      {/* Hero */}
      <section className="pt-6 text-center md:pt-10">
        <img
          src="/pokemon-logo.svg"
          alt="Pokemon"
          className="mx-auto mb-5 h-9 w-auto md:h-12 lg:h-14"
        />
        <h1 className="pokemon-title text-3xl md:text-5xl lg:text-6xl">
          {t.home.title}
        </h1>
      </section>

      {/* Fun Facts carousel */}
      <section className="mx-auto max-w-2xl">
        <div className="rounded-2xl border-2 border-primary/20 bg-primary-50 p-6 text-center dark:border-primary/10 dark:bg-dark-raised">
          <Carousel
            items={t.funFacts}
            label={t.home.didYouKnow}
            autoPlayMs={10000}
          />
        </div>
      </section>

      {/* Play */}
      <section className="space-y-4">
        <h2 className="text-center text-xl font-bold text-ink md:text-2xl dark:text-dark-ink">
          {t.play.title}
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {PLAY_LINKS.map((link) => (
            <a
              key={link.path}
              href={`/${locale}/${link.path}`}
              className="flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 md:p-3"
              style={{
                backgroundColor: `${link.color}15`,
                border: `2px solid ${link.color}`,
              }}
            >
              <img
                src={optimizedImageUrl(officialArtworkUrl(link.mascot), 56)}
                alt=""
                className="h-12 w-12 object-contain md:h-14 md:w-14"
                loading="lazy"
              />
              <span className="text-xs font-semibold text-ink md:text-sm dark:text-dark-ink">
                {t.play[link.key]}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Browse by Generation */}
      <section className="space-y-4">
        <h2 className="text-center text-xl font-bold text-ink md:text-2xl dark:text-dark-ink">
          {t.home.byGeneration}
        </h2>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-9">
          {GENERATIONS.map((gen) => {
            const color = typeColors[gen.type] ?? '#a8a878'
            return (
              <a
                key={gen.region}
                href={`/${locale}/generation/${gen.id}`}
                className="group flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 md:p-3"
                style={{
                  backgroundColor: `${color}15`,
                  border: `2px solid ${color}`,
                }}
              >
                <img
                  src={optimizedImageUrl(officialArtworkUrl(gen.mascot), 56)}
                  alt={gen.region}
                  className="h-12 w-12 object-contain md:h-14 md:w-14"
                  loading="lazy"
                />
                <span
                  className="w-full rounded-lg py-0.5 text-center text-xs font-semibold"
                  style={{
                    backgroundColor: color,
                    color: getContrastColor(color),
                  }}
                >
                  {gen.region}
                </span>
              </a>
            )
          })}
        </div>
      </section>

      {/* Browse by Type */}
      <section className="space-y-4">
        <h2 className="text-center text-xl font-bold text-ink md:text-2xl dark:text-dark-ink">
          {t.home.pokemonTypes}
        </h2>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6 lg:grid-cols-9">
          {POKEMON_TYPES.map((type) => {
            const color = typeColors[type] ?? '#a8a878'
            const pokeId = typeRepresentativePokemon[type]
            return (
              <a
                key={type}
                href={`/${locale}/type/${type}`}
                className="group flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                style={{
                  backgroundColor: `${color}15`,
                  border: `2px solid ${color}`,
                }}
              >
                <img
                  src={optimizedImageUrl(officialArtworkUrl(pokeId), 56)}
                  alt={type}
                  className="h-12 w-12 object-contain md:h-14 md:w-14"
                  loading="lazy"
                />
                <span
                  className="w-full rounded-lg py-0.5 text-center text-xs font-semibold capitalize"
                  style={{
                    backgroundColor: color,
                    color: getContrastColor(color),
                  }}
                >
                  {t.types[type as keyof typeof t.types]}
                </span>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
