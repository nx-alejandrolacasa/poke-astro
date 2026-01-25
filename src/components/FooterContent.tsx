import { useLanguage } from '@/contexts/LanguageContext'

export function FooterContent() {
  const { t } = useLanguage()

  return (
    <div className="space-y-1 text-center">
      <p className="text-[13px] text-gray-600 leading-snug dark:text-gray-400">
        {t.footer.disclaimer}
      </p>
      <p className="text-[13px] text-gray-600 leading-snug dark:text-gray-400">
        {t.footer.trademarks}
      </p>
      <p className="text-[13px] text-gray-600 leading-snug dark:text-gray-400">
        {t.footer.fairUse}
      </p>
      <div className="border-t border-gray-200 pt-2 mt-2 dark:border-gray-700">
        <p className="text-[13px] text-gray-500 dark:text-gray-500">
          {t.footer.dataBy}{' '}
          <a
            href="https://pokeapi.co"
            className="text-primary transition-colors hover:text-primary-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
          . {t.footer.builtWith}{' '}
          <a
            href="https://astro.build"
            className="text-primary transition-colors hover:text-primary-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Astro
          </a>
          ,{' '}
          <a
            href="https://react.dev"
            className="text-primary transition-colors hover:text-primary-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          {' & '}
          <a
            href="https://tailwindcss.com"
            className="text-primary transition-colors hover:text-primary-600"
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
