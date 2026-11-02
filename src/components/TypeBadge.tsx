import type { CSSProperties } from 'react'
import { typeGlyphs } from '@/data/typeGlyphs'
import { contrastInk, typeColors } from '@/utils/pokemon'

type TypeBadgeProps = {
  type: string
  label?: string
  size?: 'icon' | 'sm' | 'md'
  href?: string
}

const SIZE_CLASSES = {
  icon: 'h-7 w-7 justify-center',
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-1.5 text-sm',
}

export function TypeBadge({ type, label, size = 'sm', href }: TypeBadgeProps) {
  const color = typeColors[type] ?? '#a8a878'
  const displayName = label ?? type
  const iconOnly = size === 'icon'

  const className = `inline-flex items-center rounded-full font-semibold capitalize ${SIZE_CLASSES[size]}`
  const style = {
    '--badge-bg': color,
    backgroundColor: 'var(--badge-bg)',
    color: contrastInk(color),
  } as CSSProperties
  const content = iconOnly ? (
    <svg className="h-4 w-4" viewBox="0 0 512 512" aria-hidden="true">
      <path d={typeGlyphs[type]} fill="currentColor" fillRule="evenodd" />
    </svg>
  ) : (
    displayName
  )
  const a11y = iconOnly ? { 'aria-label': displayName, title: displayName } : {}

  if (href) {
    return (
      <a
        href={href}
        className={`${className} transition-opacity hover:opacity-90`}
        style={style}
        {...a11y}
      >
        {content}
      </a>
    )
  }

  return (
    <span className={className} style={style} {...a11y}>
      {content}
    </span>
  )
}
