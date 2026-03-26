import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type HeaderPokedexButtonProps = {
  locale: Locale
}

export function HeaderPokedexButton({ locale }: HeaderPokedexButtonProps) {
  const t = translations[locale]

  return (
    <a
      className="rounded-sm border border-primary-300 bg-primary-50 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-primary-600 transition-all hover:bg-primary-100 hover:shadow-md dark:border-primary/40 dark:bg-primary/5 dark:text-neon-cyan dark:hover:border-primary dark:hover:bg-primary/10 dark:hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]"
      href={`/${locale}/pokedex`}
    >
      {t.header.pokedex}
    </a>
  )
}
