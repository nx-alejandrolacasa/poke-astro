import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import type { ReactNode } from 'react'
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
  statsSection?: ReactNode
}

export function PokemonEnrichedData({ pokemonName, statsSection }: PokemonEnrichedDataProps) {
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {statsSection}
        <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800/50">
          <div className="h-10 w-10 animate-spin rounded-full border-t-4 border-primary" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {statsSection}
        <div className="rounded-lg border border-orange-300 bg-orange-100 p-4 text-center dark:border-orange-700 dark:bg-orange-900/20">
          <p className="text-orange-700 dark:text-orange-400">{t.errors.loadFailed}</p>
        </div>
      </div>
    )
  }

  const hasEvolutions = data.evolutions.length > 1 && data.evolutionTree

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {/* Stats Section - Left column on tablets */}
      {statsSection}

      {/* Type Effectiveness - Right column on tablets */}
      <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors dark:border-gray-700 dark:bg-gray-800/50">
        <h2 className="mb-2 font-bold text-base text-gray-900 md:text-lg dark:text-gray-100">
          {t.pokemon.typeEffectiveness}
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {/* Weaknesses */}
          <div>
            <h3 className="mb-1 font-semibold text-orange-600 text-sm dark:text-orange-400">
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.weaknesses.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-orange-300 bg-orange-100 px-2 py-0.5 text-orange-800 text-sm capitalize dark:border-orange-500 dark:bg-orange-900/30 dark:text-orange-200"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-1 font-semibold text-teal-600 text-sm dark:text-teal-400">
              {t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.resistances.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-full border border-teal-300 bg-teal-100 px-2 py-0.5 text-teal-800 text-sm capitalize dark:border-teal-500 dark:bg-teal-900/30 dark:text-teal-200"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm dark:text-gray-500">{t.pokemon.none}</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className="mb-1 font-semibold text-primary text-sm">
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span
                    key={type}
                    className="rounded-full border border-primary bg-primary-50 px-2 py-0.5 text-gray-900 text-sm capitalize dark:bg-primary-900/30 dark:text-gray-100"
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

      {/* Evolution Chain - Spans full width */}
      {hasEvolutions && (
        <div className="rounded-lg border border-gray-300 bg-gray-50 p-3 transition-colors md:col-span-2 dark:border-gray-700 dark:bg-gray-800/50">
          <h2 className="mb-2 font-bold text-base text-gray-900 md:text-lg dark:text-gray-100">
            {t.pokemon.evolutionChain}
          </h2>
          <EvolutionTree tree={data.evolutionTree!} currentPokemon={pokemonName} />
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
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="flex flex-col items-center gap-4 md:flex-row">
          {stageIndex > 0 && (
            <>
              <div className="font-bold text-gray-600 text-2xl md:hidden dark:text-gray-500">
                ↓
              </div>
              <div className="hidden font-bold text-gray-600 text-2xl md:block dark:text-gray-500">
                →
              </div>
            </>
          )}
          <div
            className={`flex flex-col items-center gap-2 md:flex-row ${hasBranching && stage.length > 1 ? 'rounded-xl border-2 border-dashed border-gray-400 p-2 dark:border-gray-600' : ''}`}
          >
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex items-center">
                {pokemonIndex > 0 && stage.length > 1 && (
                  <span className="mx-2 hidden font-bold text-gray-400 text-lg md:inline">/</span>
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
      className={`rounded-xl border-2 p-3 transition-all hover:border-primary hover:scale-105 ${
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
            className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28"
            loading="lazy"
          />
        )}
        <p className="font-semibold text-gray-900 text-base capitalize dark:text-gray-100">
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
