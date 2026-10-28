import { useEffect, useMemo, useRef, useState } from 'react'
import { GenerationSelect } from '@/components/GenerationSelect'
import { PokemonPicker } from '@/components/PokemonPicker'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import { officialArtworkUrl, optimizedImageUrl } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type StatBattleProps = {
  locale: Locale
}

type Reel = {
  pokemon: PokemonRecord
  kept: boolean
  rolling: boolean
}

type Phase = 'pick' | 'playing' | 'done'

type BattleRecord = {
  at: number
  targetId: number
  targetTotal: number
  total: number
  cards: number[]
}

const HISTORY_KEY = 'poke-astro:battle:history'
const HISTORY_SIZE = 50
const LOSS_COLOR = '#f43f5e'
const TIE_COLOR = '#f59e0b'

function readHistory(): BattleRecord[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

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
const TICK_MS = 120
const STRIP_SIZE = 24
const WIN_COLOR = '#10b981'

const randomOf = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)]
const sumStats = (pokemon: PokemonRecord) =>
  pokemon.stats.reduce((total, stat) => total + stat, 0)
const reelTotal = (reels: Reel[]) =>
  reels.reduce((total, reel, i) => total + reel.pokemon.stats[i], 0)
const artwork = (pokemon: PokemonRecord, size: number) =>
  optimizedImageUrl(officialArtworkUrl(pokemon.id), size)

export function StatBattle({ locale }: StatBattleProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [target, setTarget] = useState<PokemonRecord | null>(null)
  const [reels, setReels] = useState<Reel[]>([])
  const [phase, setPhase] = useState<Phase>('pick')
  const [strip, setStrip] = useState<PokemonRecord[]>([])
  const [redrawUsed, setRedrawUsed] = useState(false)
  const [tick, setTick] = useState(0)
  const timers = useRef<number[]>([])
  const [history, setHistory] = useState<BattleRecord[]>([])
  const [onlyWins, setOnlyWins] = useState(false)
  const recorded = useRef(false)
  const byId = useMemo(
    () => new Map(index.map((p) => [p.id, p] as const)),
    [index]
  )

  useEffect(() => setHistory(readHistory()), [])

  useEffect(() => {
    if (phase !== 'done' || !target || recorded.current) return
    recorded.current = true
    const record: BattleRecord = {
      at: Date.now(),
      targetId: target.id,
      targetTotal: sumStats(target),
      total: reelTotal(reels),
      cards: reels.map((reel) => reel.pokemon.id),
    }
    const next = [record, ...history].slice(0, HISTORY_SIZE)
    setHistory(next)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  }, [phase, target, reels, history])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const [generation, setGeneration] = useState(0)
  const defaults = index.filter((p) => p.isDefault)
  const pool = defaults.filter(
    (p) => generation === 0 || p.generation === generation
  )
  const rolling = reels.some((reel) => reel.rolling)

  useEffect(() => {
    if (!rolling) return
    const id = window.setInterval(() => setTick((n) => n + 1), TICK_MS)
    return () => window.clearInterval(id)
  }, [rolling])

  const preload = (pokemon: PokemonRecord[]) => {
    for (const p of pokemon) new Image().src = artwork(p, 112)
  }
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
    preload(landing)
    setStrip((shown) => [...shown, ...landing].slice(-STRIP_SIZE))
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
    const seed = Array.from({ length: REEL_COUNT }, () => randomOf(pool))
    preload(seed)
    setStrip(seed)
    setRedrawUsed(false)
    recorded.current = false
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

  const redrawAll = () => {
    if (phase !== 'playing' || rolling || redrawUsed) return
    setRedrawUsed(true)
    spin(reels)
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
  const result =
    diff > 0 ? t.battle.win : diff < 0 ? t.battle.lose : t.battle.tie
  const outcome = (record: BattleRecord) =>
    record.total > record.targetTotal
      ? { label: t.battle.resultWin, color: WIN_COLOR }
      : record.total < record.targetTotal
        ? { label: t.battle.resultLose, color: LOSS_COLOR }
        : { label: t.battle.resultTie, color: TIE_COLOR }
  const wins = history.filter((r) => r.total > r.targetTotal).length
  const shownHistory = onlyWins
    ? history.filter((r) => r.total > r.targetTotal)
    : history
  const dateFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <PokemonPicker
            index={index}
            locale={locale}
            placeholder={t.battle.pick}
            autoFocus={!target}
            onPick={start}
          />
        </div>
        <button
          type="button"
          onClick={() => start(randomOf(defaults))}
          disabled={loading || defaults.length === 0}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50 dark:bg-dark-primary"
        >
          {t.battle.random}
        </button>
        <GenerationSelect
          value={generation}
          onChange={setGeneration}
          locale={locale}
          label={t.battle.reelGen}
        />
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
                {t.battle.target}
              </p>
              <p className="text-3xl font-black text-ink tabular-nums dark:text-dark-ink">
                {targetTotal}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink-muted dark:text-dark-ink-muted">
                {t.battle.yours}
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
          {loading ? t.battle.loading : t.battle.intro}
        </p>
      )}

      {reels.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
          {reels.map((reel, i) => {
            const reelAccent = reel.pokemon.accent ?? accent
            const shown =
              reel.rolling && strip.length > 0
                ? strip[(tick + i * 5) % strip.length]
                : reel.pokemon
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
                    key={reel.rolling ? 'rolling' : reel.pokemon.id}
                    src={artwork(shown, 112)}
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
                    title={t.battle.reroll}
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
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-center text-sm text-ink-muted dark:text-dark-ink-muted"
            aria-live="polite"
          >
            {rolling ? t.battle.spinning : t.battle.hint}{' '}
            <span className="font-mono">
              {keptCount}/{REEL_COUNT}
            </span>
          </p>
          <button
            type="button"
            onClick={redrawAll}
            disabled={rolling || redrawUsed}
            className="rounded-full border-2 border-black/[0.08] bg-white px-5 py-2 text-sm font-semibold text-ink transition-all hover:border-primary/40 active:scale-95 disabled:cursor-default disabled:opacity-40 dark:border-white/[0.1] dark:bg-dark-surface dark:text-dark-ink"
          >
            ↻ {t.battle.redraw}{' '}
            <span className="font-mono opacity-60">{redrawUsed ? 0 : 1}/1</span>
          </button>
        </div>
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
              {t.battle.again}
            </button>
            <button
              type="button"
              onClick={() => start(randomOf(defaults))}
              className="rounded-full border-2 border-black/[0.08] bg-white px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:border-primary/40 active:scale-95 dark:border-white/[0.1] dark:bg-dark-surface dark:text-dark-ink"
            >
              {t.battle.random}
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <section className="space-y-3 border-t border-black/[0.06] pt-6 dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-ink dark:text-dark-ink">
              {t.battle.history}{' '}
              <span className="font-mono text-xs text-ink-muted dark:text-dark-ink-muted">
                {wins}/{history.length}
              </span>
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-ink dark:text-dark-ink">
                <input
                  type="checkbox"
                  checked={onlyWins}
                  onChange={(e) => setOnlyWins(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                {t.battle.onlyWins}
              </label>
              <button
                type="button"
                onClick={clearHistory}
                className="text-ink-muted underline-offset-2 hover:underline dark:text-dark-ink-muted"
              >
                {t.battle.clearHistory}
              </button>
            </div>
          </div>
          {shownHistory.length === 0 ? (
            <p className="text-center text-sm text-ink-muted dark:text-dark-ink-muted">
              {t.battle.noWins}
            </p>
          ) : (
            <ul className="space-y-2">
              {shownHistory.map((record) => {
                const targetPokemon = byId.get(record.targetId)
                const { label, color } = outcome(record)
                return (
                  <li
                    key={record.at}
                    className="flex items-center gap-3 rounded-2xl border-2 bg-white p-2 pr-3 dark:bg-dark-surface"
                    style={{ borderColor: `${color}80` }}
                  >
                    <button
                      type="button"
                      onClick={() => targetPokemon && start(targetPokemon)}
                      disabled={!targetPokemon}
                      title={t.battle.again}
                      className="shrink-0 rounded-xl bg-surface-sunken p-1 transition-transform hover:scale-110 dark:bg-dark-raised"
                    >
                      <img
                        src={optimizedImageUrl(
                          officialArtworkUrl(record.targetId),
                          48
                        )}
                        alt=""
                        className="h-12 w-12 object-contain"
                        loading="lazy"
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink dark:text-dark-ink">
                        {targetPokemon?.names[locale] ?? `#${record.targetId}`}
                      </p>
                      <p className="text-xs text-ink-muted dark:text-dark-ink-muted">
                        {dateFormat.format(record.at)}
                      </p>
                    </div>
                    <div className="hidden -space-x-2 sm:flex">
                      {record.cards.map((id, i) => (
                        <img
                          key={STAT_LABEL_KEYS[i]}
                          src={optimizedImageUrl(officialArtworkUrl(id), 28)}
                          alt={byId.get(id)?.names[locale] ?? ''}
                          title={`${t.stats[STAT_LABEL_KEYS[i]]}: ${byId.get(id)?.stats[i] ?? '?'}`}
                          className="h-7 w-7 rounded-full bg-white object-contain ring-2 ring-white dark:bg-dark-raised dark:ring-dark-surface"
                          loading="lazy"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-sm text-ink tabular-nums dark:text-dark-ink">
                      {record.total} vs {record.targetTotal}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                      style={{ background: color }}
                    >
                      {label}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
