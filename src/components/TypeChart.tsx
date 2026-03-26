import { useCallback, useMemo, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import {
  ALL_TYPES,
  GEN1_TYPES,
  getAttackMatchups,
  getDefenseMatchups,
  getEffectiveness,
} from '@/utils/typeEffectiveness'
import type { PokemonType } from '@/utils/typeEffectiveness'

type TypeChartProps = {
  locale: Locale
}

/** Solid background colors for each type. */
const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
}

/** Short 3-letter labels for the compact matrix. */
const TYPE_ABBREV: Record<PokemonType, string> = {
  normal: 'NOR',
  fire: 'FIR',
  water: 'WAT',
  electric: 'ELE',
  grass: 'GRA',
  ice: 'ICE',
  fighting: 'FIG',
  poison: 'POI',
  ground: 'GRO',
  flying: 'FLY',
  psychic: 'PSY',
  bug: 'BUG',
  rock: 'ROC',
  ghost: 'GHO',
  dragon: 'DRA',
  dark: 'DAR',
  steel: 'STE',
  fairy: 'FAI',
}

function TypeBadge({
  type,
  label,
  size = 'md',
  selected = false,
  onClick,
  locale,
}: {
  type: PokemonType
  label?: string
  size?: 'sm' | 'md' | 'lg'
  selected?: boolean
  onClick?: () => void
  locale: Locale
}) {
  const t = translations[locale]
  const displayName = label ?? t.types[type]
  const color = TYPE_COLORS[type]

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm',
    lg: 'px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-sm font-mono font-semibold capitalize transition-all duration-200 ${sizeClasses[size]} ${
        selected
          ? 'scale-105 shadow-lg ring-2 ring-white ring-offset-2 ring-offset-gray-900'
          : 'hover:scale-105 hover:shadow-md'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      style={{
        backgroundColor: color,
        color: getContrastColor(color),
        boxShadow: selected ? `0 0 16px ${color}88` : undefined,
      }}
    >
      {displayName}
    </button>
  )
}

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff'
}

/** Returns a lighter tint of a hex color for backgrounds. */
function tintColor(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const tr = Math.round(r + (255 - r) * amount)
  const tg = Math.round(g + (255 - g) * amount)
  const tb = Math.round(b + (255 - b) * amount)
  return `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`
}

function EffectivenessCell({
  multiplier,
  attackerType,
  defenderType,
  isHighlightedRow,
  isHighlightedCol,
  onClick,
}: {
  multiplier: number
  attackerType: PokemonType
  defenderType: PokemonType
  isHighlightedRow: boolean
  isHighlightedCol: boolean
  onClick: () => void
}) {
  let bg: string
  let text: string
  let label: string

  if (multiplier === 2) {
    bg = 'bg-emerald-500 dark:bg-neon-green'
    text = 'text-white dark:text-dex-bg font-bold'
    label = '2'
  } else if (multiplier === 0.5) {
    bg = 'bg-orange-400 dark:bg-neon-amber'
    text = 'text-white dark:text-dex-bg font-semibold'
    label = '\u00bd'
  } else if (multiplier === 0) {
    bg = 'bg-red-700 dark:bg-neon-red'
    text = 'text-white dark:text-dex-bg font-bold'
    label = '0'
  } else {
    bg = 'bg-gray-100 dark:bg-dex-surface/50'
    text = 'text-gray-300 dark:text-gray-700'
    label = ''
  }

  const highlight =
    isHighlightedRow || isHighlightedCol
      ? 'ring-1 ring-inset ring-primary/30 dark:ring-neon-cyan/20'
      : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-sm font-mono text-[11px] transition-all duration-100 sm:h-9 sm:w-9 sm:text-xs md:h-10 md:w-10 md:text-sm ${bg} ${text} ${highlight} cursor-pointer hover:ring-2 hover:ring-primary/60 dark:hover:ring-neon-cyan/40`}
      title={`${attackerType} \u2192 ${defenderType}: ${multiplier}x`}
      aria-label={`${attackerType} attacking ${defenderType}: ${multiplier}x effectiveness`}
    >
      {label}
    </button>
  )
}

function DetailPanel({
  type,
  gen1,
  locale,
  onTypeClick,
}: {
  type: PokemonType
  gen1: boolean
  locale: Locale
  onTypeClick: (t: PokemonType) => void
}) {
  const attack = getAttackMatchups(type, gen1)
  const defense = getDefenseMatchups(type, gen1)
  const color = TYPE_COLORS[type]

  return (
    <div
      className="hud-corners overflow-hidden rounded-sm shadow-lg transition-all duration-300"
      style={{
        border: `2px solid ${color}40`,
        background: `linear-gradient(135deg, ${tintColor(color, 0.92)} 0%, white 100%)`,
      }}
    >
      {/* Colored header bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4"
        style={{ backgroundColor: `${color}15` }}
      >
        <TypeBadge type={type} size="lg" locale={locale} />
        <span className="font-display text-[10px] uppercase tracking-widest" style={{ color }}>
          {locale === 'es' ? 'Relaciones de tipo' : 'Type matchups'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
        {/* Attacking */}
        <div
          className="space-y-3 rounded-sm p-3"
          style={{ backgroundColor: '#ef444415', border: '1px solid #ef444425' }}
        >
          <h3
            className="font-display text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#dc2626' }}
          >
            {locale === 'es' ? 'Atacando' : 'Attacking'}
          </h3>
          <div className="space-y-2">
            <MatchupGroup
              label={locale === 'es' ? 'Super eficaz' : 'Super effective'}
              multiplier="2\u00d7"
              accentColor="#10b981"
              types={attack.superEffective}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Poco eficaz' : 'Not very effective'}
              multiplier="\u00bd\u00d7"
              accentColor="#f59e0b"
              types={attack.notVeryEffective}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Sin efecto' : 'No effect'}
              multiplier="0\u00d7"
              accentColor="#ef4444"
              types={attack.noEffect}
              locale={locale}
              onTypeClick={onTypeClick}
            />
          </div>
        </div>

        {/* Defending */}
        <div
          className="space-y-3 rounded-sm p-3"
          style={{ backgroundColor: '#3b82f615', border: '1px solid #3b82f625' }}
        >
          <h3
            className="font-display text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#2563eb' }}
          >
            {locale === 'es' ? 'Defendiendo' : 'Defending'}
          </h3>
          <div className="space-y-2">
            <MatchupGroup
              label={locale === 'es' ? 'D\u00e9bil contra' : 'Weak to'}
              multiplier="2\u00d7"
              accentColor="#ef4444"
              types={defense.weakTo}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Resistente a' : 'Resistant to'}
              multiplier="\u00bd\u00d7"
              accentColor="#10b981"
              types={defense.resistantTo}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Inmune a' : 'Immune to'}
              multiplier="0\u00d7"
              accentColor="#8b5cf6"
              types={defense.immuneTo}
              locale={locale}
              onTypeClick={onTypeClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MatchupGroup({
  label,
  multiplier,
  accentColor,
  types,
  locale,
  onTypeClick,
}: {
  label: string
  multiplier: string
  accentColor: string
  types: PokemonType[]
  locale: Locale
  onTypeClick: (t: PokemonType) => void
}) {
  if (types.length === 0) return null

  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <span
          className="inline-flex h-5 items-center justify-center rounded-sm px-1.5 font-mono text-[10px] font-bold text-white"
          style={{ backgroundColor: accentColor }}
        >
          {multiplier}
        </span>
        <span className="font-mono text-xs font-medium" style={{ color: accentColor }}>
          {label} ({types.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {types.map((type) => (
          <TypeBadge
            key={type}
            type={type}
            size="sm"
            locale={locale}
            onClick={() => onTypeClick(type)}
          />
        ))}
      </div>
    </div>
  )
}

export function TypeChart({ locale }: TypeChartProps) {
  const t = translations[locale]
  const [gen1, setGen1] = useState(false)
  const [selectedType, setSelectedType] = useState<PokemonType>('fire')
  const [hoveredRow, setHoveredRow] = useState<PokemonType | null>(null)
  const [hoveredCol, setHoveredCol] = useState<PokemonType | null>(null)

  const types = useMemo(
    () => (gen1 ? [...GEN1_TYPES] : [...ALL_TYPES]),
    [gen1]
  )

  // Auto-correct selected type when switching to Gen 1
  const effectiveSelected = useMemo(() => {
    if (types.includes(selectedType)) return selectedType
    return 'fire' as PokemonType
  }, [types, selectedType])

  const handleTypeClick = useCallback((type: PokemonType) => {
    setSelectedType(type)
  }, [])

  const handleCellClick = useCallback((attacker: PokemonType) => {
    setSelectedType(attacker)
  }, [])

  return (
    <div className="space-y-6 pb-8 md:space-y-8 md:pb-12">
      {/* Header */}
      <section className="space-y-4 pt-4 text-center md:pt-6">
        <h1 className="font-display font-bold text-xl uppercase tracking-wider text-gray-900 md:text-3xl dark:bg-gradient-to-r dark:from-neon-green dark:via-neon-cyan dark:to-neon-purple dark:bg-clip-text dark:text-transparent">
          {locale === 'es' ? 'Tabla de Tipos' : 'Type Chart'}
        </h1>
        <p className="mx-auto max-w-2xl text-sm md:text-base" style={{ color: '#6b7280' }}>
          {locale === 'es'
            ? 'Descubre las fortalezas y debilidades de cada tipo de Pok\u00e9mon. Toca un tipo para explorar sus relaciones.'
            : 'Discover the strengths and weaknesses of every Pok\u00e9mon type. Tap a type to explore its matchups.'}
        </p>
      </section>

      {/* Generation Toggle */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-sm border border-gray-200 p-1 dark:border-dex-border dark:bg-dex-surface">
          <button
            type="button"
            onClick={() => setGen1(false)}
            className={`rounded-sm px-4 py-2 font-mono text-xs font-semibold transition-all duration-200 ${
              !gen1
                ? 'bg-primary-50 text-primary-600 shadow-sm dark:bg-primary/10 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(51,255,51,0.15)]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {locale === 'es' ? 'Moderno' : 'Modern'}
            <span className="ml-1.5 opacity-60">(18)</span>
          </button>
          <button
            type="button"
            onClick={() => setGen1(true)}
            className={`rounded-sm px-4 py-2 font-mono text-xs font-semibold transition-all duration-200 ${
              gen1
                ? 'bg-primary-50 text-primary-600 shadow-sm dark:bg-primary/10 dark:text-neon-cyan dark:shadow-[0_0_8px_rgba(51,255,51,0.15)]'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            Gen I
            <span className="ml-1.5 opacity-60">(15)</span>
          </button>
        </div>
      </div>

      {/* Gen 1 info banner */}
      {gen1 && (
        <div className="mx-auto max-w-2xl rounded-sm border border-amber-300 bg-amber-50 p-3 text-center font-mono text-amber-800 text-xs dark:border-neon-amber/30 dark:bg-neon-amber/5 dark:text-neon-amber">
          {locale === 'es' ? (
            <>
              <strong>Gen I:</strong> Sin tipos Siniestro, Acero ni Hada. Fantasma no afectaba a Ps{"í"}quico, Bicho era super eficaz contra Veneno, y Hielo no era resistido por Fuego.
            </>
          ) : (
            <>
              <strong>Gen I:</strong> No Dark, Steel, or Fairy types. Ghost had no effect on Psychic, Bug was super effective against Poison, and Ice was not resisted by Fire.
            </>
          )}
        </div>
      )}

      {/* Type Selector Grid */}
      <section>
        <div className="flex flex-wrap justify-center gap-2">
          {types.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              size="md"
              selected={effectiveSelected === type}
              onClick={() => handleTypeClick(type)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Detail Panel */}
      {effectiveSelected && (
        <section>
          <DetailPanel
            type={effectiveSelected}
            gen1={gen1}
            locale={locale}
            onTypeClick={handleTypeClick}
          />
        </section>
      )}

      {/* Matrix Section */}
      <section className="space-y-3">
        <h2 className="text-center font-display text-xs font-bold uppercase tracking-widest text-gray-800 md:text-sm dark:text-primary/70">
          {locale === 'es' ? 'Matriz Completa' : 'Full Matrix'}
        </h2>
        <p className="text-center font-mono text-gray-400 text-[10px] md:text-xs dark:text-gray-500">
          {locale === 'es'
            ? 'Filas = atacante \u2022 Columnas = defensor'
            : 'Rows = attacker \u2022 Columns = defender'}
        </p>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 font-mono text-[10px] md:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-sm bg-emerald-500 dark:bg-neon-green" />
            <span className="text-emerald-700 dark:text-neon-green">
              {"2\u00d7"} {locale === 'es' ? 'Super eficaz' : 'Super effective'}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-sm bg-orange-400 dark:bg-neon-amber" />
            <span className="text-orange-600 dark:text-neon-amber">
              {"\u00bd\u00d7"} {locale === 'es' ? 'Poco eficaz' : 'Not very effective'}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-sm bg-red-700 dark:bg-neon-red" />
            <span className="text-red-700 dark:text-neon-red">
              {"0\u00d7"} {locale === 'es' ? 'Sin efecto' : 'No effect'}
            </span>
          </span>
        </div>

        {/* Scrollable Matrix */}
        <div className="overflow-x-auto rounded-sm border border-gray-200 bg-white shadow-lg dark:border-dex-border dark:bg-dex-surface">
          <div className="min-w-fit p-2 md:p-3">
            <table className="border-separate border-spacing-0.5">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white dark:bg-dex-surface">
                    <div className="flex h-12 w-16 items-end justify-end p-1 sm:w-20 md:h-14 md:w-24">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-primary-500 sm:text-[10px] md:text-xs dark:text-primary/40">
                        {"ATK\u2192"}
                      </span>
                    </div>
                  </th>
                  {types.map((type) => (
                    <th
                      key={type}
                      className="p-0"
                      onMouseEnter={() => setHoveredCol(type)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      <button
                        type="button"
                        onClick={() => handleTypeClick(type)}
                        className="flex h-12 w-8 items-end justify-center pb-1 sm:w-9 md:h-14 md:w-10"
                        title={t.types[type]}
                      >
                        <span
                          className="block origin-bottom-left -rotate-55 whitespace-nowrap font-mono text-[9px] font-semibold sm:text-[10px] md:text-xs"
                          style={{ color: TYPE_COLORS[type] }}
                        >
                          {TYPE_ABBREV[type]}
                        </span>
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {types.map((attacker) => (
                  <tr
                    key={attacker}
                    onMouseEnter={() => setHoveredRow(attacker)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="sticky left-0 z-10 bg-white pr-1 dark:bg-dex-surface">
                      <button
                        type="button"
                        onClick={() => handleTypeClick(attacker)}
                        className="flex h-8 w-16 items-center justify-end gap-1 sm:h-9 sm:w-20 md:h-10 md:w-24"
                        title={t.types[attacker]}
                      >
                        <span
                          className="font-mono text-[9px] font-semibold sm:text-[10px] md:text-xs"
                          style={{ color: TYPE_COLORS[attacker] }}
                        >
                          {TYPE_ABBREV[attacker]}
                        </span>
                        <span
                          className="h-3.5 w-3.5 rounded-sm md:h-4 md:w-4"
                          style={{ backgroundColor: TYPE_COLORS[attacker] }}
                        />
                      </button>
                    </td>

                    {types.map((defender) => {
                      const mult = getEffectiveness(attacker, defender, gen1)
                      return (
                        <td key={defender} className="p-0">
                          <EffectivenessCell
                            multiplier={mult}
                            attackerType={attacker}
                            defenderType={defender}
                            isHighlightedRow={hoveredRow === attacker}
                            isHighlightedCol={hoveredCol === defender}
                            onClick={() => handleCellClick(attacker)}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
