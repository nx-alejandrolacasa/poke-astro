import { useEffect, useState } from 'react'
import { PokemonPicker } from '@/components/PokemonPicker'
import { TypeBadge } from '@/components/TypeBadge'
import { usePokemonIndex } from '@/components/usePokemonIndex'
import type { Locale } from '@/utils/i18n'
import type { PokemonRecord } from '@/utils/pokemon'
import {
  officialArtworkUrl,
  optimizedImageUrl,
  typeColors,
} from '@/utils/pokemon'
import { translations } from '@/utils/translations'
import { ALL_TYPES, getDefenseMultipliers } from '@/utils/typeEffectiveness'

type TeamBuilderProps = {
  locale: Locale
}

const TEAM_KEY = 'poke-astro:team'
const TEAM_SIZE = 6

function readTeam(): number[] {
  try {
    const ids = JSON.parse(localStorage.getItem(TEAM_KEY) ?? '[]')
    return Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []
  } catch {
    return []
  }
}

export function TeamBuilder({ locale }: TeamBuilderProps) {
  const t = translations[locale]
  const { index, loading } = usePokemonIndex()
  const [ids, setIds] = useState<number[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (index.length === 0) return
    const stored = readTeam()
    const add = new URLSearchParams(location.search).get('add')
    const added = index.find((p) => p.name === add)
    if (added && !stored.includes(added.id) && stored.length < TEAM_SIZE) {
      stored.push(added.id)
    }
    if (add) history.replaceState(null, '', location.pathname)
    setIds(stored)
    setReady(true)
  }, [index])

  useEffect(() => {
    if (ready) localStorage.setItem(TEAM_KEY, JSON.stringify(ids))
  }, [ids, ready])

  const team = ids
    .map((id) => index.find((p) => p.id === id))
    .filter((p): p is PokemonRecord => Boolean(p))
  const typeLabel = (type: string) =>
    (t.types as Record<string, string>)[type] ?? type

  const coverage = ALL_TYPES.map((attacker) => {
    const multipliers = team.map(
      (p) => getDefenseMultipliers(p.types)[attacker]
    )
    return {
      attacker,
      weak: multipliers.filter((m) => m > 1).length,
      resist: multipliers.filter((m) => m > 0 && m < 1).length,
      immune: multipliers.filter((m) => m === 0).length,
    }
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
        {Array.from({ length: TEAM_SIZE }, (_, i) => team[i]).map(
          (member, i) =>
            member ? (
              <div
                key={member.id}
                className="relative rounded-2xl bg-white p-2 text-center dark:bg-dark-surface"
                style={{
                  border: `2px solid ${member.accent ?? typeColors[member.types[0]]}`,
                  backgroundImage: `radial-gradient(circle at 50% 35%, ${member.accent ?? typeColors[member.types[0]]}33, transparent 65%)`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIds(ids.filter((id) => id !== member.id))}
                  aria-label={`${t.team.remove} ${member.names[locale]}`}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/5 text-xs text-ink-muted hover:bg-black/10 dark:bg-white/10 dark:text-dark-ink-muted"
                >
                  ✕
                </button>
                <a href={`/${locale}/pokemon/${member.name}`}>
                  <img
                    src={optimizedImageUrl(officialArtworkUrl(member.id), 96)}
                    alt={member.names[locale]}
                    className="mx-auto aspect-square w-full max-w-24 object-contain"
                  />
                  <span className="block truncate text-xs font-semibold text-ink dark:text-dark-ink">
                    {member.names[locale]}
                  </span>
                </a>
                <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                  {member.types.map((type) => (
                    <TypeBadge
                      key={type}
                      type={type}
                      label={typeLabel(type)}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div
                key={`empty-${i.toString()}`}
                className="flex min-h-32 items-center justify-center rounded-2xl border-2 border-dashed border-ink-faint/30 text-center text-xs text-ink-faint dark:border-dark-ink-faint/30 dark:text-dark-ink-faint"
              >
                {t.team.empty}
              </div>
            )
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex-1">
          {team.length < TEAM_SIZE ? (
            <PokemonPicker
              index={index}
              locale={locale}
              placeholder={loading ? t.search.loading : t.team.addMember}
              onPick={(p) => {
                if (!ids.includes(p.id)) setIds([...ids, p.id])
              }}
            />
          ) : (
            <p className="text-sm text-ink-muted dark:text-dark-ink-muted">
              {t.team.full}
            </p>
          )}
        </div>
        {team.length > 0 && (
          <button
            type="button"
            onClick={() => setIds([])}
            className="rounded-full bg-surface-sunken px-4 py-2 text-xs font-medium text-ink transition-colors hover:bg-danger/10 hover:text-danger dark:bg-dark-raised dark:text-dark-ink"
          >
            {t.team.clear}
          </button>
        )}
      </div>

      {team.length > 0 && (
        <div className="rounded-2xl bg-white p-4 dark:bg-dark-surface">
          <h2 className="font-sans text-xs font-bold tracking-wider text-primary uppercase dark:text-dark-primary">
            {t.team.coverage}
          </h2>
          <p className="mt-1 mb-3 text-xs text-ink-muted dark:text-dark-ink-muted">
            {t.team.coverageHint}
          </p>
          <div className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {coverage.map(({ attacker, weak, resist, immune }) => {
              const uncovered = weak > 0 && resist + immune === 0
              return (
                <div
                  key={attacker}
                  className={`flex items-center gap-2 rounded-xl px-2 py-1 ${uncovered ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}
                  title={uncovered ? t.team.uncovered : undefined}
                >
                  <div className="w-24 shrink-0">
                    <TypeBadge
                      type={attacker}
                      label={typeLabel(attacker)}
                      size="sm"
                    />
                  </div>
                  <div className="flex flex-1 gap-0.5">
                    {team.map((p) => {
                      const m = getDefenseMultipliers(p.types)[attacker]
                      const tone =
                        m === 0
                          ? 'bg-violet-400'
                          : m > 1
                            ? 'bg-orange-400'
                            : m < 1
                              ? 'bg-emerald-400'
                              : 'bg-surface-sunken dark:bg-dark-raised'
                      return (
                        <span
                          key={p.id}
                          className={`h-3 flex-1 rounded-sm ${tone}`}
                          title={`${p.names[locale]}: ${m}×`}
                        />
                      )
                    })}
                  </div>
                  <span className="shrink-0 text-right font-mono text-[10px] whitespace-nowrap text-ink-muted dark:text-dark-ink-muted">
                    {weak} {t.team.weak} · {resist} {t.team.resist}
                    {immune > 0 ? ` · ${immune} ${t.team.immune}` : ''}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
