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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Enlarged image of ${alt}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-sm border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10 dark:border-primary/20 dark:hover:bg-primary/10"
        aria-label={t.modal.close}
      >
        <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex h-[90vh] w-[90vw] items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain drop-shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-white/40">
        {t.modal.closeHint}
      </p>
    </div>
  )
}
