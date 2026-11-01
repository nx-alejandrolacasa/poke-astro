import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { getRecentVisits, type RecentVisit } from '@/utils/recentVisits'
import { translations } from '@/utils/translations'

export function RecentlyVisited({ locale }: { locale: Locale }) {
  const [visits, setVisits] = useState<RecentVisit[]>([])

  useEffect(() => {
    getRecentVisits().then(setVisits)
  }, [])

  if (visits.length === 0) return null

  const t = translations[locale]

  return (
    <div className="px-2 py-3">
      <p className="mb-2 font-sans text-[11px] font-bold tracking-wider text-ink-muted uppercase dark:text-dark-ink-muted">
        {t.pokemon.recent}
      </p>
      <div className="flex flex-wrap gap-2">
        {visits.map((v) => (
          <a
            key={v.name}
            href={`/${locale}/pokemon/${v.name}`}
            data-astro-prefetch="tap"
            className="inline-flex items-center gap-1.5 rounded-full border-2 bg-white px-3 py-1.5 text-xs leading-5 font-semibold text-ink shadow-sm shadow-black/[0.04] transition hover:-translate-y-px active:scale-95 dark:bg-dark-surface dark:text-dark-ink"
            style={{
              borderColor: v.typeColor,
              backgroundImage: `linear-gradient(${v.typeColor}2e, ${v.typeColor}2e)`,
            }}
          >
            <span className="font-mono opacity-70">
              #{v.id.toString().padStart(3, '0')}
            </span>
            <span>{v.displayName}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
