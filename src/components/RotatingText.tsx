import { useCallback, useEffect, useRef, useState } from 'react'

type RotatingTextProps = {
  items: string[]
  intervalMs?: number
  className?: string
  showIndicators?: boolean
  indicatorStyle?: 'default' | 'subtle'
}

type AnimationPhase = 'idle' | 'exiting' | 'entering'
type Direction = 'next' | 'prev'

export function RotatingText({
  items,
  intervalMs = 5000,
  className = '',
  showIndicators = true,
  indicatorStyle = 'default',
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle')
  const [direction, setDirection] = useState<Direction>('next')
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    if (contentRef.current && animationPhase === 'idle') {
      setContentHeight(contentRef.current.offsetHeight)
    }
  }, [animationPhase])

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (index === currentIndex || animationPhase !== 'idle') return
      setDirection(dir)
      setAnimationPhase('exiting')

      setTimeout(() => {
        setCurrentIndex(index)
        setAnimationPhase('entering')

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimationPhase('idle')
          })
        })
      }, 250)
    },
    [currentIndex, animationPhase]
  )

  const advanceToNext = useCallback(() => {
    if (items.length <= 1 || animationPhase !== 'idle') return
    goTo((currentIndex + 1) % items.length, 'next')
  }, [items.length, animationPhase, currentIndex, goTo])

  const advanceToPrev = useCallback(() => {
    if (items.length <= 1 || animationPhase !== 'idle') return
    goTo((currentIndex - 1 + items.length) % items.length, 'prev')
  }, [items.length, animationPhase, currentIndex, goTo])

  const resetInterval = useCallback(() => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
    }
    if (items.length > 1) {
      rotationIntervalRef.current = setInterval(advanceToNext, intervalMs)
    }
  }, [items.length, intervalMs, advanceToNext])

  // Auto-rotation
  useEffect(() => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
      rotationIntervalRef.current = null
    }

    if (items.length > 1) {
      rotationIntervalRef.current = setInterval(advanceToNext, intervalMs)
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [items.length, intervalMs, advanceToNext])

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const diff = e.changedTouches[0].clientX - touchStartX.current
    const threshold = 40
    if (Math.abs(diff) > threshold) {
      if (diff < 0) {
        advanceToNext()
      } else {
        advanceToPrev()
      }
      resetInterval()
    }
    touchStartX.current = null
  }

  const handleClick = () => {
    advanceToNext()
    resetInterval()
  }

  const handleDotClick = (index: number) => {
    goTo(index, index > currentIndex ? 'next' : 'prev')
    resetInterval()
  }

  if (items.length === 0) return null

  const getAnimationClasses = () => {
    const exitDir = direction === 'next' ? '-translate-x-6' : 'translate-x-6'
    const enterDir = direction === 'next' ? 'translate-x-6' : '-translate-x-6'

    switch (animationPhase) {
      case 'exiting':
        return `${exitDir} opacity-0 transition-all duration-250 ease-in-out`
      case 'entering':
        return `${enterDir} opacity-0 transition-none`
      default:
        return 'translate-x-0 opacity-100 transition-all duration-250 ease-in-out'
    }
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
        onTouchStart={items.length > 1 ? handleTouchStart : undefined}
        onTouchEnd={items.length > 1 ? handleTouchEnd : undefined}
      >
        <p
          ref={contentRef}
          onClick={items.length > 1 ? handleClick : undefined}
          onKeyDown={
            items.length > 1
              ? (e) => {
                  if (
                    e.key === 'ArrowRight' ||
                    e.key === 'Enter' ||
                    e.key === ' '
                  ) {
                    e.preventDefault()
                    advanceToNext()
                    resetInterval()
                  }
                  if (e.key === 'ArrowLeft') {
                    e.preventDefault()
                    advanceToPrev()
                    resetInterval()
                  }
                }
              : undefined
          }
          role={items.length > 1 ? 'button' : undefined}
          tabIndex={items.length > 1 ? 0 : undefined}
          className={`${getAnimationClasses()} ${items.length > 1 ? 'cursor-pointer select-none' : ''}`}
        >
          {items[currentIndex]}
        </p>
      </div>
      {showIndicators && items.length > 1 && (
        <div
          className={`flex items-center justify-center gap-1 ${indicatorStyle === 'subtle' ? 'mt-1.5' : 'mt-2'}`}
        >
          {items.map((item, index) => (
            <button
              key={item}
              type="button"
              onClick={() => handleDotClick(index)}
              className={
                indicatorStyle === 'subtle'
                  ? `h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-2 bg-current opacity-50'
                        : 'w-1 bg-current opacity-25 hover:opacity-40'
                    }`
                  : `h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-4 bg-primary-500 dark:bg-primary'
                        : 'w-1.5 bg-ink-faint/30 hover:bg-ink-faint/50 dark:bg-dark-ink-faint/30 dark:hover:bg-dark-ink-faint/50'
                    }`
              }
              aria-label={`Show item ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
