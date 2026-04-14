import { useEffect, useState } from 'react'
import { ImageZoomModal } from '@/components/ImageZoomModal'
import { PokemonEnrichedData } from '@/components/PokemonEnrichedData'
import { RotatingText } from '@/components/RotatingText'
import type { Locale } from '@/utils/i18n'
import type { Pokemon } from '@/utils/pokemon'
import { getPokemonImage, getPokemonName } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type PokemonDetailContentProps = {
  pokemon: Pokemon
  pokemonName: string
  locale: Locale
}

type TranslatedAbility = {
  name: string
  translatedName: string
  isHidden: boolean
}

type TranslatedType = {
  name: string
  translatedName: string
}

type TranslatedStat = {
  name: string
  translatedName: string
  baseStat: number
}

type FlavorTextEntry = {
  text: string
  version: string
}

type PokeApiNameEntry = {
  language: { name: string }
  name: string
}

type PokeApiFlavorTextEntry = {
  flavor_text: string
  language: { name: string }
  version?: { name: string }
}

export function PokemonDetailContent({
  pokemon,
  pokemonName,
  locale,
}: PokemonDetailContentProps) {
  const t = translations[locale]
  const [abilities, setAbilities] = useState<TranslatedAbility[]>(() =>
    pokemon.abilities.map(({ ability, is_hidden }) => ({
      name: ability.name,
      translatedName: ability.name.replaceAll('-', ' '),
      isHidden: is_hidden,
    }))
  )
  const [types, setTypes] = useState<TranslatedType[]>(() =>
    pokemon.types.map(({ type }) => ({
      name: type.name,
      translatedName: type.name,
    }))
  )
  const [stats, setStats] = useState<TranslatedStat[]>(() =>
    pokemon.stats.map(({ stat, base_stat }) => ({
      name: stat.name,
      translatedName: t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
      baseStat: base_stat,
    }))
  )
  const [descriptions, setDescriptions] = useState<FlavorTextEntry[]>([])
  const [descriptionLoading, setDescriptionLoading] = useState(true)
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      setDescriptionLoading(true)
      try {
        const typesPromises = pokemon.types.map(async ({ type }) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/type/${type.name}`
          )
          const data = await response.json()
          const translation = data.names.find(
            (n: PokeApiNameEntry) => n.language.name === locale
          )
          return {
            name: type.name,
            translatedName: translation?.name ?? type.name,
          }
        })

        const abilitiesPromises = pokemon.abilities.map(
          async ({ ability, is_hidden }) => {
            const response = await fetch(
              `https://pokeapi.co/api/v2/ability/${ability.name}`
            )
            const data = await response.json()
            const translation = data.names.find(
              (n: PokeApiNameEntry) => n.language.name === locale
            )
            return {
              name: ability.name,
              translatedName:
                translation?.name ?? ability.name.replaceAll('-', ' '),
              isHidden: is_hidden,
            }
          }
        )

        const statsPromises = pokemon.stats.map(async ({ stat, base_stat }) => {
          const response = await fetch(
            `https://pokeapi.co/api/v2/stat/${stat.name}`
          )
          const data = await response.json()
          const translation = data.names.find(
            (n: PokeApiNameEntry) => n.language.name === locale
          )
          return {
            name: stat.name,
            translatedName:
              translation?.name ??
              t.stats[stat.name as keyof typeof t.stats] ??
              stat.name,
            baseStat: base_stat,
          }
        })

        const speciesPromise = fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
        )
          .then((res) => res.json())
          .then((data) => {
            const entries =
              data.flavor_text_entries?.filter(
                (entry: PokeApiFlavorTextEntry) =>
                  entry.language.name === locale
              ) ||
              data.flavor_text_entries?.filter(
                (entry: PokeApiFlavorTextEntry) => entry.language.name === 'en'
              ) ||
              []
            const seen = new Set<string>()
            const uniqueEntries: FlavorTextEntry[] = []
            for (const entry of entries) {
              const cleanText = entry.flavor_text
                ?.replace(/\f/g, ' ')
                .replace(/\n/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
              if (cleanText && !seen.has(cleanText)) {
                seen.add(cleanText)
                uniqueEntries.push({
                  text: cleanText,
                  version: entry.version?.name || 'unknown',
                })
              }
            }
            return uniqueEntries
          })
          .catch(() => [] as FlavorTextEntry[])

        const [
          translatedTypes,
          translatedAbilities,
          translatedStats,
          flavorTexts,
        ] = await Promise.all([
          Promise.all(typesPromises),
          Promise.all(abilitiesPromises),
          Promise.all(statsPromises),
          speciesPromise,
        ])

        setTypes(translatedTypes)
        setAbilities(translatedAbilities)
        setStats(translatedStats)
        setDescriptions(flavorTexts)
      } catch (error) {
        console.error('Failed to fetch enriched data:', error)
        setDescriptions([])
      } finally {
        setDescriptionLoading(false)
      }
    }

    fetchEnrichedData()
  }, [pokemon, pokemonName, locale, t.stats])

  const totalStats = stats.reduce((sum, stat) => sum + stat.baseStat, 0)
  const maxStat = 255

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] lg:gap-8">
        <div className="flex flex-col items-center justify-start">
          <button
            type="button"
            onClick={() => setIsImageZoomed(true)}
            className="chromatic-shadow-lg relative w-full max-w-[180px] cursor-zoom-in rounded-2xl bg-white p-4 transition-all duration-300 md:max-w-full dark:bg-dark-surface"
            aria-label={`Enlarge ${pokemon.name} image`}
          >
            <img
              className="aspect-square w-full drop-shadow-lg"
              src={getPokemonImage(pokemon)}
              alt={`${pokemon.name} official artwork`}
            />
            <span className="absolute top-2 right-2 rounded-lg bg-ink/70 px-2 py-0.5 font-bold font-mono text-white text-xs backdrop-blur-sm dark:bg-white/10 dark:text-dark-ink">
              #{pokemon.order.toString().padStart(3, '0')}
            </span>
            <span className="absolute bottom-2 left-2 rounded-full bg-ink/40 p-1.5 text-white backdrop-blur-sm dark:bg-white/10 dark:text-dark-ink">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              </svg>
            </span>
          </button>
          <h1 className="mt-4 text-center font-bold text-2xl text-ink tracking-tight md:hidden dark:text-dark-ink">
            {getPokemonName(pokemonName)}
          </h1>
        </div>

        <div className="space-y-4">
          <h1 className="hidden font-bold text-3xl text-ink tracking-tight md:block lg:text-4xl dark:text-dark-ink">
            {getPokemonName(pokemonName)}
          </h1>

          {(descriptionLoading || descriptions.length > 0) && (
            <div className="chromatic-shadow-b rounded-2xl bg-white p-4 transition-colors dark:bg-dark-surface">
              {descriptionLoading ? (
                <div className="h-12 animate-pulse rounded-lg bg-surface-sunken dark:bg-dark-raised" />
              ) : (
                <>
                  <p className="mb-1.5 font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
                    {t.pokemon.description}
                  </p>
                  <RotatingText
                    items={descriptions.map((d) => d.text)}
                    intervalMs={5000}
                    className="text-ink text-sm leading-relaxed md:text-base dark:text-dark-ink"
                  />
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div className="chromatic-shadow-sm rounded-2xl bg-white p-3 transition-colors dark:bg-dark-surface">
              <h2 className="mb-1.5 font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
                {t.pokemon.type}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {types.map(({ name, translatedName }) => (
                  <span
                    key={name}
                    className="rounded-lg bg-surface-sunken px-2.5 py-0.5 font-medium text-ink text-xs capitalize dark:bg-dark-raised dark:text-dark-ink"
                  >
                    {translatedName}
                  </span>
                ))}
              </div>
            </div>
            <div className="chromatic-shadow-sm rounded-2xl bg-white p-3 transition-colors dark:bg-dark-surface">
              <h2 className="mb-1.5 font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
                {t.pokemon.height}
              </h2>
              <p className="font-mono font-semibold text-ink text-lg dark:text-dark-ink">
                {(pokemon.height / 10).toLocaleString(locale, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{' '}
                m
              </p>
            </div>
            <div className="chromatic-shadow-sm rounded-2xl bg-white p-3 transition-colors dark:bg-dark-surface">
              <h2 className="mb-1.5 font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
                {t.pokemon.weight}
              </h2>
              <p className="font-mono font-semibold text-ink text-lg dark:text-dark-ink">
                {(pokemon.weight / 10).toLocaleString(locale, {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })}{' '}
                kg
              </p>
            </div>
            <div className="chromatic-shadow-sm rounded-2xl bg-white p-3 transition-colors dark:bg-dark-surface">
              <h2 className="mb-1.5 font-semibold text-[10px] text-ink-faint uppercase tracking-wider dark:text-dark-ink-faint">
                {t.pokemon.abilities}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {abilities.map(({ name, translatedName, isHidden }) => (
                  <span
                    key={name}
                    className={`rounded-lg px-2.5 py-0.5 font-medium text-xs ${isHidden ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'bg-surface-sunken text-ink dark:bg-dark-raised dark:text-dark-ink'}`}
                    title={isHidden ? t.pokemon.hidden : undefined}
                  >
                    {translatedName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PokemonEnrichedData
        pokemonName={pokemonName}
        locale={locale}
        statsSection={
          <div className="chromatic-shadow rounded-2xl bg-white p-4 transition-colors dark:bg-dark-surface">
            <h2 className="mb-3 font-bold text-ink text-sm md:text-base dark:text-dark-ink">
              {t.pokemon.baseStats}
            </h2>
            <div className="space-y-2">
              {stats.map(({ name, translatedName, baseStat }) => {
                const percentage = (baseStat / maxStat) * 100
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[90px_40px_1fr] gap-2 text-ink dark:text-dark-ink"
                  >
                    <div className="truncate text-right text-ink-muted text-xs dark:text-dark-ink-muted">
                      {translatedName}
                    </div>
                    <div className="text-right font-bold font-mono text-xs">
                      {baseStat}
                    </div>
                    <div className="flex items-center">
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                        <div
                          className={`absolute top-0 left-0 h-2.5 rounded-full transition-all ${baseStat >= 100 ? 'bg-emerald-400 dark:bg-emerald-500' : baseStat >= 60 ? 'bg-amber-400 dark:bg-amber-500' : 'bg-orange-400 dark:bg-orange-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="mt-3 grid grid-cols-[90px_40px_1fr] gap-2 border-surface-sunken border-t pt-3 dark:border-dark-raised">
                <div className="text-right font-bold text-ink text-xs uppercase dark:text-dark-ink">
                  {t.pokemon.total}
                </div>
                <div className="text-right font-bold font-mono text-ink text-xs dark:text-dark-ink">
                  {totalStats}
                </div>
                <div />
              </div>
            </div>
          </div>
        }
      />

      <ImageZoomModal
        src={getPokemonImage(pokemon)}
        alt={`${pokemon.name} official artwork`}
        isOpen={isImageZoomed}
        onClose={() => setIsImageZoomed(false)}
      />
    </div>
  )
}
