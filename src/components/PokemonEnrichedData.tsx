import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import { ptypeClass } from '@/utils/typeColors'

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
  primaryType?: string
  statsSection?: ReactNode
}

export function PokemonEnrichedData({ pokemonName, locale, primaryType, statsSection }: PokemonEnrichedDataProps) {
  const t = translations[locale]
  const [data, setData] = useState<EnrichedData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnrichedData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pokemon/${pokemonName}/enriched?lang=${locale}`)
        if (!response.ok) throw new Error('Failed to fetch enriched data')
        setData(await response.json())
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
        <div className={`${ptypeClass(primaryType || 'normal')} glass-card flex items-center justify-center rounded-3xl p-8 shadow-soft`}>
          <div className="pt-spinner h-10 w-10 rounded-full border-t-4 border-transparent pokeball-spin" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {statsSection}
        <div className={`${ptypeClass(primaryType || 'normal')} pt-bg flex items-center justify-center rounded-3xl p-6 text-center`}>
          <p className="pt-text">{t.errors.loadFailed}</p>
        </div>
      </div>
    )
  }

  const hasEvolutions = data.evolutions.length > 1 && data.evolutionTree

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {statsSection}

      {/* Type Effectiveness */}
      <div className="glass-card rounded-3xl p-4 shadow-soft md:p-5">
        <h2 className="mb-3 font-heading text-lg font-bold md:text-xl">{t.pokemon.typeEffectiveness}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
          {/* Weaknesses */}
          <div>
            <h3 className={`${ptypeClass('fire')} pt-accent-text mb-1.5 font-heading text-sm font-bold`}>
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.weaknesses.map(({ type, multiplier }) => (
                  <span key={type} className={`${ptypeClass(type)} pt-badge rounded-full px-2 py-0.5 text-sm font-medium capitalize`}>
                    {type} ({multiplier}x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="themed-text-secondary text-sm">{t.pokemon.none}</p>
            )}
          </div>

          {/* Resistances */}
          <div>
            <h3 className={`${ptypeClass('grass')} pt-accent-text mb-1.5 font-heading text-sm font-bold`}>
              {t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.resistances.map(({ type, multiplier }) => (
                  <span key={type} className={`${ptypeClass(type)} pt-badge rounded-full px-2 py-0.5 text-sm font-medium capitalize`}>
                    {type} ({multiplier}x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="themed-text-secondary text-sm">{t.pokemon.none}</p>
            )}
          </div>

          {/* Immunities */}
          <div>
            <h3 className={`${ptypeClass('steel')} pt-accent-text mb-1.5 font-heading text-sm font-bold`}>
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span key={type} className={`${ptypeClass(type)} pt-badge rounded-full px-2 py-0.5 text-sm font-medium capitalize`}>
                    {type} (0x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="themed-text-secondary text-sm">{t.pokemon.none}</p>
            )}
          </div>
        </div>
      </div>

      {/* Evolution Chain */}
      {hasEvolutions && (
        <div className="glass-card rounded-3xl p-4 shadow-soft md:col-span-2 md:p-5">
          <h2 className="mb-3 font-heading text-lg font-bold md:text-xl">{t.pokemon.evolutionChain}</h2>
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
              <div className="themed-text-secondary font-heading text-2xl font-bold md:hidden">↓</div>
              <div className="themed-text-secondary hidden font-heading text-2xl font-bold md:block">→</div>
            </>
          )}
          <div className={`flex flex-col items-center gap-2 md:flex-row ${hasBranching && stage.length > 1 ? 'themed-border rounded-2xl border-2 border-dashed p-2' : ''}`}>
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex items-center">
                {pokemonIndex > 0 && stage.length > 1 && (
                  <span className="themed-text-secondary mx-2 hidden font-heading text-lg font-bold md:inline">/</span>
                )}
                <EvolutionCard name={pokemon.name} speciesUrl={pokemon.speciesUrl} isCurrentPokemon={pokemon.name === currentPokemon} locale={locale} />
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
      className={`glass-card rounded-2xl p-3 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft-md ${isCurrentPokemon ? 'themed-bg-hover ring-2 ring-current opacity-90' : ''}`}
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
        <p className="font-heading text-base font-bold capitalize">{getPokemonName(name)}</p>
      </div>
    </a>
  )
}

function collectEvolutionStages(tree: EvolutionTreeNode): { name: string; speciesUrl: string }[][] {
  const stages: { name: string; speciesUrl: string }[][] = []
  function traverse(node: EvolutionTreeNode, depth: number) {
    if (!stages[depth]) stages[depth] = []
    if (!stages[depth].some((p) => p.name === node.name)) {
      stages[depth].push({ name: node.name, speciesUrl: node.speciesUrl })
    }
    for (const child of node.evolvesTo) traverse(child, depth + 1)
  }
  traverse(tree, 0)
  return stages
}
