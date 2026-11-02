import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { lastNonDetailRoute } from '@/utils/routeHistory'
import { type Translations, translations } from '@/utils/translations'

type BackButtonProps = {
  locale: Locale
}

export const BACK_LINK_CLASS =
  '-ml-1 inline-flex min-h-11 shrink-0 items-center gap-1 pr-2 text-sm font-semibold text-ink-muted transition-colors hover:text-ink active:scale-95 dark:text-dark-ink-muted dark:hover:text-dark-ink'

function destinationLabel(path: string, t: Translations): string {
  switch (path.split('/')[2]) {
    case undefined:
    case '':
      return t.header.home
    case 'play':
      return t.header.play
    case 'compare':
      return t.compare.title
    case 'team':
      return t.team.title
    case 'battle':
      return t.battle.title
    case 'quiz':
      return t.quiz.title
    default:
      return t.header.pokedex
  }
}

export function BackButton({ locale }: BackButtonProps) {
  const t = translations[locale]
  const [target, setTarget] = useState(`/${locale}/pokedex`)

  useEffect(() => {
    const previous = lastNonDetailRoute(window.location.pathname)
    if (previous) setTarget(previous)
  }, [])

  return (
    <a href={target} className={BACK_LINK_CLASS}>
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span>{destinationLabel(target, t)}</span>
    </a>
  )
}
