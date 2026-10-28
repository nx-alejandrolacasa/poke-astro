import { useEffect, useState } from 'react'

/**
 * Keeps an element mounted for `exitMs` after `open` turns false so its exit
 * animation can play. `closing` is true during that window.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    setClosing(true)
    const timeout = setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, exitMs)
    return () => clearTimeout(timeout)
  }, [open, mounted, exitMs])

  return { mounted, closing }
}
