import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type ImageZoomModalProps = {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export function ImageZoomModal({ src, alt, isOpen, onClose }: ImageZoomModalProps) {
  const { t } = useLanguage()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged image of ${alt}`}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-2 text-white transition-colors"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        aria-label={t.modal.close}
      >
        <svg
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image container */}
      <div className="flex h-[90vh] w-[90vw] items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain drop-shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Hint text */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/50">
        {t.modal.closeHint}
      </p>
    </div>
  )
}
