import { TypeChart } from '@/components/TypeChart'
import type { Locale } from '@/utils/i18n'

type TypeChartWrapperProps = {
  locale: Locale
}

export function TypeChartWrapper({ locale }: TypeChartWrapperProps) {
  return <TypeChart locale={locale} />
}
