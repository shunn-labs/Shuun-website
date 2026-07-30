// ═══════════════════════════════════════════════════════════
//  activityLog.ts — brain-server activity stream (/ws/logs)
// ═══════════════════════════════════════════════════════════

import { brainWs, getToken, resolveBrain } from './endpoints'

export type LogLevel = 'info' | 'step' | 'warn' | 'error'

export interface LogEntry {
  id: string
  message: string
  time: string
  level: LogLevel
}

const RECONNECT_MS = 4000

function classify(message: string): LogLevel {
  const lower = message.toLowerCase()
  if (lower.includes('error') || lower.includes('failed') || lower.includes('❌')) return 'error'
  if (lower.includes('warn') || lower.includes('⚠️')) return 'warn'
  if (lower.includes('route') || lower.includes('→') || lower.includes('selected')) return 'step'
  return 'info'
}

interface LogFeedCallbacks {
  onEntry: (entry: LogEntry) => void
  onState?: (connected: boolean) => void
}

export function startActivityLog({ onEntry, onState }: LogFeedCallbacks): () => void {
  let stopped = false
  let ws: WebSocket | null = null
  let timer: ReturnType<typeof setTimeout> | null = null

  async function connect() {
    if (stopped) return
    await resolveBrain()
    if (stopped) return

    let sock: WebSocket
    try {
      sock = new WebSocket(brainWs('/ws/logs'))
    } catch {
      timer = setTimeout(connect, RECONNECT_MS)
      return
    }
    ws = sock

    sock.onopen = () => {
      const token = getToken()
      if (token) sock.send(JSON.stringify({ type: 'auth', token }))
    }

    sock.onmessage = (event) => {
      let data: Record<string, unknown>
      try {
        data = JSON.parse(event.data as string)
      } catch {
        return
      }

      if (data.status === 'authenticated') {
        onState?.(true)
        return
      }
      if (data.error) return

      const message = String(data.log ?? data.message ?? JSON.stringify(data))
      onEntry({
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        message,
        time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        level: classify(message),
      })
    }

    sock.onclose = () => {
      if (stopped) return
      ws = null
      onState?.(false)
      timer = setTimeout(connect, RECONNECT_MS)
    }
  }

  void connect()

  return () => {
    stopped = true
    if (timer) clearTimeout(timer)
    try {
      ws?.close()
    } catch {
      /* already gone */
    }
  }
}
