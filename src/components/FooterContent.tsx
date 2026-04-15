import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  const t = translations[locale]

  return (
    <div className="flex flex-col items-center gap-2 text-center text-xs text-ink-faint dark:text-dark-ink-faint">
      <p>{t.footer.legal}</p>
      <p className="font-mono">
        {t.footer.dataBy}{' '}
        <a href="https://pokeapi.co" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">PokéAPI</a>
        {' · '}{t.footer.builtWith}{' '}
        <a href="https://astro.build" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">Astro</a>
        ,{' '}
        <a href="https://react.dev" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">React</a>
        {' & '}
        <a href="https://tailwindcss.com" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
      </p>
    </div>
  )
}
