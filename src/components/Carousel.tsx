import { useCallback, useEffect, useRef, useState } from 'react'

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

export function Carousel({
  items,
  label,
  autoPlayMs = 0,
  className = '',
  textClassName = DEFAULT_TEXT_CLASS,
}: CarouselProps) {
  const [current, setCurrent] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const touchStartX = useRef(0)
  const touchDeltaX = useRef(0)
  const isDragging = useRef(false)

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % items.length) + items.length) % items.length)
      setProgressKey((k) => k + 1)
    },
    [items.length]
  )

  useEffect(() => {
    if (!autoPlayMs || items.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length)
      setProgressKey((k) => k + 1)
    }, autoPlayMs)
    return () => clearInterval(timer)
  }, [autoPlayMs, items.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    isDragging.current = true
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }, [])

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false
    if (touchDeltaX.current < -40) goTo(current + 1)
    else if (touchDeltaX.current > 40) goTo(current - 1)
  }, [current, goTo])

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
      className={`select-none ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {label && (
        <p className="mb-3 font-sans font-bold text-xs text-primary uppercase tracking-wider dark:text-dark-primary">
          {label}
        </p>
      )}
      <div className="relative min-h-[3.5rem] overflow-hidden">
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
                className="absolute inset-y-0 left-0 rounded-full bg-primary dark:bg-dark-primary"
                style={{
                  animation: `progress-fill ${autoPlayMs}ms linear forwards`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
