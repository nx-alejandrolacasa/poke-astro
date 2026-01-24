import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex items-center gap-1 rounded-lg border-2 border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`rounded-md px-3 py-1.5 font-semibold text-sm transition-all ${
          language === 'en'
            ? 'bg-[#3466AF] text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('es')}
        className={`rounded-md px-3 py-1.5 font-semibold text-sm transition-all ${
          language === 'es'
            ? 'bg-[#3466AF] text-white shadow-md'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>
    </div>
  )
}
