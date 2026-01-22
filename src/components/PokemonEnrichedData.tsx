import { useEffect, useState } from 'react'
import type { EvolutionChain } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'

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

export function PokemonEnrichedData({
  pokemonName,
}: PokemonEnrichedDataProps) {
  const [data, setData] = useState<EnrichedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pokemon/${pokemonName}/enriched`)
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
  }, [pokemonName])

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-center items-center p-12">
          <div className="border-white border-t-4 rounded-full w-12 h-12 animate-spin" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="border border-red-700 bg-red-900/20 p-4 rounded-lg text-center">
        <p className="text-red-400">
          Failed to load additional Pokemon data. Please try again later.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Description */}
      {data.flavorText && (
        <div className="border border-gray-700 bg-gray-800/50 p-4 rounded-lg">
          <h2 className="mb-2 font-bold text-xl">Description</h2>
          <p className="leading-relaxed text-gray-300">{data.flavorText}</p>
        </div>
      )}

      {/* Type Effectiveness */}
      <div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
        <h2 className="mb-4 font-bold text-2xl">Type Effectiveness</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Weaknesses */}
          <div>
            <h3 className="mb-3 font-semibold text-lg text-red-400">
              Weak To ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.weaknesses.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="border border-red-500 bg-red-900/30 px-3 py-1 rounded-full capitalize text-sm"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-3 font-semibold text-lg text-green-400">
              Resistant To ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.resistances.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="border border-green-500 bg-green-900/30 px-3 py-1 rounded-full capitalize text-sm"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className="mb-3 font-semibold text-lg text-blue-400">
              Immune To ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span
                    key={type}
                    className="border border-blue-500 bg-blue-900/30 px-3 py-1 rounded-full capitalize text-sm"
                  >
                    {type} (0x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">None</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {data.evolutions.length > 1 && data.evolutionChainData && (
        <div className="border border-gray-700 bg-gray-800/50 p-6 rounded-lg">
          <h2 className="mb-4 font-bold text-2xl">Evolution Chain</h2>
          <div className="flex flex-wrap justify-center items-center gap-4">
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
                    className={`border rounded-lg p-4 transition-all hover:border-white hover:scale-105 ${
                      evoName === pokemonName
                        ? 'border-white bg-gray-700'
                        : 'border-gray-600'
                    }`}
                  >
                    <div className="text-center">
                      <p className="mb-2 font-semibold capitalize">
                        {getPokemonName(evoName)}
                      </p>
                      {evoId && (
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
                          alt={evoName}
                          className="mx-auto w-24 h-24 object-contain"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </a>
                  {index < data.evolutions.length - 1 && (
                    <div className="font-bold text-2xl text-gray-500">→</div>
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
