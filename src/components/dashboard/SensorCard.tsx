import type { SensorReading, SensorStatus } from '../../lib/nandi/sensors'
import { Sparkline } from './Sparkline'

const STATUS_TONE: Record<SensorStatus, { dot: string; text: string; ring: string; spark: string }> = {
  nominal: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    ring: 'ring-fg/8',
    spark: 'text-emerald-600',
  },
  warning: {
    dot: 'bg-accent',
    text: 'text-accent',
    ring: 'ring-accent/40',
    spark: 'text-accent',
  },
  critical: {
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    ring: 'ring-rose-500/50',
    spark: 'text-rose-600',
  },
  stale: {
    dot: 'bg-fg-muted',
    text: 'text-fg-muted',
    ring: 'ring-fg/8',
    spark: 'text-fg-muted',
  },
}

const STATUS_LABEL: Record<SensorStatus, string> = {
  nominal: 'Nominal',
  warning: 'Watch',
  critical: 'Critical',
  stale: 'Stale',
}

interface SensorCardProps {
  reading: SensorReading
  history: number[]
}

function formatValue(value: number): string {
  const abs = Math.abs(value)
  if (abs >= 1000) return value.toFixed(0)
  if (abs >= 100) return value.toFixed(1)
  return value.toFixed(1)
}

export function SensorCard({ reading, history }: SensorCardProps) {
  const tone = STATUS_TONE[reading.status]
  const span = reading.max - reading.min || 1
  const fill = Math.min(100, Math.max(0, ((reading.value - reading.min) / span) * 100))

  const previous = history.length > 1 ? history[history.length - 2] : reading.value
  const delta = reading.value - previous
  const trend = Math.abs(delta) < 0.05 ? '—' : delta > 0 ? `▲ ${delta.toFixed(1)}` : `▼ ${Math.abs(delta).toFixed(1)}`

  return (
    <article
      className={`flex flex-col rounded-2xl bg-surface p-4 ring-1 ${tone.ring} transition-colors hover:bg-surface-raised`}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-fg" title={reading.label}>
            {reading.label}
          </h3>
          {reading.group && (
            <p className="mt-0.5 text-[11px] font-medium tracking-wide text-fg-muted uppercase">
              {reading.group}
            </p>
          )}
        </div>
        <span className={`flex shrink-0 items-center gap-1.5 text-[11px] font-semibold ${tone.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
          {STATUS_LABEL[reading.status]}
        </span>
      </header>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-3xl font-semibold tabular-nums text-fg">
          {formatValue(reading.value)}
        </span>
        <span className="text-sm font-medium text-fg-muted">{reading.unit}</span>
        <span className="ml-auto text-[11px] font-medium tabular-nums text-fg-muted">{trend}</span>
      </div>

      <Sparkline values={history} tone={tone.spark} className="mt-2" />

      <div className="mt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-fg/8">
          <div
            className={`h-full rounded-full ${tone.dot} transition-[width] duration-500 ease-out`}
            style={{ width: `${fill}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] tabular-nums text-fg-muted">
          <span>
            {reading.min}
            {reading.unit}
          </span>
          <span>
            {reading.max}
            {reading.unit}
          </span>
        </div>
      </div>
    </article>
  )
}
