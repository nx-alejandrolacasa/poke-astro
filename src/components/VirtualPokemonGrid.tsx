import { useWindowVirtualizer } from '@tanstack/react-virtual'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { PokemonTile } from '@/components/PokemonTile'
import { SkeletonCard } from '@/components/SkeletonCard'
import type { Locale } from '@/utils/i18n'
import type { Pokemon, PokemonList } from '@/utils/pokemon'
import { getCachedPagesFrom, putCachedPage } from '@/utils/pokemonPagesCache'
import { getScrollSnapshot, saveScrollSnapshot } from '@/utils/scrollMemory'

type VirtualPokemonGridProps = {
  initialPokemon: Pokemon[]
  totalCount: number
  pageSize: number
  fetchPage: (page: number) => Promise<PokemonList>
  cacheNamespace: string
  locale: Locale
}

const GAP_PX = 16

// Mirror of Tailwind grid-cols-* breakpoints used previously on the static
// grid. Keeping them in lock-step matters because real-PokemonTile vs
// SkeletonCard heights compare cell-for-cell.
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
  initialPokemon,
  totalCount,
  pageSize,
  fetchPage,
  cacheNamespace,
  locale,
}: VirtualPokemonGridProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [pokemonByIndex, setPokemonByIndex] = useState<Map<number, Pokemon>>(
    () => {
      const m = new Map<number, Pokemon>()
      for (let i = 0; i < initialPokemon.length; i++) {
        m.set(i, initialPokemon[i])
      }
      return m
    }
  )
  const loadingPagesRef = useRef<Set<number>>(new Set())
  const [containerWidth, setContainerWidth] = useState<number>(() =>
    typeof window === 'undefined' ? 0 : window.innerWidth
  )
  const [scrollMargin, setScrollMargin] = useState(0)

  // Track viewport width via ResizeObserver on the parent so column count
  // and cell height adapt to actual layout, not just window width.
  useLayoutEffect(() => {
    if (!parentRef.current) return
    const update = () => {
      const el = parentRef.current
      if (!el) return
      setContainerWidth(el.clientWidth)
      // Distance from page top to the virtualized grid — useWindowVirtualizer
      // needs this so its scroll math aligns with window.scrollY.
      const rect = el.getBoundingClientRect()
      setScrollMargin(rect.top + window.scrollY)
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
  const rowCount = Math.ceil(totalCount / columnCount)

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => rowHeight + GAP_PX,
    overscan: 4,
    scrollMargin,
  })

  // Restore scroll synchronously, before paint. The virtualizer reports its
  // total size based on rowCount × estimated row height, so the document is
  // the right height immediately and scrollTo lands precisely.
  const initialSnapshot = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : getScrollSnapshot(window.location.pathname),
    []
  )
  const restoredRef = useRef(false)
  useLayoutEffect(() => {
    if (restoredRef.current) return
    if (initialSnapshot == null) return
    // Don't try to restore until we've measured the parent — otherwise
    // rowHeight is the fallback estimate and scrollTo can land off.
    if (containerWidth === 0) return
    window.scrollTo(0, initialSnapshot.scrollY)
    restoredRef.current = true
  }, [initialSnapshot, containerWidth])

  // Persist scroll on leave. itemCount is no longer needed for height
  // calculation (the virtualizer derives that from totalCount), but we
  // still write it so the snapshot type stays consistent with non-virtual
  // callers — and it costs nothing.
  const sizeRef = useRef(pokemonByIndex.size)
  useEffect(() => {
    sizeRef.current = pokemonByIndex.size
  }, [pokemonByIndex])
  useEffect(() => {
    const prev = history.scrollRestoration
    history.scrollRestoration = 'manual'
    const save = () =>
      saveScrollSnapshot(window.location.pathname, sizeRef.current)
    window.addEventListener('pagehide', save)
    document.addEventListener('astro:before-swap', save)
    return () => {
      window.removeEventListener('pagehide', save)
      document.removeEventListener('astro:before-swap', save)
      history.scrollRestoration = prev
    }
  }, [])

  // Hydrate cached pages from IndexedDB on mount. Page 1 is already in
  // pokemonByIndex from initialPokemon; this fills 2..N in one shot.
  useEffect(() => {
    let cancelled = false
    putCachedPage(cacheNamespace, 1, pageSize, {
      count: totalCount,
      results: initialPokemon,
    })
    getCachedPagesFrom(cacheNamespace, 2, pageSize).then((cached) => {
      if (cancelled || cached.length === 0) return
      setPokemonByIndex((prev) => {
        const next = new Map(prev)
        for (const entry of cached) {
          const startIdx = (entry.page - 1) * pageSize
          for (let i = 0; i < entry.results.length; i++) {
            next.set(startIdx + i, entry.results[i])
          }
        }
        return next
      })
    })
    return () => {
      cancelled = true
    }
  }, [cacheNamespace, pageSize, totalCount, initialPokemon])

  const loadPage = useCallback(
    async (page: number) => {
      if (loadingPagesRef.current.has(page)) return
      loadingPagesRef.current.add(page)
      try {
        const data = await fetchPage(page)
        setPokemonByIndex((prev) => {
          const next = new Map(prev)
          const startIdx = (page - 1) * pageSize
          for (let i = 0; i < data.results.length; i++) {
            next.set(startIdx + i, data.results[i])
          }
          return next
        })
        putCachedPage(cacheNamespace, page, pageSize, data)
      } catch (e) {
        console.error('Failed to fetch page', page, e)
      } finally {
        loadingPagesRef.current.delete(page)
      }
    },
    [fetchPage, pageSize, cacheNamespace]
  )

  // Whenever the visible row window changes, fetch any pages that contain
  // missing items. Overscan in useWindowVirtualizer pre-fetches a few rows
  // beyond viewport so loading feels instant during scrolling.
  const virtualRows = rowVirtualizer.getVirtualItems()
  useEffect(() => {
    const pagesToLoad = new Set<number>()
    for (const row of virtualRows) {
      const startIdx = row.index * columnCount
      const endIdx = Math.min(startIdx + columnCount, totalCount)
      for (let i = startIdx; i < endIdx; i++) {
        if (!pokemonByIndex.has(i)) {
          pagesToLoad.add(Math.floor(i / pageSize) + 1)
        }
      }
    }
    for (const page of pagesToLoad) loadPage(page)
  }, [virtualRows, columnCount, totalCount, pokemonByIndex, pageSize, loadPage])

  return (
    <div ref={parentRef} className="relative w-full">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          position: 'relative',
          width: '100%',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const startIdx = virtualRow.index * columnCount
          const cells: React.ReactNode[] = []
          for (let i = 0; i < columnCount; i++) {
            const idx = startIdx + i
            if (idx >= totalCount) {
              cells.push(<div key={`empty-${idx}`} />)
              continue
            }
            const poke = pokemonByIndex.get(idx)
            cells.push(
              <div key={idx}>
                {poke ? (
                  <PokemonTile pokemon={poke} locale={locale} />
                ) : (
                  <SkeletonCard />
                )}
              </div>
            )
          }
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
              {cells}
            </div>
          )
        })}
      </div>
    </div>
  )
}
