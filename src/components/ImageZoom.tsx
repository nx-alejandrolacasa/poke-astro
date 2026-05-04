import { useEffect, useState } from 'react'
import type { Locale } from '@/utils/i18n'
import { translations } from '@/utils/translations'

type ImageZoomProps = {
  src: string
  alt: string
  open: boolean
  onClose: () => void
  locale: Locale
}

// Must cover the longest exit keyframe (overlay 220ms, image 200ms).
const EXIT_DURATION_MS = 220

export function ImageZoom({ src, alt, open, onClose, locale }: ImageZoomProps) {
  const t = translations[locale]
  // `mounted` controls DOM presence; `closing` flips the keyframe class so
  // the overlay can play its exit animation before unmount.
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    if (mounted) {
      setClosing(true)
      const timeout = setTimeout(() => {
        setMounted(false)
        setClosing(false)
      }, EXIT_DURATION_MS)
      return () => clearTimeout(timeout)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!mounted) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md ${
        closing ? 'animate-zoom-overlay-out' : 'animate-zoom-overlay-in'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={alt}
    >
      {/* Full-area backdrop button — clicks anywhere outside the close
          button or the image (which is pointer-events-none) close the
          overlay. cursor-zoom-out signals the affordance. outline-none
          kills the default focus ring on this invisible button. */}
      <button
        type="button"
        aria-label={t.pages.back}
        onClick={onClose}
        className="absolute inset-0 z-0 h-full w-full cursor-zoom-out outline-none"
      />
      <img
        src={src}
        alt={alt}
        className={`pointer-events-none relative z-10 max-h-[90vh] max-w-[90vw] object-contain drop-shadow-2xl ${
          closing ? 'animate-zoom-image-out' : 'animate-zoom-image-in'
        }`}
      />
      <button
        type="button"
        aria-label={t.pages.back}
        onClick={onClose}
        className="absolute top-4 right-4 z-20 cursor-pointer rounded-full bg-white/15 p-3 text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )
}
