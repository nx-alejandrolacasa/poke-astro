import { useRef, useState } from 'react'

type Cry = { key: string; src: string; label: string }

type CryButtonsProps = {
  cries: Cry[]
  heading: string
  playLabel: string
}

export function CryButtons({ cries, heading, playLabel }: CryButtonsProps) {
  const [playing, setPlaying] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = (cry: Cry) => {
    audioRef.current?.pause()
    if (playing === cry.key) {
      setPlaying(null)
      return
    }
    const audio = new Audio(cry.src)
    audio.onended = () => setPlaying(null)
    audioRef.current = audio
    audio.play().catch(() => setPlaying(null))
    setPlaying(cry.key)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-xs font-bold tracking-wider text-primary uppercase dark:text-dark-primary">
        {heading}
      </span>
      {cries.map((cry) => (
        <button
          key={cry.key}
          type="button"
          onClick={() => play(cry)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${playing === cry.key ? 'bg-primary text-white dark:bg-dark-primary' : 'bg-surface-sunken text-ink hover:bg-primary/10 dark:bg-dark-raised dark:text-dark-ink dark:hover:bg-dark-primary/10'}`}
          title={playLabel}
        >
          <svg
            className="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            {playing === cry.key ? (
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zm7 0a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            ) : (
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            )}
          </svg>
          {cry.label}
        </button>
      ))}
    </div>
  )
}
