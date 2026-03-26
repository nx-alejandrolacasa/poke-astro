import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

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
  statsSection?: ReactNode
}

export function PokemonEnrichedData({ pokemonName, locale, statsSection }: PokemonEnrichedDataProps) {
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
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {statsSection}
        <div className="flex items-center justify-center rounded-sm border border-gray-200 bg-gray-50 p-8 dark:border-dex-border dark:bg-dex-surface">
          <div className="radar-loader" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {statsSection}
        <div className="rounded-sm border border-orange-300 bg-orange-50 p-4 text-center dark:border-neon-red/30 dark:bg-neon-red/5">
          <p className="text-orange-700 dark:text-neon-red">{t.errors.loadFailed}</p>
        </div>
      </div>
    )
  }

  const hasEvolutions = data.evolutions.length > 1 && data.evolutionTree

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {statsSection}
      <div className="hud-corners rounded-sm border border-gray-200 bg-gray-50 p-3 transition-colors dark:border-dex-border dark:bg-dex-surface">
        <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-gray-800 md:text-sm dark:text-primary/70">{t.pokemon.typeEffectiveness}</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-2">
          <div>
            <h3 className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-neon-red/80">{t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})</h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.weaknesses.map(({ type, multiplier }) => (
                  <span key={type} className="rounded-sm border border-orange-200 bg-orange-50 px-2 py-0.5 text-orange-800 text-xs capitalize dark:border-neon-red/30 dark:bg-neon-red/10 dark:font-mono dark:text-neon-red">{type} ({multiplier}x)</span>
                ))}
              </div>
            ) : <p className="text-gray-400 text-xs dark:text-gray-600">{t.pokemon.none}</p>}
          </div>
          <div>
            <h3 className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-neon-green/80">{t.pokemon.resistantTo} ({data.typeEffectiveness.resistances.length})</h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.resistances.map(({ type, multiplier }) => (
                  <span key={type} className="rounded-sm border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800 text-xs capitalize dark:border-neon-green/30 dark:bg-neon-green/10 dark:font-mono dark:text-neon-green">{type} ({multiplier}x)</span>
                ))}
              </div>
            ) : <p className="text-gray-400 text-xs dark:text-gray-600">{t.pokemon.none}</p>}
          </div>
          <div>
            <h3 className="mb-1 font-display text-[10px] font-bold uppercase tracking-widest text-primary-600 dark:text-neon-cyan/80">{t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})</h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span key={type} className="rounded-sm border border-primary-200 bg-primary-50 px-2 py-0.5 text-primary-800 text-xs capitalize dark:border-neon-cyan/30 dark:bg-neon-cyan/10 dark:font-mono dark:text-neon-cyan">{type} (0x)</span>
                ))}
              </div>
            ) : <p className="text-gray-400 text-xs dark:text-gray-600">{t.pokemon.none}</p>}
          </div>
        </div>
      </div>
      {hasEvolutions && (
        <div className="rounded-sm border border-gray-200 bg-gray-50 p-3 transition-colors md:col-span-2 dark:border-dex-border dark:bg-dex-surface">
          <h2 className="mb-2 font-display text-xs font-bold uppercase tracking-wider text-gray-800 md:text-sm dark:text-primary/70">{t.pokemon.evolutionChain}</h2>
          <EvolutionTree tree={data.evolutionTree!} currentPokemon={pokemonName} locale={locale} />
        </div>
      )}
    </div>
  )
}

type EvolutionTreeProps = { tree: EvolutionTreeNode; currentPokemon: string; locale: Locale }

function EvolutionTree({ tree, currentPokemon, locale }: EvolutionTreeProps) {
  const stages = collectEvolutionStages(tree)
  const hasBranching = stages.some((stage) => stage.length > 1)

  return (
    <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:flex-wrap">
      {stages.map((stage, stageIndex) => (
        <div key={stageIndex} className="flex flex-col items-center gap-4 md:flex-row">
          {stageIndex > 0 && (
            <>
              <div className="font-mono font-bold text-gray-400 text-2xl md:hidden dark:text-primary/40">↓</div>
              <div className="hidden font-mono font-bold text-gray-400 text-2xl md:block dark:text-primary/40">→</div>
            </>
          )}
          <div className={`flex flex-col items-center gap-2 md:flex-row ${hasBranching && stage.length > 1 ? 'rounded-sm border-2 border-dashed border-gray-300 p-2 dark:border-dex-border' : ''}`}>
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex items-center">
                {pokemonIndex > 0 && stage.length > 1 && <span className="mx-2 hidden font-mono font-bold text-gray-400 text-lg md:inline dark:text-dex-border">/</span>}
                <EvolutionCard name={pokemon.name} speciesUrl={pokemon.speciesUrl} isCurrentPokemon={pokemon.name === currentPokemon} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

type EvolutionCardProps = { name: string; speciesUrl: string; isCurrentPokemon: boolean; locale: Locale }

function EvolutionCard({ name, speciesUrl, isCurrentPokemon, locale }: EvolutionCardProps) {
  const evoId = speciesUrl.split('/').slice(-2, -1)[0]
  return (
    <a href={`/${locale}/pokemon/${name}`} className={`rounded-sm border-2 p-3 transition-all hover:scale-105 ${isCurrentPokemon ? 'border-primary-400 bg-primary-50 dark:border-primary dark:bg-primary/5' : 'border-gray-300 bg-white hover:border-primary-300 dark:border-dex-border dark:bg-dex-panel dark:hover:border-primary/50'}`}>
      <div className="text-center">
        {evoId && <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`} alt={name} className="mx-auto h-24 w-24 object-contain md:h-28 md:w-28" loading="lazy" />}
        <p className="font-semibold text-gray-900 text-sm capitalize dark:font-mono dark:text-xs dark:uppercase dark:tracking-wider dark:text-gray-200">{getPokemonName(name)}</p>
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
