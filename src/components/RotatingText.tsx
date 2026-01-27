import { useEffect, useState, useRef, useCallback } from 'react'

type RotatingTextProps = {
  items: string[]
  intervalMs?: number
  className?: string
  showIndicators?: boolean
  indicatorStyle?: 'default' | 'subtle'
}

type AnimationPhase = 'idle' | 'exiting' | 'entering'

export function RotatingText({
  items,
  intervalMs = 5000,
  className = '',
  showIndicators = true,
  indicatorStyle = 'default',
}: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle')
  const [contentHeight, setContentHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Measure content height for smooth transitions
  useEffect(() => {
    if (contentRef.current && animationPhase === 'idle') {
      setContentHeight(contentRef.current.offsetHeight)
    }
  }, [currentIndex, animationPhase, items])

  const advanceToNext = useCallback(() => {
    if (items.length <= 1 || animationPhase !== 'idle') return

    // Phase 1: Exit animation (text moves down and fades out)
    setAnimationPhase('exiting')

    setTimeout(() => {
      // Phase 2: Update index and position new text above (invisible)
      setCurrentIndex((prev) => (prev + 1) % items.length)
      setAnimationPhase('entering')

      // Phase 3: After a brief moment, animate text down to normal position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase('idle')
        })
      })
    }, 300)
  }, [items.length, animationPhase])

  const goToIndex = useCallback((index: number) => {
    if (index === currentIndex || animationPhase !== 'idle') return

    setAnimationPhase('exiting')

    setTimeout(() => {
      setCurrentIndex(index)
      setAnimationPhase('entering')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase('idle')
        })
      })
    }, 300)
  }, [currentIndex, animationPhase])

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

  // Reset interval when manually advancing
  const handleClick = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
    }
    advanceToNext()
    if (items.length > 1) {
      rotationIntervalRef.current = setInterval(advanceToNext, intervalMs)
    }
  }

  const handleDotClick = (index: number) => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
    }
    goToIndex(index)
    if (items.length > 1) {
      rotationIntervalRef.current = setInterval(advanceToNext, intervalMs)
    }
  }

  if (items.length === 0) return null

  const getAnimationClasses = () => {
    switch (animationPhase) {
      case 'exiting':
        return 'translate-y-4 opacity-0 transition-all duration-300 ease-in-out'
      case 'entering':
        return '-translate-y-4 opacity-0 transition-none'
      case 'idle':
      default:
        return 'translate-y-0 opacity-100 transition-all duration-300 ease-in-out'
    }
  }

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative overflow-hidden transition-[height] duration-300 ease-in-out"
        style={{ height: contentHeight ? `${contentHeight}px` : 'auto' }}
      >
        <p
          ref={contentRef}
          onClick={items.length > 1 ? handleClick : undefined}
          className={`${getAnimationClasses()} ${items.length > 1 ? 'cursor-pointer' : ''}`}
        >
          {items[currentIndex]}
        </p>
      </div>
      {showIndicators && items.length > 1 && (
        <div className={`flex items-center justify-center gap-1 ${indicatorStyle === 'subtle' ? 'mt-1.5' : 'mt-2'}`}>
          {items.map((_, index) => (
            <button
              key={index}
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
                        ? 'w-4 bg-primary-500 dark:bg-primary-400'
                        : 'w-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500'
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
