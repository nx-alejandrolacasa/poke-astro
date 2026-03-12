import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-2 text-center">
      <p className="themed-text-secondary text-[11px] leading-relaxed opacity-70">{t.footer.disclaimer}</p>
      <p className="themed-text-secondary text-[11px] leading-relaxed opacity-70">{t.footer.trademarks}</p>
      <p className="themed-text-secondary text-[11px] leading-relaxed opacity-70">{t.footer.fairUse}</p>
      <div className="themed-border-t mt-3 pt-3">
        <p className="themed-text-secondary text-[11px] opacity-50">
          {t.footer.dataBy}{' '}
          <a href="https://pokeapi.co" className="link-fire font-semibold transition-opacity hover:opacity-80" target="_blank" rel="noopener noreferrer">PokéAPI</a>
          . {t.footer.builtWith}{' '}
          <a href="https://astro.build" className="link-water font-semibold transition-opacity hover:opacity-80" target="_blank" rel="noopener noreferrer">Astro</a>
          ,{' '}
          <a href="https://react.dev" className="link-grass font-semibold transition-opacity hover:opacity-80" target="_blank" rel="noopener noreferrer">React</a>
          {' & '}
          <a href="https://tailwindcss.com" className="link-flying font-semibold transition-opacity hover:opacity-80" target="_blank" rel="noopener noreferrer">Tailwind CSS</a>
          .
        </p>
      </div>
    </div>
  )
}
