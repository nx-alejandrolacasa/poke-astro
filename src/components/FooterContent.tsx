import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-2 text-center">
      <p className="text-xs text-ink-faint leading-relaxed dark:text-dark-ink-faint">
        {t.footer.disclaimer}
      </p>
      <p className="text-xs text-ink-faint leading-relaxed dark:text-dark-ink-faint">
        {t.footer.trademarks}
      </p>
      <p className="text-xs text-ink-faint leading-relaxed dark:text-dark-ink-faint">
        {t.footer.fairUse}
      </p>
      <div className="mt-3 border-t border-surface-sunken pt-3 dark:border-dark-border">
        <p className="font-mono text-xs text-ink-faint dark:text-dark-ink-faint">
          {t.footer.dataBy}{' '}
          <a href="https://pokeapi.co" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">PokeAPI</a>
          . {t.footer.builtWith}{' '}
          <a href="https://astro.build" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">Astro</a>
          ,{' '}
          <a href="https://react.dev" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">React</a>
          {' & '}
          <a href="https://tailwindcss.com" className="text-primary transition-colors hover:text-primary-600" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
          .
        </p>
      </div>
    </div>
  )
}
