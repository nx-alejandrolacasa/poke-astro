import { useEffect, useState } from 'react'
import { PokemonPicker } from '@/components/PokemonPicker'
import { StatRadar } from '@/components/StatRadar'
import { TypeBadge } from '@/components/TypeBadge'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import {
  officialArtworkUrl,
  optimizedImageUrl,
  STAT_NAMES,
  typeColors,
} from '@/utils/pokemon'
import { interpolate, translations } from '@/utils/translations'
import { getEffectiveness, type PokemonType } from '@/utils/typeEffectiveness'

type ComparePokemonProps = {
  locale: Locale
}

const STAT_LABEL_KEYS = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
] as const

/** Best multiplier the attacker's own types can deal against the defender. */
function bestAttack(attacker: PokemonRecord, defender: PokemonRecord): number {
  return Math.max(
    ...attacker.types.map((at) =>
      defender.types.reduce(
        (m, dt) =>
          m * getEffectiveness(at as PokemonType, dt as PokemonType, false),
        1
      )
    )
  )
}

function accentOf(p: PokemonRecord): string {
  return p.accent ?? typeColors[p.types[0]] ?? '#a8a878'
}

export function ComparePokemon({ locale }: ComparePokemonProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [a, setA] = useState<PokemonRecord | null>(null)
  const [b, setB] = useState<PokemonRecord | null>(null)

  useEffect(() => {
    if (index.length === 0) return
    const params = new URLSearchParams(window.location.search)
    const find = (slug: string | null) =>
      index.find((p) => p.name === slug) ?? null
    setA(find(params.get('a')))
    setB(find(params.get('b')))
  }, [index])

  useEffect(() => {
    if (index.length === 0) return
    const params = new URLSearchParams()
    if (a) params.set('a', a.name)
    if (b) params.set('b', b.name)
    const query = params.toString()
    history.replaceState(null, '', query ? `?${query}` : location.pathname)
  }, [a, b, index.length])

  const side = (
    pokemon: PokemonRecord | null,
    set: (p: PokemonRecord | null) => void,
    label: string
  ) => (
    <div className="space-y-3">
      <PokemonPicker
        index={index}
        locale={locale}
        placeholder={loading ? t.search.loading : label}
        onPick={set}
      />
      {pokemon ? (
        <div
          className="rounded-2xl bg-white p-4 text-center dark:bg-dark-surface"
          style={{
            border: `2px solid ${accentOf(pokemon)}`,
            backgroundImage: `radial-gradient(circle at 50% 35%, ${accentOf(pokemon)}33, transparent 65%)`,
          }}
        >
          <img
            src={optimizedImageUrl(officialArtworkUrl(pokemon.id), 160)}
            alt={pokemon.names[locale]}
            className="mx-auto h-32 w-32 object-contain md:h-40 md:w-40"
          />
          <a
            href={`/${locale}/pokemon/${pokemon.name}`}
            className="mt-1 block text-lg font-bold text-ink hover:underline dark:text-dark-ink"
            title={t.compare.openDetail}
          >
            {pokemon.names[locale]}
          </a>
          <div className="mt-1 flex justify-center gap-1">
            {pokemon.types.map((type) => (
              <TypeBadge
                key={type}
                type={type}
                label={(t.types as Record<string, string>)[type] ?? type}
                size="sm"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex aspect-square max-h-56 items-center justify-center rounded-2xl border-2 border-dashed border-ink-faint/30 text-sm text-ink-faint dark:border-dark-ink-faint/30 dark:text-dark-ink-faint">
          {t.compare.pick}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {side(a, setA, t.compare.first)}
        {side(b, setB, t.compare.second)}
      </div>

      {(a || b) && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => {
              setA(b)
              setB(a)
            }}
            className="rounded-full bg-surface-sunken px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-primary/10 dark:bg-dark-raised dark:text-dark-ink"
          >
            ⇄ {t.compare.swap}
          </button>
        </div>
      )}

      {a && b && <Comparison a={a} b={b} locale={locale} />}
    </div>
  )
}

type ComparisonProps = { a: PokemonRecord; b: PokemonRecord; locale: Locale }

function Comparison({ a, b, locale }: ComparisonProps) {
  const t = translations[locale]
  const statLabels = STAT_LABEL_KEYS.map((key) => t.stats[key])
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      <div className="rounded-2xl bg-white p-4 dark:bg-dark-surface">
        <StatRadar
          labels={statLabels}
          series={[a, b].map((p) => ({
            stats: p.stats,
            color: accentOf(p),
            label: p.names[locale],
          }))}
        />
        <div className="mt-2 flex justify-center gap-4 text-xs">
          {[a, b].map((p) => (
            <span key={p.id} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: accentOf(p) }}
              />
              {p.names[locale]}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-4 dark:bg-dark-surface">
        {STAT_NAMES.map((_, i) => {
          const [va, vb] = [a.stats[i], b.stats[i]]
          const max = Math.max(va, vb, 1)
          return (
            <div
              key={statLabels[i]}
              className="grid grid-cols-[36px_1fr_auto_1fr_36px] items-center gap-2 text-xs"
            >
              <span
                className={`text-right font-mono ${va >= vb ? 'font-bold text-ink dark:text-dark-ink' : 'text-ink-muted dark:text-dark-ink-muted'}`}
              >
                {va}
              </span>
              <div className="flex h-2 justify-end overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(va / max) * 100}%`,
                    backgroundColor: accentOf(a),
                  }}
                />
              </div>
              <span className="w-16 text-center text-ink-muted dark:text-dark-ink-muted">
                {statLabels[i]}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(vb / max) * 100}%`,
                    backgroundColor: accentOf(b),
                  }}
                />
              </div>
              <span
                className={`font-mono ${vb >= va ? 'font-bold text-ink dark:text-dark-ink' : 'text-ink-muted dark:text-dark-ink-muted'}`}
              >
                {vb}
              </span>
            </div>
          )
        })}
        <div className="grid grid-cols-[36px_1fr_auto_1fr_36px] items-center gap-2 border-t border-surface-sunken pt-3 text-xs font-bold dark:border-dark-raised">
          <span className="text-right font-mono text-ink dark:text-dark-ink">
            {a.stats.reduce((s, v) => s + v, 0)}
          </span>
          <span />
          <span className="w-16 text-center text-ink uppercase dark:text-dark-ink">
            {t.compare.total}
          </span>
          <span />
          <span className="font-mono text-ink dark:text-dark-ink">
            {b.stats.reduce((s, v) => s + v, 0)}
          </span>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 md:col-span-2 dark:bg-dark-surface">
        <h2 className="mb-3 font-sans text-xs font-bold tracking-wider text-primary uppercase dark:text-dark-primary">
          {t.compare.matchup}
        </h2>
        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          {[
            [a, b],
            [b, a],
          ].map(([atk, def]) => {
            const multiplier = bestAttack(atk, def)
            const tone =
              multiplier > 1
                ? 'bg-orange-50 text-orange-800 dark:bg-orange-500/10 dark:text-orange-300'
                : multiplier < 1
                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-surface-sunken text-ink dark:bg-dark-raised dark:text-dark-ink'
            return (
              <p key={atk.id} className={`rounded-xl px-3 py-2 ${tone}`}>
                <b>{atk.names[locale]}</b>{' '}
                {interpolate(t.compare.dealsTo, { multiplier })}{' '}
                <b>{def.names[locale]}</b>
              </p>
            )
          })}
        </div>
      </div>
    </div>
  )
}
