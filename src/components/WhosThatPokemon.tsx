import { useEffect, useMemo, useState } from 'react'
import { GenerationSelect } from '@/components/GenerationSelect'
import { usePokemonIndex } from '@/components/usePokemonIndex'
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
    <div className="mx-auto max-w-2xl space-y-3 md:space-y-4">
      <div className="flex justify-end">
        <GenerationSelect
          value={generation}
          onChange={setGeneration}
          locale={locale}
          label={t.quiz.gen}
        />
      </div>

      <div
        className="cell relative space-y-4 overflow-hidden p-6"
        style={{
          backgroundImage: revealed
            ? `radial-gradient(circle at 50% 35%, ${accent}33, transparent 65%)`
            : undefined,
        }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="font-display text-[13px] text-ink dark:text-dark-ink">
            {t.quiz.title}
          </h1>
          <p className="flex gap-3 text-xs text-ink-muted dark:text-dark-ink-muted">
            {[
              [t.quiz.score, score],
              [t.quiz.streak, streak],
              [t.quiz.best, best],
            ].map(([label, value]) => (
              <span key={label}>
                {label}{' '}
                <b className="font-mono text-ink tabular-nums dark:text-dark-ink">
                  {value}
                </b>
              </span>
            ))}
          </p>
        </div>
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
          className="min-h-7 text-center text-lg font-bold text-ink dark:text-dark-ink"
          aria-live="polite"
        >
          {!revealed
            ? t.quiz.question
            : correct
              ? `${t.quiz.correct} ${round?.answer.names[locale]}`
              : `${t.quiz.wrong} ${round?.answer.names[locale]}`}
        </p>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {(round?.options ?? []).map((option, i) => {
            const isAnswer = option.id === round?.answer.id
            const tone = !revealed
              ? 'border-transparent hover:border-primary/40 dark:hover:border-dark-primary/40'
              : isAnswer
                ? 'border-success bg-success/10'
                : option.id === guess?.id
                  ? 'border-danger bg-danger/10'
                  : 'border-transparent opacity-50'
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => answer(option)}
                disabled={revealed}
                className={`flex min-h-11 items-center gap-3 rounded-lg border-2 bg-surface-sunken px-4 py-3 text-left font-semibold text-ink transition-all active:scale-[0.98] disabled:cursor-default dark:bg-dark-raised dark:text-dark-ink ${tone}`}
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
            className="min-h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50 dark:bg-dark-primary"
          >
            {revealed ? t.quiz.next : t.quiz.reveal}
          </button>
        </div>
      </div>
    </div>
  )
}
