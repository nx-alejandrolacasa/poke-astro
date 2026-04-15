import type { EvolutionDetail, EvolutionTreeNode } from '@utils/pokemon'
import { getPokemonName } from '@utils/pokemon'
import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import type { Translations } from '@/utils/translations'
import { interpolate, translations } from '@/utils/translations'

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

  // Highest base stat ever recorded per stat category — used to scale each
  // bar so the visual fill reflects how strong the Pokémon is for that stat.
  const maxStatByName: Record<string, number> = {
    hp: 255, // Blissey
    attack: 190, // Mega Mewtwo X / Mega Rayquaza
    defense: 230, // Shuckle
    'special-attack': 194, // Mega Mewtwo Y
    'special-defense': 230, // Shuckle
    speed: 200, // Regieleki
  }
  const totalStats = stats.reduce((sum, s) => sum + s.baseStat, 0)

  const statsCell = (
    <div className="bento-cell rounded-2xl bg-white p-4 md:col-span-1 dark:bg-dark-surface">
      <h2 className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
        {t.pokemon.baseStats}
      </h2>
      <div className="space-y-3">
        {stats.map(({ name, translatedName, baseStat }, index) => {
          const maxStat = maxStatByName[name] ?? 255
          const percentage = Math.min(100, (baseStat / maxStat) * 100)
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
        <h2 className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
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
        <div className="bento-cell flex flex-col rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
          <h2 className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
            {t.pokemon.evolutionChain}
          </h2>
          <div className="flex flex-1 items-center justify-center">
            <EvolutionTree
              tree={
                data.evolutionTree as NonNullable<typeof data.evolutionTree>
              }
              currentPokemon={pokemonName}
              locale={locale}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/** Translate an item name using the static lookup, falling back to title-case. */
function translateItem(name: string, t: Translations): string {
  return t.evolutionItems[name] ?? getPokemonName(name)
}

/** Translate a type name using the existing types map, falling back to title-case. */
function translateType(name: string, t: Translations): string {
  return (t.types as Record<string, string>)[name] ?? getPokemonName(name)
}

/** Translate time of day. */
function translateTime(name: string, t: Translations): string {
  return t.timeOfDay[name] ?? getPokemonName(name)
}

/**
 * Pick the best single evolution method from a set of details.
 * The API returns one entry per game-version method (e.g. Leafeon has
 * location-based in Gen IV AND item-based in Gen VIII). We prefer:
 *   use-item > level-up with level > trade > other
 * This keeps the UI compact — one condition line per evolution.
 */
function pickBestEvolutionDetail(details: EvolutionDetail[]): EvolutionDetail | null {
  if (!details || details.length === 0) return null
  if (details.length === 1) return details[0]

  // Prefer use-item (simplest to explain)
  const itemDetail = details.find((d) => d.trigger?.name === 'use-item' && d.item)
  if (itemDetail) return itemDetail

  // Prefer level-up with a specific level
  const levelDetail = details.find((d) => d.trigger?.name === 'level-up' && d.min_level)
  if (levelDetail) return levelDetail

  // Prefer trade
  const tradeDetail = details.find((d) => d.trigger?.name === 'trade')
  if (tradeDetail) return tradeDetail

  // Prefer level-up with happiness/affection (no level)
  const happyDetail = details.find((d) => d.trigger?.name === 'level-up' && (d.min_happiness || d.min_affection))
  if (happyDetail) return happyDetail

  // Fall back to the last entry (usually the most modern method)
  return details[details.length - 1]
}

/**
 * Build a human-readable list of evolution condition labels from EvolutionDetail.
 * Only processes the single best method to keep the UI clean.
 */
function getEvolutionConditionLabels(
  details: EvolutionDetail[],
  t: Translations
): string[] {
  const d = pickBestEvolutionDetail(details)
  if (!d) return []
  const labels: string[] = []

  const trigger = d.trigger?.name

  if (trigger === 'level-up') {
    if (d.min_level) labels.push(interpolate(t.pokemon.evolveLevel, { level: d.min_level }))
  } else if (trigger === 'use-item' && d.item) {
    labels.push(interpolate(t.pokemon.evolveItem, { item: translateItem(d.item.name, t) }))
  } else if (trigger === 'trade') {
    if (d.trade_species) {
      labels.push(interpolate(t.pokemon.evolveTradeWith, { species: getPokemonName(d.trade_species.name) }))
    } else {
      labels.push(t.pokemon.evolveTrade)
    }
  }

  if (d.min_happiness) labels.push(interpolate(t.pokemon.evolveHappiness, { value: d.min_happiness }))
  if (d.min_affection) labels.push(interpolate(t.pokemon.evolveAffection, { value: d.min_affection }))
  if (d.min_beauty) labels.push(interpolate(t.pokemon.evolveBeauty, { value: d.min_beauty }))
  if (d.held_item) labels.push(interpolate(t.pokemon.evolveHeldItem, { item: translateItem(d.held_item.name, t) }))
  if (d.known_move) labels.push(interpolate(t.pokemon.evolveKnownMove, { move: getPokemonName(d.known_move.name) }))
  if (d.known_move_type) labels.push(interpolate(t.pokemon.evolveKnownMoveType, { type: translateType(d.known_move_type.name, t) }))
  if (d.time_of_day) labels.push(interpolate(t.pokemon.evolveTimeOfDay, { time: translateTime(d.time_of_day, t) }))
  if (d.needs_overworld_rain) labels.push(t.pokemon.evolveRain)
  if (d.turn_upside_down) labels.push(t.pokemon.evolveUpsideDown)
  if (d.party_species) labels.push(interpolate(t.pokemon.evolvePartySpecies, { species: getPokemonName(d.party_species.name) }))
  if (d.party_type) labels.push(interpolate(t.pokemon.evolvePartyType, { type: translateType(d.party_type.name, t) }))
  if (d.gender === 1) labels.push(t.pokemon.evolveGenderFemale)
  if (d.gender === 2) labels.push(t.pokemon.evolveGenderMale)
  if (d.relative_physical_stats === 1) labels.push(t.pokemon.evolvePhysicalStatsHigher)
  if (d.relative_physical_stats === 0) labels.push(t.pokemon.evolvePhysicalStatsEqual)
  if (d.relative_physical_stats === -1) labels.push(t.pokemon.evolvePhysicalStatsLower)

  return labels
}

type EvolutionTreeProps = {
  tree: EvolutionTreeNode
  currentPokemon: string
  locale: Locale
}

function EvolutionTree({ tree, currentPokemon, locale }: EvolutionTreeProps) {
  const t = translations[locale]
  const stages = collectEvolutionStages(tree)
  const hasBranching = stages.some((stage) => stage.length > 1)

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${!hasBranching ? 'md:flex-row md:gap-1' : ''}`}
    >
      {stages.map((stage, stageIndex) => (
        <div
          key={`stage-${stageIndex.toString()}`}
          className={`flex flex-col items-center gap-2 ${!hasBranching ? 'md:flex-row md:gap-1' : ''}`}
        >
          {stageIndex > 0 && (
            <>
              {/* Mobile: vertical arrow + conditions */}
              <div className={`flex flex-col items-center gap-0.5 ${!hasBranching ? 'md:hidden' : ''}`}>
                {stage.length === 1 && stage[0].evolutionDetails.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1">
                    {getEvolutionConditionLabels(stage[0].evolutionDetails, t).map((label) => (
                      <span key={label} className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-[10px] dark:bg-dark-primary/10 dark:text-dark-primary">
                        {label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="font-bold text-xl text-ink-faint dark:text-dark-ink-faint">
                  &darr;
                </div>
              </div>
              {/* Desktop: horizontal arrow + conditions */}
              {!hasBranching && (
                <div className="hidden flex-col items-center gap-0.5 md:flex">
                  {stage.length === 1 && stage[0].evolutionDetails.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1">
                      {getEvolutionConditionLabels(stage[0].evolutionDetails, t).map((label) => (
                        <span key={label} className="rounded-full bg-primary/10 px-2 py-0.5 text-primary text-[10px] dark:bg-dark-primary/10 dark:text-dark-primary">
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="font-bold text-xl text-ink-faint dark:text-dark-ink-faint">
                    &rarr;
                  </div>
                </div>
              )}
            </>
          )}
          {hasBranching && stage.length > 1 ? (
            <div className="rounded-xl border-2 border-ink-faint/30 border-dashed p-2 dark:border-dark-ink-faint/30">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {stage.map((pokemon) => (
                  <EvolutionCard
                    key={pokemon.name}
                    name={pokemon.name}
                    speciesUrl={pokemon.speciesUrl}
                    isCurrentPokemon={pokemon.name === currentPokemon}
                    locale={locale}
                    conditionLabels={getEvolutionConditionLabels(pokemon.evolutionDetails, t)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 md:flex-row">
              {stage.map((pokemon) => (
                <EvolutionCard
                  key={pokemon.name}
                  name={pokemon.name}
                  speciesUrl={pokemon.speciesUrl}
                  isCurrentPokemon={pokemon.name === currentPokemon}
                  locale={locale}
                />
              ))}
            </div>
          )}
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
  conditionLabels?: string[]
}

function EvolutionCard({
  name,
  speciesUrl,
  isCurrentPokemon,
  locale,
  conditionLabels,
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
        {conditionLabels && conditionLabels.length > 0 && (
          <div className="mt-1 flex flex-wrap justify-center gap-0.5">
            {conditionLabels.map((label) => (
              <span
                key={label}
                className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-[9px] leading-tight dark:bg-dark-primary/10 dark:text-dark-primary"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  )
}

type EvolutionStageEntry = {
  name: string
  speciesUrl: string
  evolutionDetails: EvolutionDetail[]
}

function collectEvolutionStages(
  tree: EvolutionTreeNode
): EvolutionStageEntry[][] {
  const stages: EvolutionStageEntry[][] = []
  function traverse(node: EvolutionTreeNode, depth: number) {
    if (!stages[depth]) stages[depth] = []
    if (!stages[depth].some((p) => p.name === node.name)) {
      stages[depth].push({
        name: node.name,
        speciesUrl: node.speciesUrl,
        evolutionDetails: node.evolutionDetails ?? [],
      })
    }
    for (const child of node.evolvesTo) traverse(child, depth + 1)
  }
  traverse(tree, 0)
  return stages
}
