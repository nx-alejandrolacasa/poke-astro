import { STAT_NAMES } from '@/utils/pokemon'

type Series = { stats: number[]; color: string; label: string }

type StatRadarProps = {
  series: Series[]
  labels: string[]
  max?: number
}

const SIZE = 240
const CENTER = SIZE / 2
const RADIUS = 88

function point(index: number, value: number): [number, number] {
  const angle = (Math.PI * 2 * index) / STAT_NAMES.length - Math.PI / 2
  return [
    CENTER + Math.cos(angle) * RADIUS * value,
    CENTER + Math.sin(angle) * RADIUS * value,
  ]
}

function polygon(values: number[]): string {
  return values.map((v, i) => point(i, v).join(',')).join(' ')
}

export function StatRadar({ series, labels, max = 200 }: StatRadarProps) {
  const rings = [0.25, 0.5, 0.75, 1]
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="mx-auto w-full max-w-[280px]"
      role="img"
      aria-label={series.map((s) => s.label).join(' vs ')}
    >
      {rings.map((r) => (
        <polygon
          key={r}
          points={polygon(STAT_NAMES.map(() => r))}
          fill="none"
          className="stroke-ink/10 dark:stroke-dark-ink/15"
          strokeWidth={1}
        />
      ))}
      {STAT_NAMES.map((_, i) => {
        const [x, y] = point(i, 1)
        const [lx, ly] = point(i, 1.22)
        return (
          <g key={labels[i]}>
            <line
              x1={CENTER}
              y1={CENTER}
              x2={x}
              y2={y}
              className="stroke-ink/10 dark:stroke-dark-ink/15"
              strokeWidth={1}
            />
            <text
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-ink-muted text-[10px] font-semibold dark:fill-dark-ink-muted"
            >
              {labels[i]}
            </text>
          </g>
        )
      })}
      {series.map((s) => (
        <polygon
          key={s.label}
          points={polygon(s.stats.map((v) => Math.min(1, v / max)))}
          fill={s.color}
          fillOpacity={0.28}
          stroke={s.color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  )
}
