import { useEffect, useRef, useState } from 'react'
import { CloseIcon } from '../icons/Icons'
import { CaptureIcon, RefreshIcon, SwapIcon } from '../icons/DashboardIcons'
import type { Consumer, ConsumerState, Producer } from '../../lib/nandi/webrtc'
import { startConsumer } from '../../lib/nandi/webrtc'
import { StatusPill } from './StatusPill'

export type TileKind = 'stream' | 'frame' | 'camera'

export interface StreamTileModel {
  id: string
  kind: TileKind
  label: string
  streamId?: string
  imageB64?: string
  producer?: Producer
}

interface StreamTileProps {
  tile: StreamTileModel
  onClose: (id: string) => void
  onCapture: (file: File, label: string) => void
}

const STATE_COPY: Record<ConsumerState, string> = {
  connecting: 'Connecting…',
  waiting: 'Waiting for producer…',
  connected: 'Live',
  offline: 'Producer offline · retrying',
  failed: 'Connection failed · retrying',
}

function tileButtonClass(danger = false) {
  return `grid h-7 w-7 place-items-center rounded-full text-fg-muted transition-colors hover:bg-fg/10 ${
    danger ? 'hover:text-rose-700' : 'hover:text-fg'
  }`
}

export function StreamTile({ tile, onClose, onCapture }: StreamTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const consumerRef = useRef<Consumer | null>(null)
  const [state, setState] = useState<ConsumerState>(
    tile.kind === 'frame' ? 'connected' : 'connecting',
  )
  const [facing, setFacing] = useState(tile.producer?.getFacingMode() ?? 'environment')

  // ── Remote stream: WebRTC consumer with auto-reconnect ──
  useEffect(() => {
    if (tile.kind !== 'stream' || !tile.streamId) return

    const consumer = startConsumer(tile.streamId, {
      onTrack: (stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream
        setState('connected')
      },
      onState: setState,
    })
    consumerRef.current = consumer
    return () => consumer.close()
  }, [tile.kind, tile.streamId])

  // ── Local camera: attach the producer's stream, follow switches ──
  useEffect(() => {
    const producer = tile.producer
    if (tile.kind !== 'camera' || !producer) return

    if (videoRef.current) videoRef.current.srcObject = producer.getStream()
    setState('connected')

    return producer.onStreamChange((stream) => {
      if (videoRef.current) videoRef.current.srcObject = stream
      setFacing(producer.getFacingMode())
    })
  }, [tile.kind, tile.producer])

  function handleCapture() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const finalize = (blob: Blob | null) => {
      if (!blob) return
      const safe = (tile.label || tile.streamId || 'capture')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40)
      const file = new File([blob], `capture_${safe}_${Date.now()}.jpg`, { type: 'image/jpeg' })
      onCapture(file, tile.label)
    }

    if (tile.kind === 'frame' && tile.imageB64) {
      const img = new Image()
      img.onload = () => {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
        canvas.toBlob(finalize, 'image/jpeg', 0.92)
      }
      img.src = `data:image/jpeg;base64,${tile.imageB64}`
      return
    }

    const video = videoRef.current
    if (!video?.videoWidth) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)
    canvas.toBlob(finalize, 'image/jpeg', 0.92)
  }

  async function handleSwitch() {
    if (!tile.producer) return
    try {
      await tile.producer.switchCamera()
      setFacing(tile.producer.getFacingMode())
    } catch (err) {
      console.error('[vision] camera switch failed:', err)
    }
  }

  const live = state === 'connected'

  return (
    <article className="overflow-hidden rounded-2xl bg-surface ring-1 ring-fg/8">
      <header className="flex items-center justify-between gap-2 border-b border-fg/5 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusPill
            tone={live ? 'ok' : state === 'offline' || state === 'failed' ? 'err' : 'warn'}
            pulse={!live}
            label={live ? 'Live' : 'Link'}
          />
          <span className="truncate text-sm font-medium text-fg" title={tile.label}>
            {tile.label}
          </span>
          {tile.kind === 'camera' && (
            <span className="shrink-0 text-[11px] text-fg-muted">[{facing === 'environment' ? 'back' : 'front'}]</span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          {tile.kind === 'camera' && (
            <button
              type="button"
              className={tileButtonClass()}
              title="Switch front / back camera"
              onClick={handleSwitch}
            >
              <SwapIcon className="h-4 w-4" />
            </button>
          )}
          {tile.kind === 'stream' && (
            <button
              type="button"
              className={tileButtonClass()}
              title="Reconnect"
              onClick={() => consumerRef.current?.refresh()}
            >
              <RefreshIcon className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className={tileButtonClass()}
            title="Capture frame and attach to chat"
            onClick={handleCapture}
          >
            <CaptureIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            className={tileButtonClass(true)}
            title="Close"
            onClick={() => onClose(tile.id)}
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative aspect-video bg-ink">
        {tile.kind === 'frame' ? (
          <img
            src={`data:image/jpeg;base64,${tile.imageB64}`}
            alt={tile.label}
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            autoPlay
            playsInline
            muted
          />
        )}

        {!live && tile.kind === 'stream' && (
          <div className="absolute inset-0 grid place-items-center bg-ink/70 px-4 text-center text-xs font-medium text-fg-muted">
            {STATE_COPY[state]}
          </div>
        )}
      </div>
    </article>
  )
}
