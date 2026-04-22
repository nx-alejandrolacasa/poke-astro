import { type CSSProperties, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { getPokemonName } from '@/utils/pokemon'
import {
  addRecentVisit,
  getRecentVisits,
  type RecentVisit,
} from '@/utils/recentVisits'
import { translations } from '@/utils/translations'

type RecentlyVisitedProps = {
  currentName: string
  currentId: number
  currentTypeColor: string
  currentTypes: string[]
  locale: Locale
}

export function RecentlyVisited({
  currentName,
  currentId,
  currentTypeColor,
  currentTypes,
  locale,
}: RecentlyVisitedProps) {
  const [visits, setVisits] = useState<RecentVisit[]>([])
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const existing = await getRecentVisits()
      if (cancelled) return
      setVisits(existing.filter((v) => v.name !== currentName).slice(0, 5))
      await addRecentVisit({
        name: currentName,
        displayName: getPokemonName(currentName),
        id: currentId,
        typeColor: currentTypeColor,
        types: currentTypes,
      })
    })()
    return () => {
      cancelled = true
    }
    // Only re-run when the visited pokemon changes. The other props are
    // derived from the same pokemon (and `currentTypes` is a fresh array
    // literal on every parent render, which would otherwise thrash).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentName])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 1)
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [visits])

  if (visits.length === 0) return null

  const t = translations[locale]

  const maskImage =
    'linear-gradient(to right,' +
    ' rgba(0, 0, 0, var(--scroll-fade-left)),' +
    ' black 1.5rem,' +
    ' black calc(100% - 1.5rem),' +
    ' rgba(0, 0, 0, var(--scroll-fade-right)))'

  return (
    <div
      ref={scrollRef}
      className="-my-2 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto py-2 md:justify-end"
      style={{
        '--scroll-fade-left': canScrollLeft ? 0 : 1,
        '--scroll-fade-right': canScrollRight ? 0 : 1,
        transition:
          '--scroll-fade-left 250ms ease, --scroll-fade-right 250ms ease',
        maskImage,
        WebkitMaskImage: maskImage,
      } as CSSProperties}
    >
      <span className="hidden shrink-0 font-sans font-bold text-[11px] text-ink-muted uppercase tracking-wider md:inline dark:text-dark-ink-muted">
        {t.pokemon.recent}:
      </span>
      {visits.map((v) => (
        <a
          key={v.name}
          href={`/${locale}/pokemon/${v.name}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-3 py-2 font-semibold text-xs leading-5 shadow-md transition hover:brightness-110 active:scale-95"
          style={{
            '--pill-bg': v.typeColor,
            backgroundColor: 'var(--pill-bg)',
            color: 'contrast-color(var(--pill-bg))',
          } as CSSProperties}
        >
          <span className="font-mono opacity-70">
            #{v.id.toString().padStart(3, '0')}
          </span>
          <span>{v.displayName}</span>
        </a>
      ))}
    </div>
  )
}
