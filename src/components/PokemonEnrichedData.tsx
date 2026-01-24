import type { EvolutionChain } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type EnrichedData = {
  evolutionChainData: EvolutionChain | null
  evolutions: string[]
  flavorText: string | null
  typeEffectiveness: {
    immunities: string[]
    resistances: { multiplier: number; type: string }[]
    weaknesses: { multiplier: number; type: string }[]
  }
}

type PokemonEnrichedDataProps = {
  pokemonName: string
}

export function PokemonEnrichedData({ pokemonName }: PokemonEnrichedDataProps) {
  const { t, language } = useLanguage()
  const [data, setData] = useState<EnrichedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/pokemon/${pokemonName}/enriched?lang=${language}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch enriched data')
        }
        const enrichedData = await response.json()
        setData(enrichedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchEnrichedData()
  }, [pokemonName, language])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center p-12">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-primary" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-100 p-4 text-center dark:border-red-700 dark:bg-red-900/20">
        <p className="text-red-700 dark:text-red-400">{t.errors.loadFailed}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Description */}
      {data.flavorText && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-4 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-2 font-bold text-gray-900 text-xl dark:text-gray-100">
            {t.pokemon.description}
          </h2>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            {data.flavorText}
          </p>
        </div>
      )}

      {/* Type Effectiveness */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
          {t.pokemon.typeEffectiveness}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Weaknesses */}
          <div>
            <h3 className="mb-3 font-semibold text-lg text-red-600 dark:text-red-400">
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.weaknesses.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-red-400 bg-red-100 px-3 py-1 text-gray-900 text-sm capitalize dark:border-red-500 dark:bg-red-900/30 dark:text-gray-100"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-3 font-semibold text-green-600 text-lg dark:text-green-400">
              {t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.resistances.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-green-400 bg-green-100 px-3 py-1 text-gray-900 text-sm capitalize dark:border-green-500 dark:bg-green-900/30 dark:text-gray-100"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className="mb-3 font-semibold text-lg text-primary">
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-primary bg-primary-50 px-3 py-1 text-gray-900 text-sm capitalize dark:bg-primary-900/30 dark:text-gray-100"
                  >
                    {type} (0x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {data.evolutions.length > 1 && data.evolutionChainData && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
            {t.pokemon.evolutionChain}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {data.evolutions.map((evoName, index) => {
              // Get Pokemon ID from evolution chain
              const getEvolutionNode = (
                node: typeof data.evolutionChainData.chain,
                targetName: string
              ): typeof data.evolutionChainData.chain | null => {
                if (node.species.name === targetName) return node
                for (const evo of node.evolves_to) {
                  const found = getEvolutionNode(evo, targetName)
                  if (found) return found
                }
                return null
              }

              const evoNode = getEvolutionNode(
                data.evolutionChainData.chain,
                evoName
              )
              const evoId = evoNode?.species.url.split('/').slice(-2, -1)[0]

              return (
                <div key={evoName} className="flex items-center gap-4">
                  <a
                    href={`/pokemon/${evoName}`}
                    className={`rounded-lg border p-4 transition-all hover:border-primary hover:scale-105 ${
                      evoName === pokemonName
                        ? 'border-primary bg-gray-200 dark:bg-gray-700'
                        : 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-center">
                      <p className="mb-2 font-semibold text-gray-900 capitalize dark:text-gray-100">
                        {getPokemonName(evoName)}
                      </p>
                      {evoId && (
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
                          alt={evoName}
                          className="mx-auto h-24 w-24 object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </a>
                  {index < data.evolutions.length - 1 && (
                    <div className="font-bold text-2xl text-gray-600 dark:text-gray-500">
                      →
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
