import { useEffect, useRef, useState } from 'react'
import { PokemonPicker } from '@/components/PokemonPicker'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import { officialArtworkUrl, optimizedImageUrl } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type StatSlotsProps = {
  locale: Locale
}

type Reel = {
  pokemon: PokemonRecord
  kept: boolean
  rolling: boolean
}

type Phase = 'pick' | 'playing' | 'done'

const STAT_LABEL_KEYS = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed',
] as const
const REEL_COUNT = STAT_LABEL_KEYS.length
const ROLL_MS = 700
const STAGGER_MS = 150
const WIN_COLOR = '#10b981'

const randomOf = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)]
const sumStats = (pokemon: PokemonRecord) =>
  pokemon.stats.reduce((total, stat) => total + stat, 0)
const reelTotal = (reels: Reel[]) =>
  reels.reduce((total, reel, i) => total + reel.pokemon.stats[i], 0)
const artwork = (pokemon: PokemonRecord, size: number) =>
  optimizedImageUrl(officialArtworkUrl(pokemon.id), size)

export function StatSlots({ locale }: StatSlotsProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [target, setTarget] = useState<PokemonRecord | null>(null)
  const [reels, setReels] = useState<Reel[]>([])
  const [phase, setPhase] = useState<Phase>('pick')
  const timers = useRef<number[]>([])

  const pool = index.filter((p) => p.isDefault)
  const rolling = reels.some((reel) => reel.rolling)
  const keptCount = reels.filter((reel) => reel.kept).length

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id)
    timers.current = []
  }
  useEffect(() => {
    const pending = timers
    return () => {
      for (const id of pending.current) window.clearTimeout(id)
    }
  }, [])

  const spin = (
    current: Reel[],
    targets = current.flatMap((reel, i) => (reel.kept ? [] : [i])),
    candidates = pool
  ) => {
    const openCount = current.filter((reel) => !reel.kept).length
    const landing = targets.map(() => randomOf(candidates))
    for (const pokemon of landing) new Image().src = artwork(pokemon, 112)
    setReels(
      current.map((reel, i) =>
        targets.includes(i) ? { ...reel, rolling: true } : reel
      )
    )
    targets.forEach((reelIndex, order) => {
      const stop = window.setTimeout(
        () => {
          setReels((rs) =>
            rs.map((reel, i) =>
              i === reelIndex
                ? { pokemon: landing[order], kept: false, rolling: false }
                : reel
            )
          )
          if (order === targets.length - 1 && openCount === 1) {
            setReels((rs) => rs.map((reel) => ({ ...reel, kept: true })))
            setPhase('done')
          }
        },
        ROLL_MS + order * STAGGER_MS
      )
      timers.current.push(stop)
    })
  }

  const start = (pokemon: PokemonRecord) => {
    clearTimers()
    setTarget(pokemon)
    setPhase('playing')
    spin(
      Array.from({ length: REEL_COUNT }, () => ({
        pokemon,
        kept: false,
        rolling: false,
      }))
    )
  }

  const shownIds = reels.map((reel) => reel.pokemon.id)
  const repeatedIds = new Set(
    shownIds.filter((id, i) => shownIds.indexOf(id) !== i)
  )

  const keep = (reelIndex: number) => {
    if (phase !== 'playing' || rolling || reels[reelIndex].kept) return
    if (repeatedIds.has(reels[reelIndex].pokemon.id)) {
      const others = new Set(shownIds.filter((_, i) => i !== reelIndex))
      spin(
        reels,
        [reelIndex],
        pool.filter((p) => !others.has(p.id))
      )
      return
    }
    const next = reels.map((reel, i) =>
      i === reelIndex ? { ...reel, kept: true } : reel
    )
    if (next.every((reel) => reel.kept)) {
      setReels(next)
      setPhase('done')
    } else {
      spin(next)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key)
      if (n >= 1 && n <= REEL_COUNT) keep(n - 1)
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'done' && target) {
        e.preventDefault()
        start(target)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const targetTotal = target ? sumStats(target) : 0
  const total = reels.length ? reelTotal(reels) : 0
  const diff = total - targetTotal
  const ahead = diff >= 0
  const accent = target?.accent ?? '#705898'
  const result = diff > 0 ? t.slots.win : diff < 0 ? t.slots.lose : t.slots.tie

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <PokemonPicker
            index={index}
            locale={locale}
            placeholder={t.slots.pick}
            autoFocus={!target}
            onPick={start}
          />
        </div>
        <button
          type="button"
          onClick={() => start(randomOf(pool))}
          disabled={loading || pool.length === 0}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50 dark:bg-dark-primary"
        >
          🎲 {t.slots.random}
        </button>
      </div>

      {target ? (
        <div
          className="rounded-3xl border-2 bg-white p-5 transition-colors dark:bg-dark-surface"
          style={{
            borderColor: accent,
            backgroundImage: `radial-gradient(circle at 15% 50%, ${accent}33, transparent 55%)`,
          }}
        >
          <div className="flex items-center gap-4">
            <a href={`/${locale}/pokemon/${target.name}`} className="shrink-0">
              <img
                src={artwork(target, 96)}
                alt={target.names[locale]}
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
            </a>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-bold text-ink dark:text-dark-ink">
                {target.names[locale]}
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {STAT_LABEL_KEYS.map((key, i) => (
                  <span
                    key={key}
                    className="rounded-full bg-surface-sunken px-2 py-0.5 font-mono text-[11px] text-ink-muted dark:bg-dark-raised dark:text-dark-ink-muted"
                  >
                    {t.stats[key]}{' '}
                    <b className="text-ink dark:text-dark-ink">
                      {target.stats[i]}
                    </b>
                  </span>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase dark:text-dark-ink-muted">
                {t.slots.target}
              </p>
              <p className="text-3xl font-black text-ink tabular-nums dark:text-dark-ink">
                {targetTotal}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink-muted dark:text-dark-ink-muted">
                {t.slots.yours}
              </span>
              <span
                className={`font-mono font-bold tabular-nums transition-colors ${ahead ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
                aria-live="polite"
              >
                {total} ({ahead ? '+' : ''}
                {diff})
              </span>
            </div>
            <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-surface-sunken dark:bg-dark-raised">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(100, (total / Math.max(1, targetTotal)) * 100)}%`,
                  background: ahead ? WIN_COLOR : accent,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-ink-muted dark:text-dark-ink-muted">
          {loading ? t.slots.loading : t.slots.intro}
        </p>
      )}

      {reels.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {reels.map((reel, i) => {
            const reelAccent = reel.pokemon.accent ?? accent
            const canKeep = phase === 'playing' && !rolling && !reel.kept
            return (
              <button
                key={STAT_LABEL_KEYS[i]}
                type="button"
                onClick={() => keep(i)}
                disabled={!canKeep}
                aria-label={`${t.stats[STAT_LABEL_KEYS[i]]}: ${reel.rolling ? '…' : reel.pokemon.stats[i]} · ${reel.pokemon.names[locale]}`}
                className={`relative flex flex-col items-center gap-1 overflow-hidden rounded-2xl border-2 bg-white p-2 text-center transition-all dark:bg-dark-surface ${
                  reel.kept
                    ? 'shadow-md'
                    : 'border-black/[0.08] dark:border-white/[0.1]'
                } ${canKeep ? 'cursor-pointer hover:-translate-y-1 hover:border-primary/50 hover:shadow-md active:scale-95 dark:hover:border-dark-primary/50' : 'cursor-default'}`}
                style={
                  reel.kept
                    ? {
                        borderColor: reelAccent,
                        backgroundImage: `radial-gradient(circle at 50% 35%, ${reelAccent}40, transparent 65%)`,
                      }
                    : undefined
                }
              >
                <span className="font-mono text-[10px] tracking-wide text-ink-muted uppercase dark:text-dark-ink-muted">
                  {t.stats[STAT_LABEL_KEYS[i]]}
                </span>
                <div className="aspect-square w-full">
                  <img
                    key={reel.pokemon.id}
                    src={artwork(reel.pokemon, 112)}
                    alt=""
                    className={`h-full w-full object-contain ${reel.rolling ? 'reel-rolling' : 'reel-land'}`}
                    draggable={false}
                  />
                </div>
                <span className="text-2xl font-black text-ink tabular-nums dark:text-dark-ink">
                  {reel.rolling ? '··' : reel.pokemon.stats[i]}
                </span>
                <span className="w-full truncate text-[11px] text-ink-muted dark:text-dark-ink-muted">
                  {reel.rolling ? ' ' : reel.pokemon.names[locale]}
                </span>
                {reel.kept ? (
                  <span
                    className="absolute top-1.5 right-1.5 rounded-full px-1.5 text-[10px] font-bold text-white"
                    style={{ background: reelAccent }}
                  >
                    ✓
                  </span>
                ) : !reel.rolling && repeatedIds.has(reel.pokemon.id) ? (
                  <span
                    className="absolute top-1.5 left-1.5 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-amber-950"
                    title={t.slots.reroll}
                  >
                    ↻
                  </span>
                ) : (
                  <span className="absolute top-1.5 left-2 font-mono text-[10px] text-ink-faint dark:text-dark-ink-faint">
                    {i + 1}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {phase === 'playing' && (
        <p
          className="text-center text-sm text-ink-muted dark:text-dark-ink-muted"
          aria-live="polite"
        >
          {rolling ? t.slots.spinning : t.slots.hint}{' '}
          <span className="font-mono">
            {keptCount}/{REEL_COUNT}
          </span>
        </p>
      )}

      {phase === 'done' && target && (
        <div
          className="space-y-4 rounded-3xl border-2 p-5 text-center"
          style={{
            borderColor: ahead ? WIN_COLOR : accent,
            backgroundImage: `radial-gradient(circle at 50% 0%, ${ahead ? WIN_COLOR : accent}33, transparent 70%)`,
          }}
        >
          <p className="text-2xl font-black text-ink dark:text-dark-ink">
            {result}
          </p>
          <p className="font-mono text-sm text-ink-muted dark:text-dark-ink-muted">
            {total} vs {targetTotal}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => start(target)}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 dark:bg-dark-primary"
            >
              {t.slots.again}
            </button>
            <button
              type="button"
              onClick={() => start(randomOf(pool))}
              className="rounded-full border-2 border-black/[0.08] bg-white px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:border-primary/40 active:scale-95 dark:border-white/[0.1] dark:bg-dark-surface dark:text-dark-ink"
            >
              🎲 {t.slots.random}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
