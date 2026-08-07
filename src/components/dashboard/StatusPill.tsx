import type { ReactNode } from 'react'

export type PillTone = 'ok' | 'warn' | 'err' | 'idle'

const TONE: Record<PillTone, { dot: string; text: string; ring: string }> = {
  ok: { dot: 'bg-emerald-500', text: 'text-emerald-700', ring: 'ring-emerald-400/25' },
  warn: { dot: 'bg-accent', text: 'text-accent', ring: 'ring-accent/30' },
  err: { dot: 'bg-rose-500', text: 'text-rose-700', ring: 'ring-rose-500/30' },
  idle: { dot: 'bg-fg-muted', text: 'text-fg-muted', ring: 'ring-fg/10' },
}

interface StatusPillProps {
  tone: PillTone
  label: ReactNode
  /** Gently pulses the dot — use for "connecting" style states. */
  pulse?: boolean
  title?: string
}

export function StatusPill({ tone, label, pulse = false, title }: StatusPillProps) {
  const t = TONE[tone]
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full bg-fg/4 px-2.5 py-1 text-[11px] font-semibold ring-1 ${t.ring} ${t.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  )
}
