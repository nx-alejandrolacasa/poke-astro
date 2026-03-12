import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import { getTypeColor } from '@/utils/typeColors'
import type { TypeColorSet } from '@/utils/typeColors'

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
  locale: Locale
  typeColor?: TypeColorSet
  statsSection?: ReactNode
}

export function PokemonEnrichedData({ pokemonName, locale, typeColor, statsSection }: PokemonEnrichedDataProps) {
  const t = translations[locale]
  const tc = typeColor || getTypeColor('normal')
  const [data, setData] = useState<EnrichedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/pokemon/${pokemonName}/enriched?lang=${locale}`
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
  }, [pokemonName, locale])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statsSection}
        <div className="glass-card flex items-center justify-center rounded-3xl p-8 shadow-soft">
          <div
            className="h-10 w-10 rounded-full border-t-4 pokeball-spin"
            style={{ borderColor: tc.accent }}
          />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statsSection}
        <div
          className="flex items-center justify-center rounded-3xl p-6 text-center"
          style={{ backgroundColor: `${tc.light}`, border: `1px solid ${tc.medium}40` }}
        >
          <p style={{ color: tc.dark }}>{t.errors.loadFailed}</p>
        </div>
      </div>
    )
  }

  const hasEvolutions = data.evolutions.length > 1 && data.evolutionTree

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Stats Section */}
      {statsSection}

      {/* Type Effectiveness */}
      <div className="glass-card rounded-3xl p-4 shadow-soft md:p-5">
        <h2 className="mb-3 font-heading text-lg font-bold md:text-xl">
          {t.pokemon.typeEffectiveness}
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
          {/* Weaknesses */}
          <div>
            <h3 className="mb-1.5 font-heading text-sm font-bold" style={{ color: getTypeColor('fire').accent }}>
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.weaknesses.map(({ type, multiplier }) => {
                  const wtc = getTypeColor(type)
                  return (
                    <span
                      key={type}
                      className="rounded-full px-2 py-0.5 text-sm font-medium capitalize"
                      style={{ backgroundColor: wtc.light, color: wtc.dark, border: `1px solid ${wtc.medium}40` }}
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.pokemon.none}</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className="mb-1.5 font-heading text-sm font-bold" style={{ color: getTypeColor('grass').accent }}>
              {t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.resistances.map(({ type, multiplier }) => {
                  const rtc = getTypeColor(type)
                  return (
                    <span
                      key={type}
                      className="rounded-full px-2 py-0.5 text-sm font-medium capitalize"
                      style={{ backgroundColor: rtc.light, color: rtc.dark, border: `1px solid ${rtc.medium}40` }}
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.pokemon.none}</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className="mb-1.5 font-heading text-sm font-bold" style={{ color: getTypeColor('steel').accent }}>
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.immunities.map((type) => {
                  const itc = getTypeColor(type)
                  return (
                    <span
                      key={type}
                      className="rounded-full px-2 py-0.5 text-sm font-medium capitalize"
                      style={{ backgroundColor: itc.light, color: itc.dark, border: `1px solid ${itc.medium}40` }}
                    >
                      {type} (0x)
                    </span>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.pokemon.none}</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {hasEvolutions && (
        <div className="glass-card rounded-3xl p-4 shadow-soft md:col-span-2 md:p-5">
          <h2 className="mb-3 font-heading text-lg font-bold md:text-xl">
            {t.pokemon.evolutionChain}
          </h2>
          <EvolutionTree tree={data.evolutionTree!} currentPokemon={pokemonName} locale={locale} />
        </div>
      )}
    </div>
  )
}

type EvolutionTreeProps = {
  tree: EvolutionTreeNode
  currentPokemon: string
  locale: Locale
}

function EvolutionTree({ tree, currentPokemon, locale }: EvolutionTreeProps) {
  const stages = collectEvolutionStages(tree)
  const hasBranching = stages.some((stage) => stage.length > 1)

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="flex flex-col items-center gap-4 md:flex-row">
          {stageIndex > 0 && (
            <>
              <div className="font-heading text-2xl font-bold md:hidden" style={{ color: 'var(--text-secondary)' }}>
                ↓
              </div>
              <div className="hidden font-heading text-2xl font-bold md:block" style={{ color: 'var(--text-secondary)' }}>
                →
              </div>
            </>
          )}
          <div
            className={`flex flex-col items-center gap-2 md:flex-row ${hasBranching && stage.length > 1 ? 'rounded-2xl border-2 border-dashed p-2' : ''}`}
            style={hasBranching && stage.length > 1 ? { borderColor: 'var(--border-soft)' } : undefined}
          >
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex items-center">
                {pokemonIndex > 0 && stage.length > 1 && (
                  <span className="mx-2 hidden font-heading text-lg font-bold md:inline" style={{ color: 'var(--text-secondary)' }}>/</span>
                )}
                <EvolutionCard
                  name={pokemon.name}
                  speciesUrl={pokemon.speciesUrl}
                  isCurrentPokemon={pokemon.name === currentPokemon}
                  locale={locale}
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
  locale: Locale
}

function EvolutionCard({ name, speciesUrl, isCurrentPokemon, locale }: EvolutionCardProps) {
  const evoId = speciesUrl.split('/').slice(-2, -1)[0]

  return (
    <a
      href={`/${locale}/pokemon/${name}`}
      className="glass-card rounded-2xl p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md"
      style={isCurrentPokemon ? {
        background: 'var(--bg-card-hover)',
        boxShadow: '0 0 0 2px var(--text-secondary)',
      } : undefined}
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
        <p className="font-heading text-base font-bold capitalize">
          {getPokemonName(name)}
        </p>
      </div>
    </a>
  )
}

function collectEvolutionStages(
  tree: EvolutionTreeNode
): { name: string; speciesUrl: string }[][] {
  const stages: { name: string; speciesUrl: string }[][] = []

  function traverse(node: EvolutionTreeNode, depth: number) {
    if (!stages[depth]) {
      stages[depth] = []
    }

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
