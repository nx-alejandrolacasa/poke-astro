import { useEffect, useMemo, useRef, useState } from 'react'
import { BackButton } from '@/components/BackButton'
import { GenerationSelect } from '@/components/GenerationSelect'
import { PokemonPicker } from '@/components/PokemonPicker'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import { GENERATIONS } from '@/utils/generations'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import { officialArtworkUrl, optimizedImageUrl } from '@/utils/pokemon'
import type { Translations } from '@/utils/translations'
import { interpolate, translations } from '@/utils/translations'

type StatBattleProps = {
  locale: Locale
}

type Reel = {
  pokemon: PokemonRecord
  kept: boolean
  rolling: boolean
}

type Phase = 'setup' | 'playing' | 'done'
type Mode = 'classic' | 'survival' | 'legendary'

type BattleRecord = {
  at: number
  targetId: number
  targetTotal: number
  total: number
  cards: number[]
  generation: number
  mode?: Mode
  redraw?: boolean
}

const LAST_GENERATION = GENERATIONS[GENERATIONS.length - 1].id

function wonGenerations(history: BattleRecord[], targetId: number) {
  return new Set(
    history
      .filter((r) => r.targetId === targetId && r.total > r.targetTotal)
      .map((r) => r.generation)
  )
}

function highestUnlocked(won: Set<number>) {
  let generation = 1
  while (generation < LAST_GENERATION && won.has(generation)) generation++
  return generation
}

function clampGeneration(
  wanted: number,
  won: Set<number>,
  allUnlocked = GENERATIONS.every((g) => won.has(g.id))
) {
  if (allUnlocked) return wanted
  if (wanted === 0) return highestUnlocked(won)
  return Math.min(wanted, highestUnlocked(won))
}

const LEGENDARY_MIN_TOTAL = 500

const HISTORY_KEY = 'poke-astro:battle:history'
const SURVIVAL_KEY = 'poke-astro:battle:survival'
const HISTORY_SIZE = 50
const WIN_COLOR = '#10b981'
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

function readSurvivalBest(): Record<number, number> {
  try {
    const parsed = JSON.parse(localStorage.getItem(SURVIVAL_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
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
const ROLL_MS = 900
const STAGGER_MS = 180
const TICK_MS = 100
const STRIP_SIZE = 24

const randomOf = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)]
const sumStats = (pokemon: PokemonRecord) =>
  pokemon.stats.reduce((total, stat) => total + stat, 0)
const keptTotal = (reels: Reel[]) =>
  reels.reduce(
    (total, reel, i) => total + (reel.kept ? reel.pokemon.stats[i] : 0),
    0
  )
const artwork = (pokemon: PokemonRecord, size: number) =>
  optimizedImageUrl(officialArtworkUrl(pokemon.id), size)
const isWin = (record: BattleRecord) => record.total > record.targetTotal
const isLegendary = (pokemon: PokemonRecord) =>
  (pokemon.isLegendary || pokemon.isMythical) &&
  sumStats(pokemon) >= LEGENDARY_MIN_TOTAL

const PRIMARY_BUTTON =
  'rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50 dark:bg-dark-primary'
const SECONDARY_BUTTON =
  'rounded-full border-2 border-black/[0.08] bg-white px-6 py-2.5 text-sm font-semibold text-ink transition-all hover:border-primary/40 active:scale-95 disabled:cursor-default disabled:opacity-40 dark:border-white/[0.1] dark:bg-dark-surface dark:text-dark-ink'

type TargetCardProps = {
  target: PokemonRecord
  locale: Locale
  t: Translations
  total?: number
  badge?: string
}

function TargetCard({ target, locale, t, total, badge }: TargetCardProps) {
  const accent = target.accent ?? '#705898'
  const targetTotal = sumStats(target)
  const diff = (total ?? 0) - targetTotal
  const ahead = diff >= 0
  return (
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
                <b className="text-ink dark:text-dark-ink">{target.stats[i]}</b>
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          {badge && (
            <p className="mb-1 rounded-full bg-amber-100 px-2 py-0.5 font-mono text-[11px] text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">
              {badge}
            </p>
          )}
          <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase dark:text-dark-ink-muted">
            {t.battle.target}
          </p>
          <p className="text-3xl font-black text-ink tabular-nums dark:text-dark-ink">
            {targetTotal}
          </p>
        </div>
      </div>
      {total !== undefined && (
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
      )}
    </div>
  )
}

export function StatBattle({ locale }: StatBattleProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [target, setTarget] = useState<PokemonRecord | null>(null)
  const [reels, setReels] = useState<Reel[]>([])
  const [phase, setPhase] = useState<Phase>('setup')
  const [strip, setStrip] = useState<PokemonRecord[]>([])
  const [redrawUsed, setRedrawUsed] = useState(false)
  const [generation, setGeneration] = useState(0)
  const [legendGen, setLegendGen] = useState(1)
  const [mode, setMode] = useState<Mode>('classic')
  const [streak, setStreak] = useState(0)
  const [survivalBest, setSurvivalBest] = useState<Record<number, number>>({})
  const [tick, setTick] = useState(0)
  const timers = useRef<number[]>([])
  const [history, setHistory] = useState<BattleRecord[]>([])
  const [onlyWins, setOnlyWins] = useState(false)
  const recorded = useRef(false)
  const byId = useMemo(
    () => new Map(index.map((p) => [p.id, p] as const)),
    [index]
  )

  useEffect(() => {
    setHistory(readHistory())
    setSurvivalBest(readSurvivalBest())
  }, [])

  useEffect(() => {
    if (phase !== 'done' || !target || recorded.current) return
    recorded.current = true
    const record: BattleRecord = {
      at: Date.now(),
      targetId: target.id,
      targetTotal: sumStats(target),
      total: keptTotal(reels),
      cards: reels.map((reel) => reel.pokemon.id),
      generation,
      ...(mode !== 'classic' ? { mode } : {}),
      ...(redrawUsed ? { redraw: true } : {}),
    }
    const next = [record, ...history].slice(0, HISTORY_SIZE)
    setHistory(next)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
    if (mode === 'survival' && isWin(record)) {
      const run = streak + 1
      setStreak(run)
      if (run > (survivalBest[generation] ?? 0)) {
        const best = { ...survivalBest, [generation]: run }
        setSurvivalBest(best)
        localStorage.setItem(SURVIVAL_KEY, JSON.stringify(best))
      }
    }
  }, [
    phase,
    target,
    reels,
    history,
    generation,
    mode,
    streak,
    survivalBest,
    redrawUsed,
  ])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }

  const defaults = index.filter((p) => p.isDefault)
  const poolFor = (gen: number) =>
    defaults.filter((p) => gen === 0 || p.generation === gen)
  const pool = poolFor(generation)
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

  const legendaries = defaults.filter(isLegendary)
  const beaten = (pokemon: PokemonRecord) =>
    history.some(
      (r) =>
        r.targetId === pokemon.id &&
        isWin(r) &&
        r.generation === pokemon.generation
    )
  const gauntletCleared = legendaries.length > 0 && legendaries.every(beaten)
  const won = target ? wonGenerations(history, target.id) : new Set<number>()
  const unlockedUpTo = target ? highestUnlocked(won) : LAST_GENERATION
  const allUnlocked =
    !target || gauntletCleared || GENERATIONS.every((g) => won.has(g.id))

  const choose = (pokemon: PokemonRecord) => {
    setTarget(pokemon)
    const wonForPokemon = wonGenerations(history, pokemon.id)
    setGeneration(
      clampGeneration(
        generation,
        wonForPokemon,
        gauntletCleared || GENERATIONS.every((g) => wonForPokemon.has(g.id))
      )
    )
  }

  const chooseLegendary = (pokemon: PokemonRecord) => {
    setTarget(pokemon)
    setGeneration(pokemon.generation)
  }

  const beginBattle = (pokemon: PokemonRecord, gen: number) => {
    clearTimers()
    setTarget(pokemon)
    setPhase('playing')
    setGeneration(gen)
    const candidates = poolFor(gen)
    const seed = Array.from({ length: REEL_COUNT }, () => randomOf(candidates))
    preload(seed)
    setStrip(seed)
    setRedrawUsed(false)
    recorded.current = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
    spin(
      Array.from({ length: REEL_COUNT }, () => ({
        pokemon,
        kept: false,
        rolling: false,
      })),
      undefined,
      candidates
    )
  }

  const startBattle = () => {
    if (!target) return
    beginBattle(
      target,
      mode === 'legendary'
        ? target.generation
        : clampGeneration(generation, won, allUnlocked)
    )
  }

  const nextOpponent = () =>
    beginBattle(randomOf(poolFor(generation)), generation)

  const startSurvival = () => {
    setStreak(0)
    nextOpponent()
  }

  const backToSetup = () => {
    clearTimers()
    setReels([])
    setPhase('setup')
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    setStreak(0)
    if (next === 'classic') choose(target ?? randomOf(defaults))
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
      if ((e.key === 'Enter' || e.key === ' ') && phase === 'done') {
        e.preventDefault()
        if (mode !== 'survival') startBattle()
        else if (diff > 0) nextOpponent()
        else startSurvival()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const targetTotal = target ? sumStats(target) : 0
  const total = reels.length ? keptTotal(reels) : 0
  const diff = total - targetTotal
  const ahead = diff >= 0
  const accent = target?.accent ?? '#705898'
  const result =
    diff > 0 ? t.battle.win : diff < 0 ? t.battle.lose : t.battle.tie
  const outcome = (record: BattleRecord) =>
    isWin(record)
      ? { label: t.battle.resultWin, color: WIN_COLOR }
      : record.total < record.targetTotal
        ? { label: t.battle.resultLose, color: LOSS_COLOR }
        : { label: t.battle.resultTie, color: TIE_COLOR }
  const wins = history.filter(isWin).length
  const wonBefore = target
    ? wonGenerations(
        history.filter((r) => r.at !== history[0]?.at),
        target.id
      )
    : won
  const justUnlocked =
    phase === 'done' &&
    diff > 0 &&
    generation > 0 &&
    !wonBefore.has(generation) &&
    won.has(generation)
  const unlockMessage = !justUnlocked
    ? null
    : generation === LAST_GENERATION
      ? t.battle.unlockedAll
      : interpolate(t.battle.unlocked, {
          gen: GENERATIONS.find((g) => g.id === generation + 1)?.roman ?? '',
        })
  const shownHistory = onlyWins ? history.filter(isWin) : history
  const dateFormat = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  if (phase === 'setup') {
    return (
      <>
        <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
          <BackButton locale={locale} />
        </div>
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h1 className="pokemon-title text-2xl md:text-4xl">
              {t.battle.title}
            </h1>
            <p className="mt-2 text-sm text-ink-muted dark:text-dark-ink-muted">
              {t.battle.subtitle}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={t.battle.mode}
            className="mx-auto flex w-fit rounded-full bg-surface-sunken p-1 dark:bg-dark-raised"
          >
            {(['classic', 'legendary', 'survival'] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${mode === m ? 'bg-white text-ink shadow-sm dark:bg-dark-surface dark:text-dark-ink' : 'text-ink-muted hover:text-ink dark:text-dark-ink-muted dark:hover:text-dark-ink'}`}
              >
                {m === 'classic' ? '⚔️ ' : m === 'legendary' ? '★ ' : '🔥 '}
                {t.battle[m]}
              </button>
            ))}
          </div>

          {mode === 'survival' ? (
            <>
              <section className="space-y-3 rounded-3xl bg-white p-5 dark:bg-dark-surface">
                <h2 className="font-bold text-ink dark:text-dark-ink">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-xs text-white dark:bg-dark-primary">
                    1
                  </span>
                  {t.battle.reelGen}
                </h2>
                <p className="text-xs text-ink-muted dark:text-dark-ink-muted">
                  {t.battle.survivalHint}
                </p>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {[
                    { id: 0, label: t.quiz.allGens },
                    ...GENERATIONS.map((gen) => ({
                      id: gen.id,
                      label: `${t.quiz.gen} ${gen.roman} · ${gen.region}`,
                    })),
                  ].map((option) => {
                    const active = generation === option.id
                    const best = survivalBest[option.id] ?? 0
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setGeneration(option.id)}
                        disabled={loading}
                        className={`flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-2 text-left text-sm transition-all active:scale-[0.98] ${active ? 'border-primary bg-primary-50 text-ink dark:border-dark-primary dark:bg-primary/10 dark:text-dark-ink' : 'border-transparent bg-surface-sunken text-ink hover:border-black/[0.08] dark:bg-dark-raised dark:text-dark-ink dark:hover:border-white/[0.1]'}`}
                      >
                        <span className="font-medium">{option.label}</span>
                        <span
                          className={`shrink-0 font-mono text-xs ${best > 0 ? 'text-ink dark:text-dark-ink' : 'text-ink-faint dark:text-dark-ink-faint'}`}
                          title={t.battle.bestStreak}
                        >
                          🏆 <b>{best}</b>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={startSurvival}
                  disabled={loading || defaults.length === 0}
                  className={`${PRIMARY_BUTTON} px-10 py-3 text-base`}
                >
                  🔥 {t.battle.fight}
                </button>
              </div>
            </>
          ) : mode === 'legendary' ? (
            <>
              {legendaries.length > 0 && (
                <section className="space-y-3 rounded-3xl bg-white p-5 dark:bg-dark-surface">
                  <h2 className="font-bold text-ink dark:text-dark-ink">
                    <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 font-mono text-xs text-amber-950">
                      ★
                    </span>
                    {t.battle.legendary}
                    {gauntletCleared && (
                      <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs text-white">
                        {t.battle.legendaryDone}
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-ink-muted dark:text-dark-ink-muted">
                    {t.battle.legendaryHint}
                  </p>
                  <div className="flex [scrollbar-width:thin] gap-1.5 overflow-x-auto pb-1">
                    {GENERATIONS.map((gen) => {
                      const roster = legendaries.filter(
                        (p) => p.generation === gen.id
                      )
                      const cleared = roster.filter(beaten).length
                      const complete = cleared === roster.length
                      const active = legendGen === gen.id
                      return (
                        <button
                          key={gen.id}
                          type="button"
                          onClick={() => setLegendGen(gen.id)}
                          aria-pressed={active}
                          title={`${t.quiz.gen} ${gen.roman} · ${gen.region}`}
                          className={`flex shrink-0 flex-col items-center rounded-xl px-3 py-1.5 transition-all ${active ? 'bg-primary text-white shadow-md dark:bg-dark-primary' : complete ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-200' : 'bg-surface-sunken text-ink hover:bg-black/[0.06] dark:bg-dark-raised dark:text-dark-ink dark:hover:bg-white/[0.08]'}`}
                        >
                          <span className="text-sm font-bold">{gen.roman}</span>
                          <span
                            className={`font-mono text-[10px] ${active ? 'text-white/80' : 'opacity-60'}`}
                          >
                            {cleared}/{roster.length}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex snap-x snap-mandatory [scrollbar-width:thin] gap-2 overflow-x-auto pb-2">
                    {legendaries
                      .filter((p) => p.generation === legendGen)
                      .map((pokemon) => {
                        const done = beaten(pokemon)
                        const selected = target?.id === pokemon.id
                        return (
                          <button
                            key={pokemon.id}
                            type="button"
                            onClick={() => chooseLegendary(pokemon)}
                            aria-pressed={selected}
                            className={`relative flex w-28 shrink-0 snap-start flex-col items-center gap-1 rounded-2xl border-2 bg-white p-2 text-center transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 dark:bg-dark-surface ${selected ? 'border-primary' : done ? 'border-emerald-400' : 'border-black/[0.08] dark:border-white/[0.1]'}`}
                          >
                            <img
                              src={artwork(pokemon, 80)}
                              alt=""
                              className={`h-16 w-16 object-contain ${done ? '' : 'opacity-70 grayscale'}`}
                              loading="lazy"
                            />
                            <span className="w-full truncate text-xs font-semibold text-ink dark:text-dark-ink">
                              {pokemon.names[locale]}
                            </span>
                            <span className="font-mono text-[10px] text-ink-muted dark:text-dark-ink-muted">
                              {sumStats(pokemon)}
                            </span>
                            {done && (
                              <span className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500 px-1.5 text-[10px] font-bold text-white">
                                ✓
                              </span>
                            )}
                          </button>
                        )
                      })}
                  </div>
                </section>
              )}

              {target && isLegendary(target) && (
                <TargetCard target={target} locale={locale} t={t} />
              )}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={startBattle}
                  disabled={!target || !isLegendary(target)}
                  className={`${PRIMARY_BUTTON} px-10 py-3 text-base`}
                >
                  ★ {t.battle.fight}
                </button>
              </div>
            </>
          ) : (
            <>
              <section className="space-y-3 rounded-3xl bg-white p-5 dark:bg-dark-surface">
                <h2 className="font-bold text-ink dark:text-dark-ink">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-xs text-white dark:bg-dark-primary">
                    1
                  </span>
                  {t.battle.stepPokemon}
                </h2>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex-1">
                    <PokemonPicker
                      index={index}
                      locale={locale}
                      placeholder={t.battle.pick}
                      autoFocus={!target}
                      onPick={choose}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => choose(randomOf(defaults))}
                    disabled={loading || defaults.length === 0}
                    className={SECONDARY_BUTTON}
                  >
                    {t.battle.random}
                  </button>
                </div>
                {target ? (
                  <TargetCard target={target} locale={locale} t={t} />
                ) : (
                  <p className="text-center text-sm text-ink-muted dark:text-dark-ink-muted">
                    {loading ? t.battle.loading : t.battle.intro}
                  </p>
                )}
              </section>

              <section className="space-y-3 rounded-3xl bg-white p-5 dark:bg-dark-surface">
                <h2 className="font-bold text-ink dark:text-dark-ink">
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-xs text-white dark:bg-dark-primary">
                    2
                  </span>
                  {t.battle.reelGen}
                </h2>
                <GenerationSelect
                  value={generation}
                  onChange={(gen) =>
                    setGeneration(clampGeneration(gen, won, allUnlocked))
                  }
                  locale={locale}
                  label={t.battle.reelGen}
                  unlockedUpTo={unlockedUpTo}
                  allUnlocked={allUnlocked}
                  disabled={!target}
                />
                {target && !allUnlocked && (
                  <p className="text-xs text-ink-muted dark:text-dark-ink-muted">
                    🔒 {t.battle.lockedHint}
                  </p>
                )}
              </section>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={startBattle}
                  disabled={!target}
                  className={`${PRIMARY_BUTTON} px-10 py-3 text-base`}
                >
                  ⚔️ {t.battle.fight}
                </button>
              </div>
            </>
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
                          onClick={() => targetPokemon && choose(targetPokemon)}
                          disabled={!targetPokemon}
                          title={t.battle.pick}
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
                            {targetPokemon?.names[locale] ??
                              `#${record.targetId}`}
                          </p>
                          <p className="text-xs text-ink-muted dark:text-dark-ink-muted">
                            {dateFormat.format(record.at)}
                          </p>
                        </div>
                        <div className="hidden -space-x-2 sm:flex">
                          {record.cards.map((id, i) => (
                            <img
                              key={STAT_LABEL_KEYS[i]}
                              src={optimizedImageUrl(
                                officialArtworkUrl(id),
                                28
                              )}
                              alt={byId.get(id)?.names[locale] ?? ''}
                              title={`${t.stats[STAT_LABEL_KEYS[i]]}: ${byId.get(id)?.stats[i] ?? '?'}`}
                              className="h-7 w-7 rounded-full bg-white object-contain ring-2 ring-white dark:bg-dark-raised dark:ring-dark-surface"
                              loading="lazy"
                            />
                          ))}
                        </div>
                        {record.mode && record.mode !== 'classic' && (
                          <span
                            role="img"
                            aria-label={t.battle[record.mode]}
                            title={t.battle[record.mode]}
                          >
                            {record.mode === 'survival' ? '🔥' : '★'}
                          </span>
                        )}
                        <span className="font-mono text-sm text-ink tabular-nums dark:text-dark-ink">
                          {record.total} vs {record.targetTotal}
                        </span>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                          style={{ background: color }}
                          title={record.redraw ? t.battle.redrawWin : undefined}
                        >
                          {label}
                          {record.redraw && ' ↻'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )}
        </div>
      </>
    )
  }

  if (!target) return null

  return (
    <>
      <div className="flex items-center gap-2 border-b border-black/[0.06] pb-3 dark:border-white/[0.08]">
        <BackButton locale={locale} onBack={backToSetup} />
      </div>
      <div className="mx-auto max-w-3xl space-y-6">
        {phase === 'done' && (
          <div
            className="space-y-3 rounded-3xl border-2 p-5 text-center"
            style={{
              borderColor: ahead ? WIN_COLOR : accent,
              backgroundImage: `radial-gradient(circle at 50% 0%, ${ahead ? WIN_COLOR : accent}33, transparent 70%)`,
            }}
          >
            <p className="font-mono text-[11px] tracking-wide text-ink-muted uppercase dark:text-dark-ink-muted">
              {mode === 'classic' ? t.battle.summary : t.battle[mode]}
            </p>
            <p className="text-2xl font-black text-ink dark:text-dark-ink">
              {mode === 'survival' && diff <= 0 ? t.battle.runOver : result}
            </p>
            {diff > 0 && redrawUsed && (
              <p className="text-sm text-amber-700 dark:text-amber-300">
                ↻ {t.battle.redrawWin}
              </p>
            )}
            {mode === 'survival' && (
              <p className="font-mono text-sm text-ink dark:text-dark-ink">
                🔥 {t.battle.streak} <b>{streak}</b> · 🏆 {t.battle.bestStreak}{' '}
                <b>{survivalBest[generation] ?? 0}</b>
              </p>
            )}
            {unlockMessage && (
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                🔓 {unlockMessage}
              </p>
            )}
            <p className="font-mono text-sm text-ink-muted dark:text-dark-ink-muted">
              {total} vs {targetTotal}
            </p>
          </div>
        )}

        <TargetCard
          target={target}
          locale={locale}
          t={t}
          total={total}
          badge={
            mode === 'survival' ? `🔥 ${t.battle.streak} ${streak}` : undefined
          }
        />

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
                className={`relative overflow-hidden rounded-2xl border-2 bg-white p-2 text-center transition-all dark:bg-dark-surface ${
                  reel.kept
                    ? 'shadow-md'
                    : 'border-black/[0.08] dark:border-white/[0.1]'
                } ${reel.rolling ? 'reel-card-rolling' : ''} ${canKeep ? 'cursor-pointer hover:-translate-y-1 hover:border-primary/50 hover:shadow-md active:scale-95 dark:hover:border-dark-primary/50' : 'cursor-default'}`}
                style={
                  reel.kept
                    ? {
                        borderColor: reelAccent,
                        backgroundImage: `radial-gradient(circle at 50% 35%, ${reelAccent}40, transparent 65%)`,
                      }
                    : undefined
                }
              >
                <div
                  key={reel.rolling ? 'rolling' : reel.pokemon.id}
                  className={`flex flex-col items-center gap-1 ${reel.rolling ? '' : 'reel-card-land'}`}
                >
                  <span className="font-mono text-[10px] tracking-wide text-ink-muted uppercase dark:text-dark-ink-muted">
                    {t.stats[STAT_LABEL_KEYS[i]]}
                  </span>
                  <div className="aspect-square w-full">
                    <img
                      src={artwork(shown, 112)}
                      alt=""
                      className={`h-full w-full object-contain ${reel.rolling ? 'reel-rolling' : 'reel-land'}`}
                      draggable={false}
                    />
                  </div>
                  <span
                    className={`text-2xl font-black text-ink tabular-nums dark:text-dark-ink ${reel.rolling ? 'animate-pulse' : 'stat-pop'}`}
                  >
                    {reel.rolling ? '··' : reel.pokemon.stats[i]}
                  </span>
                  <span className="w-full truncate text-[11px] text-ink-muted dark:text-dark-ink-muted">
                    {reel.rolling ? ' ' : reel.pokemon.names[locale]}
                  </span>
                </div>
                {reel.kept ? (
                  <span
                    className="badge-stamp absolute top-1.5 right-1.5 rounded-full px-1.5 text-[10px] font-bold text-white"
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

        {phase === 'playing' ? (
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
              className={SECONDARY_BUTTON}
            >
              ↻ {t.battle.redraw}{' '}
              <span className="font-mono opacity-60">
                {redrawUsed ? 0 : 1}/1
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={
                mode !== 'survival'
                  ? startBattle
                  : diff > 0
                    ? nextOpponent
                    : startSurvival
              }
              className={PRIMARY_BUTTON}
            >
              {mode !== 'survival'
                ? t.battle.again
                : diff > 0
                  ? t.battle.nextOpponent
                  : t.battle.newRun}
            </button>
            <button
              type="button"
              onClick={backToSetup}
              className={SECONDARY_BUTTON}
            >
              {t.battle.backToSetup}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
