import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-2 text-center">
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
        {t.footer.disclaimer}
      </p>
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
        {t.footer.trademarks}
      </p>
      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
        {t.footer.fairUse}
      </p>
      <div className="pt-3 mt-3" style={{ borderTop: '1px solid var(--border-soft)' }}>
        <p className="text-[11px]" style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
          {t.footer.dataBy}{' '}
          <a
            href="https://pokeapi.co"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#EE8130' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
          . {t.footer.builtWith}{' '}
          <a
            href="https://astro.build"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#6390F0' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Astro
          </a>
          ,{' '}
          <a
            href="https://react.dev"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#7AC74C' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          {' & '}
          <a
            href="https://tailwindcss.com"
            className="font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#A190D0' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tailwind CSS
          </a>
          .
        </p>
      </div>
    </div>
  )
}
