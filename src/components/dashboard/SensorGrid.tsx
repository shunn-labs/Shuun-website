import { useEffect, useState } from 'react'
import type { SensorHistory, SensorSnapshot } from '../../lib/nandi/sensors'
import { pushHistory, startSensorFeed } from '../../lib/nandi/sensors'
import { SectionHeading } from './SectionHeading'
import { SensorCard } from './SensorCard'
import { StatusPill } from './StatusPill'

const SOURCE_COPY = {
  live: { label: 'Live push', tone: 'ok' as const },
  polled: { label: 'Polling 1 Hz', tone: 'ok' as const },
  simulated: { label: 'Simulated feed', tone: 'warn' as const },
}

interface SensorGridProps {
  onSnapshot?: (snapshot: SensorSnapshot) => void
}

/**
 * Renders every sensor the feed reports — six today, any number later.
 * The grid auto-fills, so no layout change is needed when sensors are
 * added or removed upstream.
 */
export function SensorGrid({ onSnapshot }: SensorGridProps) {
  const [snapshot, setSnapshot] = useState<SensorSnapshot | null>(null)
  const [history, setHistory] = useState<SensorHistory>({})

  useEffect(() => {
    return startSensorFeed((next) => {
      setSnapshot(next)
      setHistory((prev) => pushHistory(prev, next.readings))
      onSnapshot?.(next)
    })
  }, [onSnapshot])

  const readings = snapshot?.readings ?? []

  const alerts = readings.filter((r) => r.status === 'critical' || r.status === 'warning').length

  const source = snapshot ? SOURCE_COPY[snapshot.source] : null

  return (
    <section aria-labelledby="sensors-heading">
      <SectionHeading
        id="sensors-heading"
        eyebrow="Sense"
        title="Live sensor readings"
        meta={
          <>
            {source && <StatusPill tone={source.tone} label={source.label} />}
            <StatusPill
              tone={alerts > 0 ? 'warn' : 'ok'}
              label={alerts > 0 ? `${alerts} need attention` : 'All nominal'}
            />
            <span className="text-xs tabular-nums text-fg-muted">
              {readings.length} sensor{readings.length === 1 ? '' : 's'}
            </span>
          </>
        }
      />

      {readings.length === 0 ? (
        <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-surface ring-1 ring-fg/5" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {readings.map((reading) => (
            <SensorCard key={reading.id} reading={reading} history={history[reading.id] ?? []} />
          ))}
        </div>
      )}

      {snapshot?.source === 'simulated' && (
        <p className="mt-3 text-xs leading-relaxed text-fg-muted">
          No telemetry endpoint answered on the brain API, so the grid is running its built-in
          simulator. It switches to real data automatically once{' '}
          <code className="rounded bg-fg/5 px-1 py-0.5 text-[11px] text-fg">/ws/sensors</code> or{' '}
          <code className="rounded bg-fg/5 px-1 py-0.5 text-[11px] text-fg">/api/sensors</code>{' '}
          starts responding.
        </p>
      )}
    </section>
  )
}
