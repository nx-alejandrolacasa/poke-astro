import { Carousel } from '@/components/Carousel'
import type { Locale } from '@/utils/i18n'
import { typeColors } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type HomeContentProps = {
  totalPokemon: number
  locale: Locale
}

function getContrastColor(hex: string): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff'
}

const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const

const GENERATIONS = [
  { region: 'Kanto', mascot: 25 },     // Pikachu
  { region: 'Johto', mascot: 249 },    // Lugia
  { region: 'Hoenn', mascot: 384 },    // Rayquaza
  { region: 'Sinnoh', mascot: 493 },   // Arceus
  { region: 'Unova', mascot: 644 },    // Zekrom
  { region: 'Kalos', mascot: 716 },    // Xerneas
  { region: 'Alola', mascot: 791 },    // Solgaleo
  { region: 'Galar', mascot: 888 },    // Zacian
  { region: 'Paldea', mascot: 1007 },  // Koraidon
]

export function HomeContent({ totalPokemon, locale }: HomeContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-8 pb-8 md:space-y-12 md:pb-12">
      {/* Hero */}
      <section className="pt-6 text-center md:pt-10">
        <h1 className="pokemon-title text-5xl md:text-7xl lg:text-8xl">
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

      {/* Browse by Type */}
      <section className="space-y-4">
        <h2 className="text-center font-bold text-ink text-xl md:text-2xl dark:text-dark-ink">
          {t.home.pokemonTypes}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {POKEMON_TYPES.map((type) => {
            const color = typeColors[type] ?? '#a8a878'
            return (
              <a
                key={type}
                href={`/${locale}/type/${type}`}
                className="flex min-h-14 items-center justify-center rounded-xl px-4 py-3 font-semibold text-sm capitalize transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: color,
                  color: getContrastColor(color),
                }}
              >
                {t.types[type as keyof typeof t.types]}
              </a>
            )
          })}
        </div>
      </section>

      {/* Browse by Generation */}
      <section className="space-y-4">
        <h2 className="text-center font-bold text-ink text-xl md:text-2xl dark:text-dark-ink">
          {t.home.byGeneration}
        </h2>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-5 lg:grid-cols-9">
          {GENERATIONS.map((gen, index) => (
            <a
              key={gen.region}
              href={`/${locale}/generation/${index + 1}`}
              className="shadow-md group flex flex-col items-center gap-2 rounded-xl bg-white p-3 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 md:p-4 dark:bg-dark-surface"
            >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${gen.mascot}.png`}
                alt={gen.region}
                className="h-12 w-12 object-contain md:h-16 md:w-16"
                loading="lazy"
              />
              <div>
                <p className="font-bold text-ink text-sm transition-colors group-hover:text-primary dark:text-dark-ink dark:group-hover:text-dark-primary">
                  Gen {index + 1}
                </p>
                <p className="text-ink-muted text-xs dark:text-dark-ink-muted">
                  {gen.region}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
