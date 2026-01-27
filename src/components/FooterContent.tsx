import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type FooterContentProps = {
  locale: Locale
}

export function FooterContent({ locale }: FooterContentProps) {
  const t = translations[locale]

  return (
    <div className="space-y-1.5 text-center">
      <p className="text-[11px] text-gray-500 leading-relaxed dark:text-gray-500">
        {t.footer.disclaimer}
      </p>
      <p className="text-[11px] text-gray-500 leading-relaxed dark:text-gray-500">
        {t.footer.trademarks}
      </p>
      <p className="text-[11px] text-gray-500 leading-relaxed dark:text-gray-500">
        {t.footer.fairUse}
      </p>
      <div className="border-t border-gray-200 pt-3 mt-3 dark:border-gray-700">
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          {t.footer.dataBy}{' '}
          <a
            href="https://pokeapi.co"
            className="text-primary-500 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
          . {t.footer.builtWith}{' '}
          <a
            href="https://astro.build"
            className="text-primary-500 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Astro
          </a>
          ,{' '}
          <a
            href="https://react.dev"
            className="text-primary-500 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          {' & '}
          <a
            href="https://tailwindcss.com"
            className="text-primary-500 transition-colors hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
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
