import { GENERATIONS } from '@/utils/generations'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type GenerationSelectProps = {
  value: number
  onChange: (generation: number) => void
  locale: Locale
  label: string
  unlockedUpTo?: number
  allUnlocked?: boolean
  disabled?: boolean
}

const CHEVRON =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%236b6b7b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")"

export function GenerationSelect({
  value,
  onChange,
  locale,
  label,
  unlockedUpTo = Number.POSITIVE_INFINITY,
  allUnlocked = true,
  disabled = false,
}: GenerationSelectProps) {
  const t = translations[locale]
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label={label}
      title={label}
      disabled={disabled}
      className="appearance-none rounded-full border border-black/[0.06] bg-surface-sunken bg-no-repeat py-2 pr-9 pl-4 text-sm text-ink focus:border-primary/30 focus:ring-2 focus:ring-primary/10 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.06] dark:bg-dark-raised dark:text-dark-ink"
      style={{
        backgroundImage: CHEVRON,
        backgroundPosition: 'right 0.9rem center',
        backgroundSize: '1.1rem',
      }}
    >
      <option value={0} disabled={!allUnlocked}>
        {allUnlocked ? '' : '🔒 '}
        {t.quiz.allGens}
      </option>
      {GENERATIONS.map((gen) => (
        <option key={gen.id} value={gen.id} disabled={gen.id > unlockedUpTo}>
          {gen.id > unlockedUpTo ? '🔒 ' : ''}
          {t.quiz.gen} {gen.roman} · {gen.region}
        </option>
      ))}
    </select>
  )
}
