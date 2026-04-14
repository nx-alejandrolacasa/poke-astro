import type { EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
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

type StatData = {
  name: string
  translatedName: string
  baseStat: number
}

type PokemonEnrichedDataProps = {
  pokemonName: string
  locale: Locale
  typeColor?: string
  stats: StatData[]
}

export function PokemonEnrichedData({
  pokemonName,
  locale,
  typeColor,
  stats,
}: PokemonEnrichedDataProps) {
  const t = translations[locale]
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

  const maxStat = 255
  const totalStats = stats.reduce((sum, s) => sum + s.baseStat, 0)

  const statsCell = (
    <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-1 dark:bg-dark-surface">
      <h2 className="mb-4 font-bold text-ink text-base md:text-lg dark:text-dark-ink">
        {t.pokemon.baseStats}
      </h2>
      <div className="space-y-3">
        {stats.map(({ name, translatedName, baseStat }, index) => {
          const percentage = (baseStat / maxStat) * 100
          return (
            <div
              key={name}
              className="grid grid-cols-[2fr_36px_3fr] items-center gap-2 text-ink dark:text-dark-ink"
            >
              <div className="truncate text-right text-ink-muted text-xs dark:text-dark-ink-muted">
                {translatedName}
              </div>
              <div className="text-right font-bold font-mono text-xs">
                {baseStat}
              </div>
              <div className="flex items-center">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                  <div
                    className={`absolute top-0 left-0 h-2 rounded-full ${baseStat >= 100 ? 'bg-success' : baseStat >= 50 ? 'bg-warning' : 'bg-danger'}`}
                    style={{
                      width: `${percentage}%`,
                      transition: `width 0.6s ease-out ${index * 0.08}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
        <div className="mt-3 grid grid-cols-[2fr_36px_3fr] gap-2 border-surface-sunken border-t pt-3 dark:border-dark-raised">
          <div className="text-right font-bold text-ink text-xs uppercase dark:text-dark-ink">
            {t.pokemon.total}
          </div>
          <div className="text-right font-bold font-mono text-ink text-xs dark:text-dark-ink">
            {totalStats}
          </div>
          <div />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4"
        style={{ '--type-color': typeColor } as React.CSSProperties}
      >
        {statsCell}
        <div className="bento-cell flex items-center justify-center rounded-2xl bg-white p-8 dark:bg-dark-surface">
          <div className="prismatic-loader" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4"
        style={{ '--type-color': typeColor } as React.CSSProperties}
      >
        {statsCell}
        <div className="bento-cell rounded-2xl bg-orange-50 p-4 text-center dark:bg-orange-500/10">
          <p className="text-orange-700 dark:text-orange-400">
            {t.errors.loadFailed}
          </p>
        </div>
      </div>
    )
  }

  const hasEvolutions = data.evolutions.length > 1 && data.evolutionTree

  return (
    <div
      className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 md:gap-4"
      style={{ '--type-color': typeColor } as React.CSSProperties}
    >
      {/* ── Base Stats — 1/4 desktop, 1/2 tablet, full mobile ── */}
      {statsCell}

      {/* ── Type Effectiveness — 1/4 desktop, 1/2 tablet, full mobile ── */}
      <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-1 dark:bg-dark-surface">
        <h2 className="mb-3 font-bold text-ink text-base md:text-lg dark:text-dark-ink">
          {t.pokemon.typeEffectiveness}
        </h2>
        <div className="space-y-3">
          <div>
            <h3 className="mb-1.5 font-semibold text-xs text-orange-500 uppercase tracking-wider dark:text-orange-400">
              {t.pokemon.weakTo} ({data.typeEffectiveness.weaknesses.length})
            </h3>
            {data.typeEffectiveness.weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.weaknesses.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-lg bg-orange-50 px-2 py-0.5 text-orange-700 text-xs capitalize dark:bg-orange-500/10 dark:text-orange-400"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-ink-faint text-xs dark:text-dark-ink-faint">
                {t.pokemon.none}
              </p>
            )}
          </div>
          <div>
            <h3 className="mb-1.5 font-semibold text-xs text-emerald-500 uppercase tracking-wider dark:text-emerald-400">
              {t.pokemon.resistantTo} (
              {data.typeEffectiveness.resistances.length})
            </h3>
            {data.typeEffectiveness.resistances.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.resistances.map(
                  ({ type, multiplier }) => (
                    <span
                      key={type}
                      className="rounded-lg bg-emerald-50 px-2 py-0.5 text-emerald-700 text-xs capitalize dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      {type} ({multiplier}x)
                    </span>
                  )
                )}
              </div>
            ) : (
              <p className="text-ink-faint text-xs dark:text-dark-ink-faint">
                {t.pokemon.none}
              </p>
            )}
          </div>
          <div>
            <h3 className="mb-1.5 font-semibold text-xs text-violet-500 uppercase tracking-wider dark:text-violet-400">
              {t.pokemon.immuneTo} ({data.typeEffectiveness.immunities.length})
            </h3>
            {data.typeEffectiveness.immunities.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.typeEffectiveness.immunities.map((type) => (
                  <span
                    key={type}
                    className="rounded-lg bg-violet-50 px-2 py-0.5 text-violet-700 text-xs capitalize dark:bg-violet-500/10 dark:text-violet-400"
                  >
                    {type} (0x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-ink-faint text-xs dark:text-dark-ink-faint">
                {t.pokemon.none}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Evolution Chain — 2/4 desktop, full tablet, full mobile ── */}
      {hasEvolutions && (
        <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <h2 className="mb-3 font-bold text-ink text-base md:text-lg dark:text-dark-ink">
            {t.pokemon.evolutionChain}
          </h2>
          <EvolutionTree
            tree={data.evolutionTree as NonNullable<typeof data.evolutionTree>}
            currentPokemon={pokemonName}
            locale={locale}
          />
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
        <div
          key={`stage-${stageIndex.toString()}`}
          className="flex flex-col items-center gap-4 md:flex-row"
        >
          {stageIndex > 0 && (
            <>
              <div className="font-bold text-2xl text-ink-faint md:hidden dark:text-dark-ink-faint">
                &darr;
              </div>
              <div className="hidden font-bold text-2xl text-ink-faint md:block dark:text-dark-ink-faint">
                &rarr;
              </div>
            </>
          )}
          <div
            className={`flex flex-col items-center gap-2 md:flex-row ${hasBranching && stage.length > 1 ? 'rounded-xl border-2 border-ink-faint/30 border-dashed p-2 dark:border-dark-ink-faint/30' : ''}`}
          >
            {stage.map((pokemon, pokemonIndex) => (
              <div key={pokemon.name} className="flex items-center">
                {pokemonIndex > 0 && stage.length > 1 && (
                  <span className="mx-2 hidden font-bold text-ink-faint text-lg md:inline dark:text-dark-ink-faint">
                    /
                  </span>
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

function EvolutionCard({
  name,
  speciesUrl,
  isCurrentPokemon,
  locale,
}: EvolutionCardProps) {
  const evoId = speciesUrl.split('/').slice(-2, -1)[0]
  return (
    <a
      href={`/${locale}/pokemon/${name}`}
      className={`rounded-xl p-3 transition-all hover:scale-105 ${isCurrentPokemon ? 'bg-primary-50 ring-2 ring-primary dark:bg-primary/10' : 'bg-surface-sunken hover:ring-2 hover:ring-ink-faint/30 dark:bg-dark-raised dark:hover:ring-dark-ink-faint/30'}`}
    >
      <div className="text-center">
        {evoId && (
          <img
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoId}.png`}
            alt={name}
            className="mx-auto h-20 w-20 object-contain md:h-24 md:w-24"
            loading="lazy"
          />
        )}
        <p className="font-semibold text-ink text-sm capitalize dark:text-dark-ink">
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
    if (!stages[depth]) stages[depth] = []
    if (!stages[depth].some((p) => p.name === node.name)) {
      stages[depth].push({ name: node.name, speciesUrl: node.speciesUrl })
    }
    for (const child of node.evolvesTo) traverse(child, depth + 1)
  }
  traverse(tree, 0)
  return stages
}
