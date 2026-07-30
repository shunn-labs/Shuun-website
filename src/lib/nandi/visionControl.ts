// ═══════════════════════════════════════════════════════════
//  visionControl.ts — brain-server socket that pushes vision commands
//
//  The vision agent dispatches to a registered browser client:
//    { action: 'show_frame',  image_b64, label, wid }
//    { action: 'show_stream', stream_id, label, wid }
//    { action: 'close',       wid }
//    { action: 'close_all' }
//
//  Ported from Nandi_Frontend/src/lib/visionControl.js, keeping its
//  StrictMode-safe socket supersession guards.
// ═══════════════════════════════════════════════════════════

import { brainWs, getClientId, getToken, resolveBrain } from './endpoints'

const RECONNECT_MS = 4000

export interface VisionCommand {
  action: 'show_frame' | 'show_stream' | 'close' | 'close_all'
  wid?: string
  label?: string
  stream_id?: string
  image_b64?: string
}

type CommandListener = (cmd: VisionCommand) => void
type StateListener = (connected: boolean) => void

let ws: WebSocket | null = null
let connected = false
let reconnectTimer: ReturnType<typeof setTimeout> | null = null

const commandListeners = new Set<CommandListener>()
const stateListeners = new Set<StateListener>()

function setConnected(next: boolean) {
  if (connected === next) return
  connected = next
  stateListeners.forEach((fn) => fn(next))
}

export function isVisionControlConnected(): boolean {
  return connected
}

export function onVisionCommand(fn: CommandListener): () => void {
  commandListeners.add(fn)
  return () => commandListeners.delete(fn)
}

export function onVisionControlState(fn: StateListener): () => void {
  stateListeners.add(fn)
  fn(connected)
  return () => stateListeners.delete(fn)
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

  await resolveBrain()

  let sock: WebSocket
  try {
    sock = new WebSocket(brainWs('/ws/vision-control'))
  } catch {
    scheduleReconnect()
    return
  }
  ws = sock

  sock.onopen = () => {
    if (ws !== sock) return
    sock.send(
      JSON.stringify({ type: 'register', client_id: getClientId(), token: getToken() }),
    )
  }

  sock.onmessage = (event) => {
    if (ws !== sock) return

    let msg: VisionCommand & { type?: string; error?: string }
    try {
      msg = JSON.parse(event.data as string)
    } catch {
      return
    }

    if (msg.type === 'registered') {
      setConnected(true)
      return
    }
    if (msg.error) return
    if (msg.action) commandListeners.forEach((fn) => fn(msg))
  }

  sock.onclose = () => {
    if (ws !== sock) return
    ws = null
    setConnected(false)
    scheduleReconnect()
  }
}

export function startVisionControl(): void {
  void connect()
}

export function stopVisionControl(): void {
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
  setConnected(false)
}
