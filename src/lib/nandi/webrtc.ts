// ═══════════════════════════════════════════════════════════
//  webrtc.ts — WebRTC consumer + producer against the vision server
//
//  Consumer: auto-reconnect on producer offline / signaling drop.
//  Producer: tolerant consumer-join signaling (the server names the peer
//  field inconsistently), buffered answers/ICE, live camera switching.
//
//  Ported from Nandi_Frontend/src/lib/webrtcConsumer.js.
// ═══════════════════════════════════════════════════════════

import { resolveVision, signalUrl, visionHttp } from './endpoints'

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

export type LogKind = 'info' | 'ok' | 'warn' | 'err'
export type ConsumerState = 'connecting' | 'waiting' | 'connected' | 'offline' | 'failed'

interface ConsumerCallbacks {
  onTrack?: (stream: MediaStream) => void
  onState?: (state: ConsumerState) => void
  onLog?: (text: string, kind: LogKind) => void
}

export interface Consumer {
  close: () => void
  refresh: () => void
}

interface SignalMessage {
  type?: string
  sdp?: string
  from_stream?: string
  from?: string
  consumer_id?: string
  peer_id?: string
  to?: string
  message?: string
  candidate?: RTCIceCandidateInit
}

// ════════════════════════ CONSUMER ════════════════════════

export function startConsumer(streamId: string, callbacks: ConsumerCallbacks = {}): Consumer {
  const { onTrack, onState, onLog } = callbacks
  const log = (text: string, kind: LogKind = 'info') => onLog?.(text, kind)

  let ws: WebSocket | null = null
  let pc: RTCPeerConnection | null = null
  let closed = false
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let attempts = 0

  function teardown() {
    try {
      pc?.close()
    } catch {
      /* noop */
    }
    try {
      ws?.close()
    } catch {
      /* noop */
    }
    pc = null
    ws = null
  }

  function scheduleReconnect() {
    if (closed || reconnectTimer) return
    attempts += 1
    const delay = Math.min(2500 + attempts * 1500, 15000)
    log(`Reconnect in ${(delay / 1000).toFixed(1)}s`)
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      teardown()
      void connect()
    }, delay)
  }

  function handleOffer(sdp: string, fromStream: string) {
    try {
      pc?.close()
    } catch {
      /* noop */
    }

    const peer = new RTCPeerConnection({ iceServers: ICE_SERVERS })
    pc = peer

    peer.ontrack = (e) => {
      log('Video track received', 'ok')
      attempts = 0
      onTrack?.(e.streams[0])
    }

    peer.onicecandidate = (e) => {
      if (e.candidate && ws?.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'ice',
            to: fromStream,
            candidate: {
              candidate: e.candidate.candidate,
              sdpMid: e.candidate.sdpMid,
              sdpMLineIndex: e.candidate.sdpMLineIndex,
            },
          }),
        )
      }
    }

    peer.onconnectionstatechange = () => {
      const s = peer.connectionState
      log(`peer state: ${s}`, s === 'connected' ? 'ok' : 'info')
      if (s === 'connected') onState?.('connected')
      if (s === 'failed' || s === 'disconnected') {
        onState?.('failed')
        scheduleReconnect()
      }
    }

    peer
      .setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp }))
      .then(() => peer.createAnswer())
      .then((answer) => peer.setLocalDescription(answer))
      .then(() => {
        ws?.send(
          JSON.stringify({ type: 'answer', sdp: peer.localDescription?.sdp, to: fromStream }),
        )
        log('Handshake complete', 'ok')
      })
      .catch((err: Error) => {
        log(`Handshake failed: ${err.message}`, 'err')
        scheduleReconnect()
      })
  }

  async function connect() {
    if (closed) return
    await resolveVision()
    if (closed) return

    const url = signalUrl()
    log(`Connecting → ${url}`)
    try {
      ws = new WebSocket(url)
    } catch (err) {
      log(`WS error: ${(err as Error).message}`, 'err')
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      ws?.send(JSON.stringify({ type: 'register', role: 'consumer', stream_id: streamId }))
    }

    ws.onmessage = async (ev) => {
      let msg: SignalMessage
      try {
        msg = JSON.parse(ev.data as string)
      } catch {
        return
      }

      if (msg.type === 'registered') {
        log('Registered', 'ok')
      } else if (msg.type === 'waiting') {
        log(msg.message || 'Waiting for producer', 'warn')
        onState?.('waiting')
      } else if (msg.type === 'offer' && msg.sdp) {
        handleOffer(msg.sdp, msg.from_stream ?? '')
      } else if (msg.type === 'ice' && pc && msg.candidate?.candidate) {
        await pc.addIceCandidate(msg.candidate).catch(() => {})
      } else if (msg.type === 'stream_offline') {
        log('Producer offline — will retry', 'warn')
        onState?.('offline')
        teardown()
        scheduleReconnect()
      }
    }

    ws.onerror = () => log('Signaling error', 'err')
    ws.onclose = () => {
      if (closed) return
      log('Signaling closed')
      scheduleReconnect()
    }
  }

  function refresh() {
    if (closed) return
    // A healthy stream shouldn't be torn down by a refresh click — report
    // `connected` so the tile drops its overlay instead of hanging on
    // "Connecting…".
    if (pc && pc.connectionState === 'connected') {
      log('Already connected — refresh skipped')
      onState?.('connected')
      return
    }
    log('Manual refresh')
    onState?.('connecting')
    attempts = 0
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    teardown()
    void connect()
  }

  function close() {
    closed = true
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    teardown()
  }

  onState?.('connecting')
  void connect()
  return { close, refresh }
}

// ════════════════════════ PRODUCER ════════════════════════

interface ProducerOptions {
  streamId: string
  facingMode?: 'user' | 'environment'
  onLog?: (text: string, kind: LogKind) => void
}

export interface Producer {
  getStream: () => MediaStream
  getFacingMode: () => 'user' | 'environment'
  switchCamera: () => Promise<void>
  onStreamChange: (cb: (stream: MediaStream) => void) => () => void
  close: () => void
}

type PatchedPC = RTCPeerConnection & {
  _pendingIce?: RTCIceCandidateInit[]
  _pendingAnswer?: string | null
}

export async function startProducer({
  streamId,
  facingMode = 'environment',
  onLog,
}: ProducerOptions): Promise<Producer> {
  const log = (text: string, kind: LogKind = 'info') => onLog?.(text, kind)

  let currentStream: MediaStream
  let currentFacing: 'user' | 'environment' = facingMode
  let ws: WebSocket | null = null
  let closed = false

  const pcs: Record<string, PatchedPC> = {}
  const pendingPeers: string[] = []
  const streamListeners: ((s: MediaStream) => void)[] = []

  async function acquire(mode: 'user' | 'environment') {
    return await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false,
    })
  }

  currentStream = await acquire(currentFacing)
  log(`Got camera (${currentFacing})`, 'ok')

  async function applyAnswer(pc: PatchedPC, peerId: string, sdp: string) {
    try {
      await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp }))
      log(`Answer applied for ${peerId}`, 'ok')

      const idx = pendingPeers.indexOf(peerId)
      if (idx >= 0) pendingPeers.splice(idx, 1)

      if (pc._pendingIce?.length) {
        for (const cand of pc._pendingIce) await pc.addIceCandidate(cand).catch(() => {})
        pc._pendingIce = []
      }
    } catch (err) {
      log(`setRemoteDescription failed: ${(err as Error).message}`, 'err')
    }
  }

  async function startNewConsumer(peerId: string) {
    log(`New consumer joined: ${peerId}`)

    try {
      pcs[peerId]?.close()
    } catch {
      /* noop */
    }

    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS }) as PatchedPC
    pcs[peerId] = pc
    pc._pendingIce = []
    pendingPeers.push(peerId) // tracked before any await, so answers can match

    currentStream.getTracks().forEach((track) => pc.addTrack(track, currentStream))

    pc.onicecandidate = (e) => {
      if (e.candidate && ws?.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'ice',
            to: peerId,
            candidate: {
              candidate: e.candidate.candidate,
              sdpMid: e.candidate.sdpMid,
              sdpMLineIndex: e.candidate.sdpMLineIndex,
            },
          }),
        )
      }
    }

    pc.onconnectionstatechange = () => {
      log(`peer ${peerId}: ${pc.connectionState}`)
      if (['failed', 'closed', 'disconnected'].includes(pc.connectionState)) {
        try {
          pc.close()
        } catch {
          /* noop */
        }
        delete pcs[peerId]
        const i = pendingPeers.indexOf(peerId)
        if (i >= 0) pendingPeers.splice(i, 1)
      }
    }

    try {
      const offer = await pc.createOffer({
        offerToReceiveVideo: false,
        offerToReceiveAudio: false,
      })
      await pc.setLocalDescription(offer)
      ws?.send(JSON.stringify({ type: 'offer', sdp: pc.localDescription?.sdp, to: peerId }))
      log(`Offer sent to ${peerId}`, 'ok')

      // An answer can race in before setLocalDescription resolves.
      if (pc._pendingAnswer) {
        const sdp = pc._pendingAnswer
        pc._pendingAnswer = null
        await applyAnswer(pc, peerId, sdp)
      }
    } catch (err) {
      log(`Offer failed for ${peerId}: ${(err as Error).message}`, 'err')
    }
  }

  async function switchCamera() {
    const newMode = currentFacing === 'environment' ? 'user' : 'environment'
    log(`Switching camera → ${newMode}`)

    const newStream = await acquire(newMode)
    const newTrack = newStream.getVideoTracks()[0]
    if (!newTrack) {
      newStream.getTracks().forEach((t) => t.stop())
      log('No video track in new stream', 'err')
      return
    }

    for (const [pid, pc] of Object.entries(pcs)) {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
      if (!sender) continue
      try {
        await sender.replaceTrack(newTrack)
        log(`Replaced track in peer ${pid}`, 'ok')
      } catch (err) {
        log(`replaceTrack failed for ${pid}: ${(err as Error).message}`, 'warn')
      }
    }

    currentStream.getTracks().forEach((t) => t.stop())
    currentStream = newStream
    currentFacing = newMode
    streamListeners.forEach((cb) => cb(newStream))
  }

  function onStreamChange(cb: (s: MediaStream) => void) {
    streamListeners.push(cb)
    return () => {
      const i = streamListeners.indexOf(cb)
      if (i >= 0) streamListeners.splice(i, 1)
    }
  }

  function close() {
    closed = true
    currentStream.getTracks().forEach((t) => t.stop())
    Object.values(pcs).forEach((pc) => {
      try {
        pc.close()
      } catch {
        /* noop */
      }
    })
    try {
      ws?.close()
    } catch {
      /* noop */
    }
    ws = null
  }

  await resolveVision()
  const url = signalUrl()
  log(`Producer connecting → ${url}`)
  ws = new WebSocket(url)

  ws.onopen = () => {
    ws?.send(JSON.stringify({ type: 'register', role: 'producer', stream_id: streamId }))
    log(`Registered as producer ${streamId}`, 'ok')
  }

  ws.onmessage = async (ev) => {
    let msg: SignalMessage
    try {
      msg = JSON.parse(ev.data as string)
    } catch {
      return
    }

    if (msg.type === 'registered') {
      log('Server confirmed producer registration', 'ok')
      return
    }

    // The server has used several names for "a consumer wants your stream".
    if (
      msg.type === 'consumer_joined' ||
      msg.type === 'new_consumer' ||
      msg.type === 'consumer_register' ||
      msg.type === 'request_offer'
    ) {
      const peerId = msg.consumer_id || msg.from_stream || msg.from || msg.peer_id
      if (peerId) await startNewConsumer(peerId)
      else log('consumer-join message had no peer id', 'warn')
      return
    }

    if (msg.type === 'answer') {
      let peerId = msg.from_stream || msg.from || msg.consumer_id || msg.to
      let pc = peerId ? pcs[peerId] : undefined

      // FIFO fallback: oldest peer still awaiting an answer.
      if (!pc && pendingPeers.length) {
        peerId = pendingPeers[0]
        pc = pcs[peerId]
        log(`Answer matched by FIFO → ${peerId}`)
      }
      if (!pc || !msg.sdp) {
        log(`Answer with no matching peer ${peerId}`, 'warn')
        return
      }
      if (pc.signalingState !== 'have-local-offer') {
        pc._pendingAnswer = msg.sdp
        log(`Answer buffered (state=${pc.signalingState})`)
        return
      }
      await applyAnswer(pc, peerId as string, msg.sdp)
      return
    }

    if (msg.type === 'ice') {
      let peerId = msg.from_stream || msg.from || msg.consumer_id || msg.to
      let pc = peerId ? pcs[peerId] : undefined

      if (!pc && pendingPeers.length === 1) {
        peerId = pendingPeers[0]
        pc = pcs[peerId]
      } else if (!pc && Object.keys(pcs).length === 1) {
        peerId = Object.keys(pcs)[0]
        pc = pcs[peerId]
      }

      if (pc && msg.candidate?.candidate) {
        // addIceCandidate throws until a remote description exists.
        if (!pc.remoteDescription) {
          pc._pendingIce = pc._pendingIce || []
          pc._pendingIce.push(msg.candidate)
          return
        }
        await pc.addIceCandidate(msg.candidate).catch((err: Error) => {
          log(`ICE add failed: ${err.message}`, 'warn')
        })
      }
      return
    }

    if (msg.type === 'consumer_left' || msg.type === 'peer_left') {
      const peerId = msg.consumer_id || msg.from_stream || msg.peer_id
      if (peerId && pcs[peerId]) {
        try {
          pcs[peerId].close()
        } catch {
          /* noop */
        }
        delete pcs[peerId]
        const i = pendingPeers.indexOf(peerId)
        if (i >= 0) pendingPeers.splice(i, 1)
        log(`Consumer ${peerId} left`)
      }
    }
  }

  ws.onerror = () => log('Producer signaling error', 'err')
  ws.onclose = () => {
    if (!closed) log('Producer signaling closed', 'warn')
  }

  return {
    getStream: () => currentStream,
    getFacingMode: () => currentFacing,
    switchCamera,
    onStreamChange,
    close,
  }
}

// ════════════════════ STREAM DISCOVERY ════════════════════

export interface DiscoveredStreams {
  producers: string[]
  processing: string[]
  processed: string[]
}

/**
 * Ask the vision server which streams are live right now, so the dashboard
 * can offer them instead of making the operator remember stream ids.
 */
export async function discoverStreams(): Promise<DiscoveredStreams> {
  await resolveVision()
  const res = await fetch(`${visionHttp()}/api/vision/streams`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Stream list failed (${res.status})`)

  const json = await res.json()
  const processed = json.processed
  return {
    producers: json.signaling?.producers ?? [],
    processing: json.processing_streams ?? [],
    processed: Array.isArray(processed) ? processed : Object.keys(processed ?? {}),
  }
}
