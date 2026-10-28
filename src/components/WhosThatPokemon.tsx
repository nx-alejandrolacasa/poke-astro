import { useEffect, useMemo, useState } from 'react'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import { GENERATIONS } from '@/utils/generations'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import { officialArtworkUrl, optimizedImageUrl } from '@/utils/pokemon'
import { translations } from '@/utils/translations'

type WhosThatPokemonProps = {
  locale: Locale
}

type Round = {
  answer: PokemonRecord
  options: PokemonRecord[]
}

const BEST_KEY = 'poke-astro:quiz:best'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function makeRound(pool: PokemonRecord[]): Round {
  const answer = pool[Math.floor(Math.random() * pool.length)]
  const sameGen = pool.filter(
    (p) => p.id !== answer.id && p.generation === answer.generation
  )
  const distractors = shuffle(sameGen.length >= 3 ? sameGen : pool).filter(
    (p) => p.id !== answer.id
  )
  return { answer, options: shuffle([answer, ...distractors.slice(0, 3)]) }
}

export function WhosThatPokemon({ locale }: WhosThatPokemonProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [generation, setGeneration] = useState(0)
  const [round, setRound] = useState<Round | null>(null)
  const [guess, setGuess] = useState<PokemonRecord | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(0)

  const pool = useMemo(
    () =>
      index.filter(
        (p) => p.isDefault && (generation === 0 || p.generation === generation)
      ),
    [index, generation]
  )

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY)) || 0)
  }, [])

  useEffect(() => {
    if (pool.length >= 4) {
      setRound(makeRound(pool))
      setGuess(null)
    }
  }, [pool])

  const next = () => {
    setRound(makeRound(pool))
    setGuess(null)
  }

  const giveUp = () => {
    if (!round || guess) return
    setStreak(0)
    setGuess({ ...round.answer, id: -1 })
  }

  const answer = (option: PokemonRecord) => {
    if (!round || guess) return
    setGuess(option)
    if (option.id === round.answer.id) {
      setScore((s) => s + 1)
      const nextStreak = streak + 1
      setStreak(nextStreak)
      if (nextStreak > best) {
        setBest(nextStreak)
        localStorage.setItem(BEST_KEY, String(nextStreak))
      }
    } else {
      setStreak(0)
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!round) return
      const n = Number(e.key)
      if (n >= 1 && n <= 4 && !guess) answer(round.options[n - 1])
      if ((e.key === 'Enter' || e.key === ' ') && guess) next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const revealed = guess !== null
  const correct = revealed && guess.id === round?.answer.id
  const accent = round?.answer.accent ?? '#705898'

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <select
          value={generation}
          onChange={(e) => setGeneration(Number(e.target.value))}
          aria-label={t.quiz.gen}
          className="rounded-full border border-black/[0.06] bg-surface-sunken px-3 py-1.5 text-sm text-ink dark:border-white/[0.06] dark:bg-dark-raised dark:text-dark-ink"
        >
          <option value={0}>{t.quiz.allGens}</option>
          {GENERATIONS.map((gen) => (
            <option key={gen.id} value={gen.id}>
              {t.quiz.gen} {gen.roman} · {gen.region}
            </option>
          ))}
        </select>
        <div className="flex gap-3 font-mono text-sm text-ink-muted dark:text-dark-ink-muted">
          <span>
            {t.quiz.score}{' '}
            <b className="text-ink dark:text-dark-ink">{score}</b>
          </span>
          <span>
            {t.quiz.streak}{' '}
            <b className="text-ink dark:text-dark-ink">{streak}</b>
          </span>
          <span>
            {t.quiz.best} <b className="text-ink dark:text-dark-ink">{best}</b>
          </span>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl bg-white p-6 transition-colors duration-500 dark:bg-dark-surface"
        style={{
          border: `2px solid ${revealed ? accent : 'transparent'}`,
          backgroundImage: revealed
            ? `radial-gradient(circle at 50% 40%, ${accent}40, transparent 65%)`
            : undefined,
        }}
      >
        {loading || !round ? (
          <div className="mx-auto aspect-square w-full max-w-[280px]">
            <div className="skeleton-shimmer h-full w-full rounded-2xl" />
          </div>
        ) : (
          <img
            key={round.answer.id}
            src={optimizedImageUrl(officialArtworkUrl(round.answer.id), 280)}
            alt={revealed ? round.answer.names[locale] : t.quiz.question}
            className={`mx-auto aspect-square w-full max-w-[280px] object-contain ${revealed ? 'silhouette silhouette-revealed' : 'silhouette'}`}
            draggable={false}
          />
        )}
        <p
          className="mt-4 min-h-7 text-center text-lg font-bold text-ink dark:text-dark-ink"
          aria-live="polite"
        >
          {!revealed
            ? t.quiz.question
            : correct
              ? `${t.quiz.correct} ${round?.answer.names[locale]}`
              : `${t.quiz.wrong} ${round?.answer.names[locale]}`}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {(round?.options ?? []).map((option, i) => {
          const isAnswer = option.id === round?.answer.id
          const tone = !revealed
            ? 'border-black/[0.08] bg-white shadow-sm shadow-black/[0.04] hover:border-primary/40 hover:bg-primary-50 dark:border-white/[0.1] dark:bg-dark-surface dark:hover:border-dark-primary/40 dark:hover:bg-primary/10'
            : isAnswer
              ? 'border-emerald-400 bg-emerald-100 text-emerald-900 dark:border-emerald-500/60 dark:bg-emerald-500/20 dark:text-emerald-200'
              : option.id === guess?.id
                ? 'border-rose-400 bg-rose-100 text-rose-900 dark:border-rose-500/60 dark:bg-rose-500/20 dark:text-rose-200'
                : 'border-black/[0.08] bg-white opacity-50 dark:border-white/[0.1] dark:bg-dark-surface'
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => answer(option)}
              disabled={revealed}
              className={`flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-semibold text-ink transition-all active:scale-[0.98] disabled:cursor-default dark:text-dark-ink ${tone}`}
            >
              <span className="font-mono text-xs opacity-40">{i + 1}</span>
              {option.names[locale]}
            </button>
          )
        })}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={revealed ? next : giveUp}
          disabled={!round}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50 dark:bg-dark-primary"
        >
          {revealed ? t.quiz.next : t.quiz.reveal}
        </button>
      </div>
    </div>
  )
}
