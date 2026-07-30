import { useEffect, useRef, useState } from 'react'
import type { LogEntry, LogLevel } from '../../lib/nandi/activityLog'
import { startActivityLog } from '../../lib/nandi/activityLog'
import { StatusPill } from './StatusPill'

const LIMIT = 200

const LEVEL_TONE: Record<LogLevel, string> = {
  info: 'text-fg-muted',
  step: 'text-accent',
  warn: 'text-amber-300',
  error: 'text-rose-300',
}

export function ActivityLog() {
  const [entries, setEntries] = useState<LogEntry[]>([])
  const [connected, setConnected] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return startActivityLog({
      onEntry: (entry) => setEntries((prev) => [...prev.slice(-(LIMIT - 1)), entry]),
      onState: setConnected,
    })
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries])

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-surface ring-1 ring-white/8">
      <header className="flex items-center justify-between gap-2 border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-fg">Activity</h2>
          <StatusPill
            tone={connected ? 'ok' : 'idle'}
            pulse={!connected}
            label={connected ? 'Streaming' : 'Waiting'}
          />
        </div>
        <button
          type="button"
          onClick={() => setEntries([])}
          className="text-xs font-medium text-fg-muted transition-colors hover:text-fg"
        >
          Clear
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2 font-mono text-[11px] leading-relaxed">
        {entries.length === 0 ? (
          <p className="px-1 py-6 text-center font-sans text-xs text-fg-muted">
            Waiting for server activity…
          </p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="flex gap-2 rounded px-1 py-0.5 hover:bg-white/4">
              <span className="shrink-0 tabular-nums text-fg-muted/60">{entry.time}</span>
              <span className={`min-w-0 break-words ${LEVEL_TONE[entry.level]}`}>{entry.message}</span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  )
}
