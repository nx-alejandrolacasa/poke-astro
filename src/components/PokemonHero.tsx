import type { CSSProperties } from 'react'
import { useState } from 'react'
import { ImageZoom } from '@/components/ImageZoom'
import type { Locale } from '@/utils/i18n'

type PokemonHeroProps = {
  id: number
  displayName: string
  defaultUrl: string
  shinyUrl: string | null
  accent: string
  zoomLabel: string
  locale: Locale
}

const SPARKLES = [
  { top: '5%', left: '48%', delay: '0.05s', size: 14 },
  { top: '18%', left: '87%', delay: '0.20s', size: 10 },
  { top: '62%', left: '93%', delay: '0.12s', size: 12 },
  { top: '90%', left: '55%', delay: '0.28s', size: 9 },
  { top: '75%', left: '7%', delay: '0.18s', size: 11 },
  { top: '15%', left: '10%', delay: '0.32s', size: 10 },
  { top: '42%', left: '3%', delay: '0.08s', size: 8 },
  { top: '38%', left: '97%', delay: '0.38s', size: 8 },
]

export function PokemonHero({
  id,
  displayName,
  defaultUrl,
  shinyUrl,
  accent,
  zoomLabel,
  locale,
}: PokemonHeroProps) {
  const [showShiny, setShowShiny] = useState(false)
  const [shinyBurst, setShinyBurst] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const zoomSrc = showShiny && shinyUrl ? shinyUrl : defaultUrl

  const toggleShiny = () => {
    if (!showShiny) setShinyBurst((k) => k + 1)
    setShowShiny((s) => !s)
  }

  return (
    <>
      {shinyUrl && (
        <button
          type="button"
          onClick={toggleShiny}
          className={`absolute top-2 right-2 z-20 cursor-pointer rounded-full p-3 transition-opacity ${showShiny ? '' : 'opacity-70 hover:opacity-100'}`}
          aria-label="Shiny"
          aria-pressed={showShiny}
          title="Shiny"
        >
          <svg
            className={`h-6 w-6 overflow-visible ${showShiny ? 'animate-shiny-shine motion-reduce:animate-none motion-reduce:drop-shadow-[0_0_6px_#fbbf24]' : 'drop-shadow-sm'}`}
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="shiny-grad" cx="0.35" cy="0.35" r="0.75">
                <stop offset="0%" stop-color="#ff4444" />
                <stop offset="30%" stop-color="#ffaa00" />
                <stop offset="55%" stop-color="#44cc44" />
                <stop offset="75%" stop-color="#2288ff" />
                <stop offset="100%" stop-color="#44aaff" />
              </radialGradient>
              <radialGradient id="shiny-grad-off" cx="0.35" cy="0.35" r="0.75">
                <stop offset="0%" stop-color="#5a6378" />
                <stop offset="100%" stop-color="#1c2230" />
              </radialGradient>
            </defs>
            <path
              d="M50 0 C53 38, 62 47, 100 50 C62 53, 53 62, 50 100 C47 62, 38 53, 0 50 C38 47, 47 38, 50 0Z"
              fill={showShiny ? 'url(#shiny-grad)' : 'url(#shiny-grad-off)'}
            />
          </svg>
        </button>
      )}

      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        aria-label={zoomLabel}
        className="relative aspect-square w-full max-w-[260px] cursor-zoom-in border-0 bg-transparent p-0 outline-none"
      >
        {shinyBurst > 0 && (
          <div
            key={shinyBurst}
            className="pointer-events-none absolute inset-[-20%]"
            style={{ '--ray-color': accent } as CSSProperties}
          >
            <div className="shiny-glow" />
            <div className="shiny-rays" />
            {SPARKLES.map((s) => (
              <div
                key={`${s.top}-${s.left}`}
                className="shiny-sparkle"
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                }}
              />
            ))}
          </div>
        )}
        <img
          className={`absolute inset-0 z-10 h-full w-full object-contain transition-opacity duration-300 ${showShiny ? 'opacity-0' : 'opacity-100'}`}
          src={defaultUrl}
          alt={`${displayName} official artwork`}
          style={{ viewTransitionName: `pokemon-${id}` }}
        />
        {shinyUrl && (
          <img
            className={`absolute inset-0 z-10 h-full w-full object-contain transition-opacity duration-300 ${showShiny ? 'opacity-100' : 'opacity-0'}`}
            src={shinyUrl}
            alt={`${displayName} shiny artwork`}
            loading="lazy"
          />
        )}
      </button>

      <ImageZoom
        src={zoomSrc}
        alt={`${displayName} ${showShiny ? 'shiny ' : ''}artwork`}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        locale={locale}
      />
    </>
  )
}
