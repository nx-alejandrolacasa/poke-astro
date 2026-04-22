import type { CSSProperties } from 'react'
import { typeColors } from '@/utils/pokemon'

type TypeBadgeProps = {
  type: string
  label?: string
  size?: 'sm' | 'md'
  href?: string
}

export function TypeBadge({ type, label, size = 'sm', href }: TypeBadgeProps) {
  const color = typeColors[type] ?? '#a8a878'
  const displayName = label ?? type

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-1.5 text-sm',
  }

  const className = `inline-flex items-center rounded-full font-semibold capitalize ${sizeClasses[size]}`
  const style = {
    '--badge-bg': color,
    backgroundColor: 'var(--badge-bg)',
    color: 'contrast-color(var(--badge-bg))',
  } as CSSProperties

  if (href) {
    return (
      <a href={href} className={`${className} transition-opacity hover:opacity-90`} style={style}>
        {displayName}
      </a>
    )
  }

  return (
    <span className={className} style={style}>
      {displayName}
    </span>
  )
}
