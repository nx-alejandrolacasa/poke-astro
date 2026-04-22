import { useCallback, useRef, useState } from 'react'

type CarouselProps = {
  items: string[]
  label?: string
  autoPlayMs?: number
  className?: string
  /** Override the body-text classes (color, size, leading). */
  textClassName?: string
}

const DEFAULT_TEXT_CLASS =
  'text-ink text-base leading-relaxed md:text-lg dark:text-dark-ink'

const SWIPE_THRESHOLD = 40

export function Carousel({
  items,
  label,
  autoPlayMs = 0,
  className = '',
  textClassName = DEFAULT_TEXT_CLASS,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const pointerStartX = useRef(0)
  const pointerDeltaX = useRef(0)
  const isDragging = useRef(false)

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % items.length) + items.length) % items.length)
      setProgressKey((k) => k + 1)
    },
    [items.length]
  )

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length)
    setProgressKey((k) => k + 1)
  }, [items.length])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX
    pointerDeltaX.current = 0
    isDragging.current = true
    setIsPaused(true)
    // Capture so we still get pointerup if the user releases outside the
    // carousel. We intentionally don't capture when the press starts on an
    // interactive child (arrow / dot), otherwise their `click` event never
    // fires on some browsers once capture is redirected.
    const onInteractive = !!(e.target as HTMLElement).closest('button, a')
    if (!onInteractive) e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return
    pointerDeltaX.current = e.clientX - pointerStartX.current
  }, [])

  const finishPointer = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    setIsPaused(false)
    const dx = pointerDeltaX.current
    pointerDeltaX.current = 0
    if (dx < -SWIPE_THRESHOLD) advance()
    else if (dx > SWIPE_THRESHOLD) goTo(current - 1)
  }, [advance, current, goTo])

  if (items.length === 0) return null

  if (items.length === 1) {
    return (
      <div className={className}>
        {label && (
          <p className="mb-2 font-bold text-sm text-primary uppercase tracking-wider dark:text-dark-primary">
            {label}
          </p>
        )}
        <p className={textClassName}>{items[0]}</p>
      </div>
    )
  }

  return (
    <div
      className={`touch-pan-y select-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
    >
      {label && (
        <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
          {label}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(current - 1)}
          className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 dark:text-dark-primary dark:hover:bg-dark-primary/15 [@media(pointer:fine)]:flex"
          aria-label="Previous"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="relative min-h-[3.5rem] flex-1 overflow-hidden">
          {items.map((item, i) => (
            <p
              key={`item-${i.toString()}`}
              className={`${textClassName} transition-all duration-300 ${
                i === current
                  ? 'relative opacity-100'
                  : 'pointer-events-none absolute inset-0 opacity-0'
              }`}
            >
              {item}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={advance}
          className="hidden h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 dark:text-dark-primary dark:hover:bg-dark-primary/15 [@media(pointer:fine)]:flex"
          aria-label="Next"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-center justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={`dot-${i.toString()}`}
            type="button"
            onClick={() => goTo(i)}
            className={`relative overflow-hidden rounded-full transition-all duration-300 ${
              i === current
                ? 'h-2 w-6 bg-primary/25 dark:bg-dark-primary/25'
                : 'h-2 w-2 bg-primary/30 hover:bg-primary/50 dark:bg-dark-primary/30'
            }`}
            aria-label={`Item ${i + 1}`}
          >
            {i === current && autoPlayMs > 0 && (
              <span
                key={progressKey}
                onAnimationEnd={advance}
                className="absolute inset-y-0 left-0 rounded-full bg-primary dark:bg-dark-primary"
                style={{
                  animation: `progress-fill ${autoPlayMs}ms linear forwards`,
                  animationPlayState: isPaused ? 'paused' : 'running',
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
