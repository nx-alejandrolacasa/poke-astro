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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-primary" />
      </div>
    )
  }

  const totalStats = stats.reduce((sum, stat) => sum + stat.baseStat, 0)
  const maxStat = 255

  return (
    <div className="space-y-8">
      {/* Header Section with Image and Basic Info */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Image */}
        <div className="flex flex-col items-center">
          <img
            className="aspect-square w-full max-w-md"
            src={getPokemonImage(pokemon)}
            alt={`${pokemon.name} official artwork`}
          />
          <h1 className="mt-4 text-center font-bold text-4xl text-gray-900 capitalize dark:text-gray-100">
            {getPokemonName(pokemonName)}
          </h1>
          <p className="mt-2 text-center text-gray-600 text-lg dark:text-gray-400">
            #{pokemon.order.toString().padStart(3, '0')}
          </p>
        </div>

        {/* Right Column - Basic Info */}
        <div className="space-y-6">
          {/* Types */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="mb-3 font-bold text-gray-900 text-xl dark:text-gray-100">
              {t.pokemon.type}
            </h2>
            <div className="flex gap-2">
              {types.map(({ name, translatedName }) => (
                <span
                  key={name}
                  className="rounded-full border-2 border-gray-400 bg-white px-4 py-2 font-semibold text-gray-900 capitalize dark:border-gray-300 dark:bg-gray-800 dark:text-gray-100"
                >
                  {translatedName}
                </span>
              ))}
            </div>
          </div>

          {/* Physical Stats */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="mb-3 font-bold text-gray-900 text-xl dark:text-gray-100">
              {t.pokemon.physicalStats}
            </h2>
            <div className="grid grid-cols-2 gap-2 text-gray-900 dark:text-gray-100">
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

          {/* Abilities */}
          <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
            <h2 className="mb-3 font-bold text-gray-900 text-xl dark:text-gray-100">
              {t.pokemon.abilities}
            </h2>
            <div className="flex flex-wrap gap-2">
              {abilities.map(({ name, translatedName, isHidden }) => (
                <span
                  key={name}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    isHidden
                      ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                      : 'border-gray-400 text-gray-900 dark:border-gray-500 dark:text-gray-100'
                  }`}
                >
                  {translatedName}
                  {isHidden && ` (${t.pokemon.hidden})`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Base Stats */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
          {t.pokemon.baseStats}
        </h2>
        <div className="space-y-3">
          {stats.map(({ name, translatedName, baseStat }) => {
            const percentage = (baseStat / maxStat) * 100
            return (
              <div
                key={name}
                className="grid grid-cols-[120px_60px_1fr] gap-4 text-gray-900 dark:text-gray-100"
              >
                <div className="text-right text-gray-600 dark:text-gray-400">
                  {translatedName}
                </div>
                <div className="text-right font-semibold">{baseStat}</div>
                <div className="flex items-center">
                  <div className="relative h-4 w-full rounded-full bg-gray-300 dark:bg-gray-700">
                    <div
                      className={`absolute top-0 left-0 h-4 rounded-full ${
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
          <div className="mt-4 grid grid-cols-[120px_60px_1fr] gap-4 border-t border-gray-400 pt-3 dark:border-gray-700">
            <div className="text-right font-bold">{t.pokemon.total}</div>
            <div className="text-right font-bold">{totalStats}</div>
            <div />
          </div>
        </div>
      </div>

      {/* Enriched data loaded client-side for fast builds */}
      <PokemonEnrichedData pokemonName={pokemonName} />
    </div>
  )
}
