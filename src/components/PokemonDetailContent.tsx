import { useEffect, useState } from 'react'
import type { Pokemon } from '@/utils/pokemon'
import { getPokemonImage, getPokemonName } from '@/utils/pokemon'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import { PokemonEnrichedData } from '@/components/PokemonEnrichedData'
import { ImageZoomModal } from '@/components/ImageZoomModal'
import { RotatingText } from '@/components/RotatingText'

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

export function PokemonDetailContent({ pokemon, pokemonName, locale }: PokemonDetailContentProps) {
  const t = translations[locale]
  // Initialize with data already available from the pokemon prop (no loading needed)
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
        // Fetch translated types (silent update, no loading state)
        const typesPromises = pokemon.types.map(async ({ type }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/type/${type.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: type.name,
            translatedName: translation?.name ?? type.name,
          }
        })

        // Fetch translated abilities (silent update, no loading state)
        const abilitiesPromises = pokemon.abilities.map(async ({ ability, is_hidden }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: ability.name,
            translatedName: translation?.name ?? ability.name.replaceAll('-', ' '),
            isHidden: is_hidden,
          }
        })

        // Fetch translated stats (silent update, no loading state)
        const statsPromises = pokemon.stats.map(async ({ stat, base_stat }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/stat/${stat.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === locale)
          return {
            name: stat.name,
            translatedName: translation?.name ?? t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
            baseStat: base_stat,
          }
        })

        // Fetch descriptions/flavor text from species endpoint (only this shows loading state)
        const speciesPromise = fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
          .then(res => res.json())
          .then(data => {
            // Get all unique flavor texts in the current language (or fallback to English)
            const entries = data.flavor_text_entries?.filter(
              (entry: any) => entry.language.name === locale
            ) || data.flavor_text_entries?.filter(
              (entry: any) => entry.language.name === 'en'
            ) || []

            // Deduplicate by text content and clean up
            const seen = new Set<string>()
            const uniqueEntries: FlavorTextEntry[] = []
            for (const entry of entries) {
              const cleanText = entry.flavor_text?.replace(/\f/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
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

        const [translatedTypes, translatedAbilities, translatedStats, flavorTexts] = await Promise.all([
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
        // Keep existing data on error (already initialized from pokemon prop)
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
    <div className="space-y-4 md:space-y-6">
      {/* Header Section with Image and Basic Info - Side by side on tablets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr] md:gap-4 lg:grid-cols-[240px_1fr] lg:gap-6">
        {/* Left Column - Image (compact on tablets) */}
        <div className="flex flex-col items-center justify-start">
          <button
            type="button"
            onClick={() => setIsImageZoomed(true)}
            className="relative w-full max-w-[180px] cursor-zoom-in transition-transform hover:scale-105 md:max-w-full"
            aria-label={`Enlarge ${pokemon.name} image`}
          >
            <img
              className="aspect-square w-full drop-shadow-2xl"
              src={getPokemonImage(pokemon)}
              alt={`${pokemon.name} official artwork`}
            />
            <span className="absolute top-1 right-1 rounded-full bg-gray-900/80 px-2 py-0.5 font-mono font-bold text-white text-xs backdrop-blur-sm md:text-sm dark:bg-white/80 dark:text-gray-900">
              #{pokemon.order.toString().padStart(3, '0')}
            </span>
            <span className="absolute bottom-1 left-1 rounded-full bg-gray-900/60 p-1.5 text-white backdrop-blur-sm">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </span>
          </button>
          {/* Pokemon Name below image on mobile */}
          <h1 className="mt-2 text-center font-extrabold text-xl text-gray-900 capitalize tracking-tight md:hidden dark:text-gray-100">
            {getPokemonName(pokemonName)}
          </h1>
        </div>

        {/* Right Column - Name, Description and Basic Info */}
        <div className="space-y-2 md:space-y-3">
          {/* Pokemon Name - Hidden on mobile, shown on tablets+ */}
          <h1 className="hidden font-extrabold text-2xl text-gray-900 capitalize tracking-tight md:block lg:text-3xl dark:text-gray-100">
            {getPokemonName(pokemonName)}
          </h1>

          {/* Description - Rotating with animation */}
          {(descriptionLoading || descriptions.length > 0) && (
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 transition-colors md:p-3 dark:border-gray-700 dark:bg-gray-800/50">
              {descriptionLoading ? (
                <div className="h-12 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
              ) : (
                <RotatingText
                  items={descriptions.map((d) => d.text)}
                  intervalMs={5000}
                  className="text-gray-700 text-sm leading-relaxed md:text-base dark:text-gray-300"
                />
              )}
            </div>
          )}

          {/* Compact info grid - 2x2 on mobile, 4 cols on tablet */}
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {/* Types */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-1 font-bold text-gray-900 text-sm md:text-base dark:text-gray-100">
                {t.pokemon.type}
              </h2>
              <div className="flex flex-wrap gap-1">
                {types.map(({ name, translatedName }) => (
                  <span
                    key={name}
                    className="rounded-full border border-gray-400 bg-white px-2 py-0.5 font-medium text-gray-900 text-sm capitalize dark:border-gray-300 dark:bg-gray-800 dark:text-gray-100"
                  >
                    {translatedName}
                  </span>
                ))}
              </div>
            </div>

            {/* Height */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-1 font-bold text-gray-900 text-sm md:text-base dark:text-gray-100">
                {t.pokemon.height}
              </h2>
              <p className="font-semibold text-gray-900 text-base md:text-lg dark:text-gray-100">
                {(pokemon.height / 10).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m
              </p>
            </div>

            {/* Weight */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-1 font-bold text-gray-900 text-sm md:text-base dark:text-gray-100">
                {t.pokemon.weight}
              </h2>
              <p className="font-semibold text-gray-900 text-base md:text-lg dark:text-gray-100">
                {(pokemon.weight / 10).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg
              </p>
            </div>

            {/* Abilities */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-2 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-1 font-bold text-gray-900 text-sm md:text-base dark:text-gray-100">
                {t.pokemon.abilities}
              </h2>
              <div className="flex flex-wrap gap-1">
                {abilities.map(({ name, translatedName, isHidden }) => (
                  <span
                    key={name}
                    className={`rounded-full border px-2 py-0.5 text-sm ${
                      isHidden
                        ? 'border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-300'
                        : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200'
                    }`}
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

      {/* Enriched data with stats - grid layout on tablets */}
      <PokemonEnrichedData
        pokemonName={pokemonName}
        locale={locale}
        statsSection={
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="mb-2 font-bold text-base text-gray-900 md:text-lg dark:text-gray-100">
              {t.pokemon.baseStats}
            </h2>
            <div className="space-y-1.5">
              {stats.map(({ name, translatedName, baseStat }) => {
                const percentage = (baseStat / maxStat) * 100
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[90px_40px_1fr] gap-2 text-gray-900 dark:text-gray-100"
                  >
                    <div className="truncate text-right text-gray-600 text-sm dark:text-gray-400">
                      {translatedName}
                    </div>
                    <div className="text-right font-semibold text-sm">{baseStat}</div>
                    <div className="flex items-center">
                      <div className="relative h-3 w-full rounded-full bg-gray-300 dark:bg-gray-700">
                        <div
                          className={`absolute top-0 left-0 h-3 rounded-full ${
                            baseStat >= 100
                              ? 'bg-teal-400 dark:bg-teal-500'
                              : baseStat >= 60
                                ? 'bg-amber-400 dark:bg-amber-500'
                                : 'bg-orange-400 dark:bg-orange-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="mt-2 grid grid-cols-[90px_40px_1fr] gap-2 border-t border-gray-400 pt-2 dark:border-gray-700">
                <div className="text-right font-bold text-sm text-gray-900 dark:text-gray-100">{t.pokemon.total}</div>
                <div className="text-right font-bold text-sm text-gray-900 dark:text-gray-100">{totalStats}</div>
                <div />
              </div>
            </div>
          </div>
        }
      />

      {/* Image zoom modal */}
      <ImageZoomModal
        src={getPokemonImage(pokemon)}
        alt={`${pokemon.name} official artwork`}
        isOpen={isImageZoomed}
        onClose={() => setIsImageZoomed(false)}
      />
    </div>
  )
}
