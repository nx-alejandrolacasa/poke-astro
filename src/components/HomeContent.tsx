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

const TYPE_POKEMON: Record<string, number> = {
  normal: 143,    // Snorlax
  fire: 6,        // Charizard
  water: 9,       // Blastoise
  electric: 172,  // Pichu
  grass: 3,       // Venusaur
  ice: 131,       // Lapras
  fighting: 68,   // Machamp
  poison: 94,     // Gengar
  ground: 51,     // Dugtrio
  flying: 18,     // Pidgeot
  psychic: 150,   // Mewtwo
  bug: 12,        // Butterfree
  rock: 95,       // Onix
  ghost: 94,      // Gengar
  dragon: 149,    // Dragonite
  dark: 197,      // Umbreon
  steel: 208,     // Steelix
  fairy: 35,      // Clefairy
}

const GENERATIONS = [
  { region: 'Kanto', mascot: 25, type: 'electric' },    // Pikachu
  { region: 'Johto', mascot: 249, type: 'psychic' },    // Lugia
  { region: 'Hoenn', mascot: 384, type: 'dragon' },     // Rayquaza
  { region: 'Sinnoh', mascot: 493, type: 'normal' },    // Arceus
  { region: 'Unova', mascot: 644, type: 'dark' },       // Zekrom (Dragon/Electric taken, black-themed)
  { region: 'Kalos', mascot: 716, type: 'fairy' },      // Xerneas
  { region: 'Alola', mascot: 791, type: 'steel' },      // Solgaleo (Psychic taken)
  { region: 'Galar', mascot: 888, type: 'water' },      // Zacian (Fairy taken, blue-themed box)
  { region: 'Paldea', mascot: 1007, type: 'fighting' }, // Koraidon
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
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 md:grid-cols-9">
          {POKEMON_TYPES.map((type) => {
            const color = typeColors[type] ?? '#a8a878'
            const pokeId = TYPE_POKEMON[type]
            return (
              <a
                key={type}
                href={`/${locale}/type/${type}`}
                className="group flex flex-col items-center gap-1 rounded-xl p-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-opacity-80 active:scale-95"
                style={{ backgroundColor: `${color}15`, border: `2px solid ${color}` }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokeId}.png`}
                  alt={type}
                  className="h-12 w-12 object-contain md:h-14 md:w-14"
                  loading="lazy"
                />
                <span
                  className="w-full rounded-lg py-0.5 text-center font-semibold text-xs capitalize"
                  style={{ backgroundColor: color, color: getContrastColor(color) }}
                >
                  {t.types[type as keyof typeof t.types]}
                </span>
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
          {GENERATIONS.map((gen, index) => {
            const color = typeColors[gen.type] ?? '#a8a878'
            return (
              <a
                key={gen.region}
                href={`/${locale}/generation/${index + 1}`}
                className="group flex flex-col items-center gap-1 rounded-xl p-2 text-center transition-all duration-200 hover:-translate-y-0.5 active:scale-95 md:p-3"
                style={{ backgroundColor: `${color}15`, border: `2px solid ${color}` }}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${gen.mascot}.png`}
                  alt={gen.region}
                  className="h-12 w-12 object-contain md:h-14 md:w-14"
                  loading="lazy"
                />
                <span
                  className="w-full rounded-lg py-0.5 text-center font-semibold text-xs"
                  style={{ backgroundColor: color, color: getContrastColor(color) }}
                >
                  {gen.region}
                </span>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
