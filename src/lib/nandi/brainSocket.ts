// ═══════════════════════════════════════════════════════════
//  brainSocket.ts — chat WebSocket + file upload against the brain API
//
//  Ported from Nandi_Frontend/src/lib/wsAdapter.js, with the login gate
//  removed: the socket connects and sends whatever token is present, and
//  reports its state instead of bouncing the user to an OAuth screen.
// ═══════════════════════════════════════════════════════════

import { brainHttp, brainWs, getToken, resolveBrain } from './endpoints'

const CLIENT_ID = 'nandi_web'
const RECONNECT_MS = 4000

export type BrainState = 'offline' | 'connecting' | 'connected' | 'unauthorized'

export interface Attachment {
  file_id: string
  filename: string
  content_type: string
  size?: number
}

export interface BrainReply {
  response_text: string
  session_id?: string
  timestamp?: string
}

interface OutboundQuery {
  query: string
  client_id: string
  attachments: Attachment[]
}

type StateListener = (state: BrainState) => void
type ReplyListener = (reply: BrainReply) => void

let ws: WebSocket | null = null
let state: BrainState = 'offline'
let queue: OutboundQuery[] = []
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

const stateListeners = new Set<StateListener>()
const replyListeners = new Set<ReplyListener>()

function setState(next: BrainState) {
  if (state === next) return
  state = next
  stateListeners.forEach((fn) => fn(next))
}

export function getBrainState(): BrainState {
  return state
}

export function onBrainState(fn: StateListener): () => void {
  stateListeners.add(fn)
  fn(state)
  return () => stateListeners.delete(fn)
}

export function onBrainReply(fn: ReplyListener): () => void {
  replyListeners.add(fn)
  return () => replyListeners.delete(fn)
}

function scheduleReconnect() {
  if (reconnectTimer) return
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    void connect()
  }, RECONNECT_MS)
}

async function connect() {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) return

  setState('connecting')
  await resolveBrain()

  let sock: WebSocket
  try {
    sock = new WebSocket(brainWs('/ws/chat'))
  } catch {
    setState('offline')
    scheduleReconnect()
    return
  }
  ws = sock

  sock.onopen = () => {
    if (ws !== sock) return
    // The server always expects an auth frame first; an empty token gets a
    // clean 1008 close, which we surface as `unauthorized` rather than retry.
    sock.send(JSON.stringify({ type: 'auth', token: getToken() ?? '' }))
  }

  sock.onmessage = (event) => {
    if (ws !== sock) return

    let data: Record<string, unknown>
    try {
      data = JSON.parse(event.data as string)
    } catch {
      return
    }

    if (data.status === 'authenticated') {
      setState('connected')
      // Flush anything typed while the socket was down.
      for (const item of queue) sock.send(JSON.stringify(item))
      queue = []
      return
    }

    if (data.error) {
      const err = String(data.error)
      if (err.includes('token') || err.includes('authenticated')) {
        setState('unauthorized')
        return
      }
    }

    const text = String(data.response ?? data.conversation_output ?? '')
    if (!text) return

    const reply: BrainReply = {
      response_text: text,
      session_id: data.session_id as string | undefined,
      timestamp: data.timestamp as string | undefined,
    }
    replyListeners.forEach((fn) => fn(reply))
  }

  sock.onerror = () => {
    if (ws === sock) setState('offline')
  }

  sock.onclose = (event) => {
    if (ws !== sock) return
    ws = null
    // 1008 = policy violation, i.e. the auth frame was rejected. Reconnecting
    // in a loop with the same bad token would just hammer the server.
    if (event.code === 1008) {
      setState('unauthorized')
      return
    }
    setState('offline')
    scheduleReconnect()
  }
}

export function ensureBrainConnection(): void {
  void connect()
}

/** Reconnect immediately — used after the token changes. */
export function reconnectBrain(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (ws) {
    const sock = ws
    ws = null
    try {
      sock.close()
    } catch {
      /* already gone */
    }
  }
  setState('offline')
  void connect()
}

export function sendQuery(text: string, attachments: Attachment[] = []): void {
  const payload: OutboundQuery = { query: text, client_id: CLIENT_ID, attachments }

  if (ws && ws.readyState === WebSocket.OPEN && state === 'connected') {
    ws.send(JSON.stringify(payload))
  } else {
    queue.push(payload)
    void connect()
  }
}

export async function uploadFile(file: File): Promise<Attachment> {
  await resolveBrain()

  const form = new FormData()
  form.append('file', file)

  const token = getToken()
  const res = await fetch(`${brainHttp()}/api/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(`Upload failed (${res.status}): ${msg}`)
  }

  const json = await res.json()
  return {
    file_id: json.file_id,
    filename: json.filename,
    content_type: json.content_type,
    size: file.size,
  }
}
