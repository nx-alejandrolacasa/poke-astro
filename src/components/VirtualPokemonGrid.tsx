import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { PokemonTile } from '@/components/PokemonTile'
import type { Locale } from '@/utils/i18n'
import type { PokemonSummary } from '@/utils/pokemon'
import { getScrollSnapshot, saveScrollSnapshot } from '@/utils/scrollMemory'

type VirtualPokemonGridProps = {
  pokemon: PokemonSummary[]
  locale: Locale
}

const GAP_PX = 16

// Mirror of the Tailwind grid-cols-* breakpoints ListerSkeleton uses, so the
// skeleton and the live grid line up cell for cell.
function getColumnCount(width: number): number {
  if (width >= 1280) return 6
  if (width >= 1024) return 5
  if (width >= 768) return 4
  if (width >= 640) return 3
  return 2
}

// PokemonTile content below the aspect-square image: 8 mt + 24 name +
// 6 gap + 24 type-badge + 16+16 padding + 2+2 border ≈ 98px.
const TILE_CONTENT_HEIGHT_PX = 98

export function VirtualPokemonGrid({
  pokemon,
  locale,
}: VirtualPokemonGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  )
  const [scrollMargin, setScrollMargin] = useState(0)

  useLayoutEffect(() => {
    if (!parentRef.current) return
    const update = () => {
      const el = parentRef.current
      if (!el) return
      setContainerWidth(el.clientWidth)
      setScrollMargin(el.getBoundingClientRect().top + window.scrollY)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(parentRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  const columnCount = getColumnCount(containerWidth || 1024)
  const cellWidth =
    containerWidth > 0
      ? (containerWidth - (columnCount - 1) * GAP_PX) / columnCount
      : 200
  const rowHeight = cellWidth + TILE_CONTENT_HEIGHT_PX
  const rowCount = Math.ceil(pokemon.length / columnCount)

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => rowHeight + GAP_PX,
    overscan: 4,
    scrollMargin,
  })

  const initialSnapshot = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : getScrollSnapshot(window.location.pathname),
    []
  )
  const restoredRef = useRef(false)
  useLayoutEffect(() => {
    if (restoredRef.current || initialSnapshot == null || containerWidth === 0)
      return
    window.scrollTo(0, initialSnapshot.scrollY)
    restoredRef.current = true
  }, [initialSnapshot, containerWidth])

  useEffect(() => {
    const prev = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const save = () =>
      saveScrollSnapshot(window.location.pathname, pokemon.length)
    window.addEventListener('pagehide', save)
    document.addEventListener('astro:before-swap', save)
    return () => {
      window.removeEventListener('pagehide', save)
      document.removeEventListener('astro:before-swap', save)
      history.scrollRestoration = prev
    }
  }, [pokemon.length])

  return (
    <div ref={parentRef} className="relative w-full">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
          width: '100%',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const start = virtualRow.index * columnCount
          const row = pokemon.slice(start, start + columnCount)
          return (
            <div
              key={virtualRow.key}
              data-row={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start - scrollMargin}px)`,
                display: 'grid',
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                gap: `${GAP_PX}px`,
                paddingBottom: `${GAP_PX}px`,
              }}
            >
              {row.map((p) => (
                <PokemonTile key={p.id} pokemon={p} locale={locale} />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
