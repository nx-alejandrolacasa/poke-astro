import { useEffect, useState } from 'react'
import type { Pokemon } from '@/utils/pokemon'
import { getPokemonImage, getPokemonName } from '@/utils/pokemon'
import { useLanguage } from '@/contexts/LanguageContext'
import { PokemonEnrichedData } from './PokemonEnrichedData'

type PokemonDetailContentProps = {
  pokemon: Pokemon
  pokemonName: string
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

export function PokemonDetailContent({ pokemon, pokemonName }: PokemonDetailContentProps) {
  const { t, language } = useLanguage()
  const [abilities, setAbilities] = useState<TranslatedAbility[]>([])
  const [types, setTypes] = useState<TranslatedType[]>([])
  const [stats, setStats] = useState<TranslatedStat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true)
      try {
        // Fetch translated types
        const typesPromises = pokemon.types.map(async ({ type }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/type/${type.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === language)
          return {
            name: type.name,
            translatedName: translation?.name ?? type.name,
          }
        })

        // Fetch translated abilities
        const abilitiesPromises = pokemon.abilities.map(async ({ ability, is_hidden }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/ability/${ability.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === language)
          return {
            name: ability.name,
            translatedName: translation?.name ?? ability.name.replaceAll('-', ' '),
            isHidden: is_hidden,
          }
        })

        // Fetch translated stats
        const statsPromises = pokemon.stats.map(async ({ stat, base_stat }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/stat/${stat.name}`)
          const data = await response.json()
          const translation = data.names.find((n: any) => n.language.name === language)
          return {
            name: stat.name,
            translatedName: translation?.name ?? t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
            baseStat: base_stat,
          }
        })

        const [translatedTypes, translatedAbilities, translatedStats] = await Promise.all([
          Promise.all(typesPromises),
          Promise.all(abilitiesPromises),
          Promise.all(statsPromises),
        ])

        setTypes(translatedTypes)
        setAbilities(translatedAbilities)
        setStats(translatedStats)
      } catch (error) {
        console.error('Failed to fetch translations:', error)
        // Fallback to untranslated data
        setTypes(pokemon.types.map(({ type }) => ({ name: type.name, translatedName: type.name })))
        setAbilities(
          pokemon.abilities.map(({ ability, is_hidden }) => ({
            name: ability.name,
            translatedName: ability.name.replaceAll('-', ' '),
            isHidden: is_hidden,
          }))
        )
        setStats(
          pokemon.stats.map(({ stat, base_stat }) => ({
            name: stat.name,
            translatedName: t.stats[stat.name as keyof typeof t.stats] ?? stat.name,
            baseStat: base_stat,
          }))
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTranslations()
  }, [pokemon, language, t.stats])

  const totalStats = stats.reduce((sum, stat) => sum + stat.baseStat, 0)
  const maxStat = 255

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Section with Image and Basic Info - Side by side on tablets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[280px_1fr] md:gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left Column - Image (smaller on tablets for more info space) */}
        <div className="flex flex-col items-center justify-start">
          <div className="relative w-full max-w-[200px] md:max-w-full">
            <img
              className="aspect-square w-full drop-shadow-2xl"
              src={getPokemonImage(pokemon)}
              alt={`${pokemon.name} official artwork`}
            />
            <span className="absolute top-1 right-1 rounded-full bg-gray-900/80 px-2 py-0.5 font-mono font-bold text-white text-sm backdrop-blur-sm md:top-2 md:right-2 md:px-3 md:py-1 md:text-lg dark:bg-white/80 dark:text-gray-900">
              #{pokemon.order.toString().padStart(3, '0')}
            </span>
          </div>
          {/* Pokemon Name below image on mobile */}
          <h1 className="mt-3 text-center font-extrabold text-2xl text-gray-900 capitalize tracking-tight md:hidden dark:text-gray-100">
            {getPokemonName(pokemonName)}
          </h1>
        </div>

        {/* Right Column - Name and Basic Info */}
        <div className="space-y-3 md:space-y-4">
          {/* Pokemon Name - Hidden on mobile, shown on tablets+ */}
          <h1 className="hidden font-extrabold text-3xl text-gray-900 capitalize tracking-tight md:block lg:text-4xl dark:text-gray-100">
            {getPokemonName(pokemonName)}
          </h1>

          {/* Compact info grid for tablets - Types and Physical stats side by side */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
            {/* Types */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-2 font-bold text-gray-900 text-base md:text-lg dark:text-gray-100">
                {t.pokemon.type}
              </h2>
              <div className="flex flex-wrap gap-2">
                {loading ? (
                  <div className="h-8 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                ) : (
                  types.map(({ name, translatedName }) => (
                    <span
                      key={name}
                      className="rounded-full border-2 border-gray-400 bg-white px-3 py-1 font-semibold text-gray-900 text-sm capitalize dark:border-gray-300 dark:bg-gray-800 dark:text-gray-100"
                    >
                      {translatedName}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Physical Stats */}
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-2 font-bold text-gray-900 text-base md:text-lg dark:text-gray-100">
                {t.pokemon.physicalStats}
              </h2>
              <div className="grid grid-cols-2 gap-1 text-gray-900 text-sm dark:text-gray-100">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t.pokemon.height}:</span>{' '}
                  <span className="font-semibold">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t.pokemon.weight}:</span>{' '}
                  <span className="font-semibold">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Abilities */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="mb-2 font-bold text-gray-900 text-base md:text-lg dark:text-gray-100">
              {t.pokemon.abilities}
            </h2>
            <div className="flex flex-wrap gap-2">
              {loading ? (
                <>
                  <div className="h-7 w-20 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                  <div className="h-7 w-16 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                </>
              ) : (
                abilities.map(({ name, translatedName, isHidden }) => (
                  <span
                    key={name}
                    className={`rounded-full border px-2 py-0.5 text-xs md:px-3 md:py-1 md:text-sm ${
                      isHidden
                        ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                        : 'border-gray-400 text-gray-900 dark:border-gray-500 dark:text-gray-100'
                    }`}
                  >
                    {translatedName}
                    {isHidden && ` (${t.pokemon.hidden})`}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Base Stats - More compact */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-3 font-bold text-lg text-gray-900 md:text-xl dark:text-gray-100">
          {t.pokemon.baseStats}
        </h2>
        <div className="space-y-2">
          {loading ? (
            // Loading skeleton for stats
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_40px_1fr] gap-2 md:grid-cols-[100px_50px_1fr] md:gap-3"
                >
                  <div className="h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-4 animate-pulse rounded bg-gray-300 dark:bg-gray-600" />
                  <div className="h-3 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600" />
                </div>
              ))}
            </>
          ) : (
            <>
              {stats.map(({ name, translatedName, baseStat }) => {
                const percentage = (baseStat / maxStat) * 100
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[80px_40px_1fr] gap-2 text-gray-900 text-sm md:grid-cols-[100px_50px_1fr] md:gap-3 dark:text-gray-100"
                  >
                    <div className="truncate text-right text-gray-600 text-xs md:text-sm dark:text-gray-400">
                      {translatedName}
                    </div>
                    <div className="text-right font-semibold text-xs md:text-sm">{baseStat}</div>
                    <div className="flex items-center">
                      <div className="relative h-3 w-full rounded-full bg-gray-300 md:h-4 dark:bg-gray-700">
                        <div
                          className={`absolute top-0 left-0 h-3 rounded-full md:h-4 ${
                            baseStat >= 100
                              ? 'bg-green-500'
                              : baseStat >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              <div className="mt-2 grid grid-cols-[80px_40px_1fr] gap-2 border-t border-gray-400 pt-2 md:mt-3 md:grid-cols-[100px_50px_1fr] md:gap-3 md:pt-3 dark:border-gray-700">
                <div className="text-right font-bold text-xs md:text-sm">{t.pokemon.total}</div>
                <div className="text-right font-bold text-xs md:text-sm">{totalStats}</div>
                <div />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Enriched data loaded client-side for fast builds */}
      <PokemonEnrichedData pokemonName={pokemonName} />
    </div>
  )
}
