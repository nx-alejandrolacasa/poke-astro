import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type EnrichedData = {
  evolutionTree: EvolutionTreeNode | null
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
      {data.evolutions.length > 1 && data.evolutionTree && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-6 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-4 font-bold text-2xl text-gray-900 dark:text-gray-100">
            {t.pokemon.evolutionChain}
          </h2>
          <EvolutionTree tree={data.evolutionTree} currentPokemon={pokemonName} />
        </div>
      )}
    </div>
  )
}

type EvolutionTreeProps = {
  tree: EvolutionTreeNode
  currentPokemon: string
}

function EvolutionTree({ tree, currentPokemon }: EvolutionTreeProps) {
  const stages = collectEvolutionStages(tree)
  const hasBranching = stages.some((stage) => stage.length > 1)

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-2">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="flex items-center gap-2 md:gap-4">
          {stageIndex > 0 && (
            <div className="hidden font-bold text-2xl text-gray-600 md:block dark:text-gray-500">
              →
            </div>
          )}
          {stageIndex > 0 && (
            <div className="font-bold text-2xl text-gray-600 md:hidden dark:text-gray-500">
              ↓
            </div>
          )}
          <div
            className={`flex flex-col items-center gap-2 ${hasBranching && stage.length > 1 ? 'rounded-lg border border-dashed border-gray-400 p-2 dark:border-gray-600' : ''}`}
          >
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex flex-col items-center">
                {pokemonIndex > 0 && stage.length > 1 && (
                  <span className="mb-2 text-gray-500 text-xs italic">o</span>
                )}
                <EvolutionCard
                  name={pokemon.name}
                  speciesUrl={pokemon.speciesUrl}
                  isCurrentPokemon={pokemon.name === currentPokemon}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

type EvolutionCardProps = {
  name: string
  speciesUrl: string
  isCurrentPokemon: boolean
}

function EvolutionCard({ name, speciesUrl, isCurrentPokemon }: EvolutionCardProps) {
  const evoId = speciesUrl.split('/').slice(-2, -1)[0]

  return (
    <a
      href={`/pokemon/${name}`}
      className={`rounded-lg border p-3 transition-all hover:border-primary hover:scale-105 md:p-4 ${
        isCurrentPokemon
          ? 'border-primary bg-gray-200 dark:bg-gray-700'
          : 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800'
      }`}
    >
      <div className="text-center">
        <p className="mb-1 font-semibold text-gray-900 text-sm capitalize md:mb-2 md:text-base dark:text-gray-100">
          {getPokemonName(name)}
        </p>
        {evoId && (
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
            alt={name}
            className="mx-auto h-16 w-16 object-contain md:h-24 md:w-24"
            loading="lazy"
          />
        )}
      </div>
    </a>
  )
}

/**
 * Collects evolution stages from the tree, grouping branching evolutions together
 * Returns an array of stages, where each stage is an array of Pokemon at that level
 */
function collectEvolutionStages(
  tree: EvolutionTreeNode
): { name: string; speciesUrl: string }[][] {
  const stages: { name: string; speciesUrl: string }[][] = []

  function traverse(node: EvolutionTreeNode, depth: number) {
    if (!stages[depth]) {
      stages[depth] = []
    }

    // Only add if not already in this stage (avoid duplicates)
    if (!stages[depth].some((p) => p.name === node.name)) {
      stages[depth].push({ name: node.name, speciesUrl: node.speciesUrl })
    }

    for (const child of node.evolvesTo) {
      traverse(child, depth + 1)
    }
  }

  traverse(tree, 0)
  return stages
}
