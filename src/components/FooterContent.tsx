import type { Locale } from '@/utils/i18n'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-ink-faint dark:text-dark-ink-faint">
        {locale === 'es' ? 'Fan-made. Datos de' : 'Fan-made. Data by'}{' '}
        <a
          href="https://pokeapi.co"
          className="text-primary transition-colors hover:text-primary-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          PokeAPI
        </a>
        .
      </p>
    </div>
  )
}
