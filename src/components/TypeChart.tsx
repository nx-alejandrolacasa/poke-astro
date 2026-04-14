import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'
import type { PokemonType } from '@/utils/typeEffectiveness'
import {
  ALL_TYPES,
  GEN1_TYPES,
  getAttackMatchups,
  getDefenseMatchups,
  getEffectiveness,
} from '@/utils/typeEffectiveness'

type TypeChartProps = {
  locale: Locale
}

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

function getTypeAbbrev(type: PokemonType, locale: Locale): string {
  const t = translations[locale]
  const name = t.types[type] ?? type
  return name.slice(0, 3).toUpperCase()
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
      className={`inline-flex items-center gap-1.5 rounded-xl font-semibold capitalize transition-all duration-200 ${sizeClasses[size]} ${
        selected
          ? 'scale-105 shadow-lg ring-2 ring-white ring-offset-2 ring-offset-ink'
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
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? '#1a1a2e' : '#ffffff'
}

function tintColor(hex: string, amount: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const tr = Math.round(r + (255 - r) * amount)
  const tg = Math.round(g + (255 - g) * amount)
  const tb = Math.round(b + (255 - b) * amount)
  return `#${tr.toString(16).padStart(2, '0')}${tg.toString(16).padStart(2, '0')}${tb.toString(16).padStart(2, '0')}`
}

function shadeColor(hex: string, amount: number): string {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const sr = Math.round(r * (1 - amount))
  const sg = Math.round(g * (1 - amount))
  const sb = Math.round(b * (1 - amount))
  return `#${sr.toString(16).padStart(2, '0')}${sg.toString(16).padStart(2, '0')}${sb.toString(16).padStart(2, '0')}`
}

function useIsDark() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const el = document.documentElement
    setIsDark(el.classList.contains('dark'))
    const observer = new MutationObserver(() =>
      setIsDark(el.classList.contains('dark'))
    )
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return isDark
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
    bg = 'bg-emerald-500 dark:bg-emerald-600'
    text = 'text-white font-bold'
    label = '2'
  } else if (multiplier === 0.5) {
    bg = 'bg-orange-400 dark:bg-orange-500'
    text = 'text-white font-semibold'
    label = '½'
  } else if (multiplier === 0) {
    bg = 'bg-red-600 dark:bg-red-700'
    text = 'text-white font-bold'
    label = '0'
  } else {
    bg = 'bg-surface-sunken dark:bg-dark-raised'
    text = 'text-ink-faint/30 dark:text-dark-ink-faint/30'
    label = ''
  }

  const highlight =
    isHighlightedRow || isHighlightedCol
      ? 'ring-1 ring-inset ring-primary/30 dark:ring-primary/20'
      : ''

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[11px] transition-all duration-100 sm:h-9 sm:w-9 sm:text-xs md:h-10 md:w-10 md:text-sm ${bg} ${text} ${highlight} cursor-pointer hover:ring-2 hover:ring-primary/50`}
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
  const isDark = useIsDark()

  return (
    <div
      className="chromatic-shadow-lg overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        border: `2px solid ${color}${isDark ? '40' : '30'}`,
        background: isDark
          ? `linear-gradient(135deg, ${shadeColor(color, 0.85)} 0%, #12122a 100%)`
          : `linear-gradient(135deg, ${tintColor(color, 0.92)} 0%, white 100%)`,
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 md:px-6 md:py-4"
        style={{ backgroundColor: `${color}${isDark ? '18' : '12'}` }}
      >
        <TypeBadge type={type} size="lg" locale={locale} />
        <span
          className="font-semibold text-[10px] uppercase tracking-widest"
          style={{ color }}
        >
          {locale === 'es' ? 'Relaciones de tipo' : 'Type matchups'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:p-6">
        <div
          className="space-y-3 rounded-xl bg-red-50/50 p-3 dark:bg-red-500/10"
          style={{ border: `1px solid ${isDark ? '#ef444440' : '#ef444420'}` }}
        >
          <h3 className="font-bold text-[10px] text-red-500 uppercase tracking-widest">
            {locale === 'es' ? 'Atacando' : 'Attacking'}
          </h3>
          <div className="space-y-2">
            <MatchupGroup
              label={locale === 'es' ? 'Super eficaz' : 'Super effective'}
              multiplier="2×"
              accentColor="#10b981"
              types={attack.superEffective}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Poco eficaz' : 'Not very effective'}
              multiplier="½×"
              accentColor="#f59e0b"
              types={attack.notVeryEffective}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Sin efecto' : 'No effect'}
              multiplier="0×"
              accentColor="#ef4444"
              types={attack.noEffect}
              locale={locale}
              onTypeClick={onTypeClick}
            />
          </div>
        </div>

        <div
          className="space-y-3 rounded-xl bg-blue-50/50 p-3 dark:bg-blue-500/10"
          style={{ border: `1px solid ${isDark ? '#3b82f640' : '#3b82f620'}` }}
        >
          <h3 className="font-bold text-[10px] text-blue-500 uppercase tracking-widest">
            {locale === 'es' ? 'Defendiendo' : 'Defending'}
          </h3>
          <div className="space-y-2">
            <MatchupGroup
              label={locale === 'es' ? 'Debil contra' : 'Weak to'}
              multiplier="2×"
              accentColor="#ef4444"
              types={defense.weakTo}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Resistente a' : 'Resistant to'}
              multiplier="½×"
              accentColor="#10b981"
              types={defense.resistantTo}
              locale={locale}
              onTypeClick={onTypeClick}
            />
            <MatchupGroup
              label={locale === 'es' ? 'Inmune a' : 'Immune to'}
              multiplier="0×"
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
          className="inline-flex h-5 items-center justify-center rounded-lg px-1.5 font-bold font-mono text-[10px] text-white"
          style={{ backgroundColor: accentColor }}
        >
          {multiplier}
        </span>
        <span className="font-medium text-xs" style={{ color: accentColor }}>
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

  const types = useMemo(() => (gen1 ? [...GEN1_TYPES] : [...ALL_TYPES]), [gen1])

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
    <div className="space-y-8 pb-8 md:space-y-10 md:pb-12">
      <section className="space-y-4 pt-6 text-center md:pt-8">
        <h1 className="font-bold text-3xl text-ink tracking-tight md:text-4xl dark:text-dark-ink">
          {locale === 'es' ? 'Tabla de Tipos' : 'Type Chart'}
        </h1>
        <p className="mx-auto max-w-2xl text-ink-muted text-sm md:text-base dark:text-dark-ink-muted">
          {locale === 'es'
            ? 'Descubre las fortalezas y debilidades de cada tipo de Pokemon. Toca un tipo para explorar sus relaciones.'
            : 'Discover the strengths and weaknesses of every Pokemon type. Tap a type to explore its matchups.'}
        </p>
      </section>

      <div className="flex justify-center">
        <div className="chromatic-shadow-sm inline-flex rounded-xl bg-white p-1 dark:bg-dark-surface">
          <button
            type="button"
            onClick={() => setGen1(false)}
            className={`rounded-lg px-4 py-2 font-semibold text-xs transition-all duration-200 ${
              !gen1
                ? 'bg-surface-sunken text-primary shadow-sm dark:bg-dark-raised dark:text-primary'
                : 'text-ink-muted hover:text-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
            }`}
          >
            {locale === 'es' ? 'Moderno' : 'Modern'}
            <span className="ml-1.5 opacity-60">(18)</span>
          </button>
          <button
            type="button"
            onClick={() => setGen1(true)}
            className={`rounded-lg px-4 py-2 font-semibold text-xs transition-all duration-200 ${
              gen1
                ? 'bg-surface-sunken text-primary shadow-sm dark:bg-dark-raised dark:text-primary'
                : 'text-ink-muted hover:text-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'
            }`}
          >
            Gen I<span className="ml-1.5 opacity-60">(15)</span>
          </button>
        </div>
      </div>

      {gen1 && (
        <div className="mx-auto max-w-2xl rounded-xl bg-amber-50 p-3 text-center text-amber-800 text-xs dark:bg-amber-500/10 dark:text-amber-400">
          {locale === 'es' ? (
            <>
              <strong>Gen I:</strong> Sin tipos Siniestro, Acero ni Hada.
              Fantasma no afectaba a Psiquico, Bicho era super eficaz contra
              Veneno, y Hielo no era resistido por Fuego.
            </>
          ) : (
            <>
              <strong>Gen I:</strong> No Dark, Steel, or Fairy types. Ghost had
              no effect on Psychic, Bug was super effective against Poison, and
              Ice was not resisted by Fire.
            </>
          )}
        </div>
      )}

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

      <section className="space-y-4">
        <h2 className="text-center font-semibold text-ink-muted text-xs uppercase tracking-widest dark:text-dark-ink-muted">
          {locale === 'es' ? 'Matriz Completa' : 'Full Matrix'}
        </h2>
        <p className="text-center text-[10px] text-ink-faint md:text-xs dark:text-dark-ink-faint">
          {locale === 'es'
            ? 'Filas = atacante \u2022 Columnas = defensor'
            : 'Rows = attacker \u2022 Columns = defender'}
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-lg bg-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">
              2× {locale === 'es' ? 'Super eficaz' : 'Super effective'}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-lg bg-orange-400" />
            <span className="text-orange-500 dark:text-orange-400">
              ½× {locale === 'es' ? 'Poco eficaz' : 'Not very effective'}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-4 w-4 rounded-lg bg-red-600" />
            <span className="text-red-600 dark:text-red-400">
              0× {locale === 'es' ? 'Sin efecto' : 'No effect'}
            </span>
          </span>
        </div>

        <div className="chromatic-shadow overflow-x-auto rounded-2xl bg-white dark:bg-dark-surface">
          <div className="min-w-fit p-2 md:p-3">
            <table className="w-full border-separate border-spacing-0.5">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white dark:bg-dark-surface">
                    <div className="flex h-12 w-16 items-end justify-end p-1 sm:w-20 md:h-14 md:w-24">
                      <span className="font-mono text-[9px] text-ink-faint uppercase tracking-wider sm:text-[10px] md:text-xs dark:text-dark-ink-faint">
                        ATK&rarr;
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
                          className="block origin-bottom-left -rotate-55 whitespace-nowrap font-mono font-semibold text-[9px] sm:text-[10px] md:text-xs"
                          style={{ color: TYPE_COLORS[type] }}
                        >
                          {getTypeAbbrev(type, locale)}
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
                    <td className="sticky left-0 z-10 bg-white pr-1 dark:bg-dark-surface">
                      <button
                        type="button"
                        onClick={() => handleTypeClick(attacker)}
                        className="flex h-8 w-16 items-center justify-end gap-1 sm:h-9 sm:w-20 md:h-10 md:w-24"
                        title={t.types[attacker]}
                      >
                        <span
                          className="font-mono font-semibold text-[9px] sm:text-[10px] md:text-xs"
                          style={{ color: TYPE_COLORS[attacker] }}
                        >
                          {getTypeAbbrev(attacker, locale)}
                        </span>
                        <span
                          className="h-3.5 w-3.5 rounded-lg md:h-4 md:w-4"
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
