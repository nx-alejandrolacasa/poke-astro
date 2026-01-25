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
    <div className="space-y-4 md:space-y-6">
      {/* Description */}
      {data.flavorText && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-2 font-bold text-gray-900 text-base md:text-lg dark:text-gray-100">
            {t.pokemon.description}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed md:text-base dark:text-gray-300">
            {data.flavorText}
          </p>
        </div>
      )}

      {/* Type Effectiveness */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-3 font-bold text-lg text-gray-900 md:text-xl dark:text-gray-100">
          {t.pokemon.typeEffectiveness}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
          {/* Weaknesses */}
          <div>
            <h3 className="mb-2 font-semibold text-red-600 text-sm md:text-base dark:text-red-400">
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.typeEffectiveness.weaknesses.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-red-400 bg-red-100 px-2 py-0.5 text-gray-900 text-xs capitalize md:px-3 md:py-1 md:text-sm dark:border-red-500 dark:bg-red-900/30 dark:text-gray-100"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-xs md:text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-2 font-semibold text-green-600 text-sm md:text-base dark:text-green-400">
              {t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.typeEffectiveness.resistances.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-green-400 bg-green-100 px-2 py-0.5 text-gray-900 text-xs capitalize md:px-3 md:py-1 md:text-sm dark:border-green-500 dark:bg-green-900/30 dark:text-gray-100"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-600 text-xs md:text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className="mb-2 font-semibold text-sm text-primary md:text-base">
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-primary bg-primary-50 px-2 py-0.5 text-gray-900 text-xs capitalize md:px-3 md:py-1 md:text-sm dark:bg-primary-900/30 dark:text-gray-100"
                  >
                    {type} (0x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-xs md:text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {data.evolutions.length > 1 && data.evolutionTree && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-3 font-bold text-lg text-gray-900 md:text-xl dark:text-gray-100">
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
                  <div className="h-4" />
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
      className={`rounded-lg border p-2 transition-all hover:border-primary hover:scale-105 md:p-3 ${
        isCurrentPokemon
          ? 'border-primary bg-gray-200 dark:bg-gray-700'
          : 'border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800'
      }`}
    >
      <div className="text-center">
        {evoId && (
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
            alt={name}
            className="mx-auto h-14 w-14 object-contain md:h-20 md:w-20"
            loading="lazy"
          />
        )}
        <p className="mt-1 font-semibold text-gray-900 text-xs capitalize md:text-sm dark:text-gray-100">
          {getPokemonName(name)}
        </p>
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
