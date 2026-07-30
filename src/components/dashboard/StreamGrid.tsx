import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import { PlusIcon, RefreshIcon } from '../icons/DashboardIcons'
import { getClientId } from '../../lib/nandi/endpoints'
import { onVisionCommand, onVisionControlState, startVisionControl } from '../../lib/nandi/visionControl'
import type { Producer } from '../../lib/nandi/webrtc'
import { discoverStreams, startProducer } from '../../lib/nandi/webrtc'
import { SectionHeading } from './SectionHeading'
import { StatusPill } from './StatusPill'
import type { StreamTileModel } from './StreamTile'
import { StreamTile } from './StreamTile'

export interface StreamGridHandle {
  toggleCamera: () => void
  isCameraOn: () => boolean
}

interface StreamGridProps {
  onCaptureToChat: (file: File, label: string) => void
  ref?: Ref<StreamGridHandle>
}

let tileCounter = 0
const nextTileId = () => `tile_${++tileCounter}_${Date.now()}`

/**
 * The video wall. Tiles come from three places:
 *   - vision-agent commands over /ws/vision-control (frames and streams)
 *   - stream ids the operator adds by hand or picks from discovery
 *   - this browser's own camera, published back as a WebRTC producer
 *
 * Frames stack (each is evidence worth keeping); streams dedupe by id.
 */
export function StreamGrid({ onCaptureToChat, ref }: StreamGridProps) {
  const [tiles, setTiles] = useState<StreamTileModel[]>([])
  const [controlConnected, setControlConnected] = useState(false)
  const [manualId, setManualId] = useState('')
  const [available, setAvailable] = useState<string[]>([])
  const [discovering, setDiscovering] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const producerRef = useRef<Producer | null>(null)

  const openStream = useCallback((streamId: string, label?: string) => {
    const id = `stream_${streamId}`
    setTiles((prev) =>
      prev.some((t) => t.id === id)
        ? prev
        : [...prev, { id, kind: 'stream', label: label || streamId, streamId }],
    )
  }, [])

  // ── Vision-agent commands ──────────────────────────────
  useEffect(() => {
    startVisionControl()
    const offState = onVisionControlState(setControlConnected)

    const offCommand = onVisionCommand((msg) => {
      if (msg.action === 'show_frame') {
        setTiles((prev) => [
          ...prev,
          {
            id: nextTileId(),
            kind: 'frame',
            label: msg.label || 'Frame',
            imageB64: msg.image_b64,
          },
        ])
        return
      }

      if (msg.action === 'show_stream' && msg.stream_id) {
        const id = msg.wid || `stream_${msg.stream_id}`
        setTiles((prev) =>
          prev.some((t) => t.id === id)
            ? prev
            : [
                ...prev,
                {
                  id,
                  kind: 'stream',
                  label: msg.label || msg.stream_id!,
                  streamId: msg.stream_id,
                },
              ],
        )
        return
      }

      if (msg.action === 'close' && msg.wid) {
        setTiles((prev) => prev.filter((t) => t.id !== msg.wid))
        return
      }

      if (msg.action === 'close_all') {
        producerRef.current?.close()
        producerRef.current = null
        setCameraOn(false)
        setTiles([])
      }
    })

    return () => {
      offState()
      offCommand()
    }
  }, [])

  // ── Discover what the vision server currently has live ──
  const refreshAvailable = useCallback(async () => {
    setDiscovering(true)
    try {
      const found = await discoverStreams()
      const merged = [...new Set([...found.producers, ...found.processing, ...found.processed])]
      setAvailable(merged)
    } catch {
      setAvailable([])
    } finally {
      setDiscovering(false)
    }
  }, [])

  useEffect(() => {
    void refreshAvailable()
    const id = setInterval(() => void refreshAvailable(), 20000)
    return () => clearInterval(id)
  }, [refreshAvailable])

  // ── Local camera producer ──────────────────────────────
  const startCamera = useCallback(async () => {
    if (producerRef.current) return

    const streamId = `${getClientId()}_camera`
    try {
      const producer = await startProducer({ streamId })
      producerRef.current = producer
      setCameraOn(true)
      setTiles((prev) => [
        ...prev,
        {
          id: `camera_${streamId}`,
          kind: 'camera',
          label: `My camera · ${streamId}`,
          producer,
        },
      ])
    } catch (err) {
      console.error('[vision] camera producer failed:', err)
    }
  }, [])

  const stopCamera = useCallback(() => {
    producerRef.current?.close()
    producerRef.current = null
    setCameraOn(false)
    setTiles((prev) => prev.filter((t) => t.kind !== 'camera'))
  }, [])

  useImperativeHandle(ref, () => ({
    toggleCamera: () => (producerRef.current ? stopCamera() : void startCamera()),
    isCameraOn: () => producerRef.current !== null,
  }))

  // Stop publishing if the dashboard unmounts.
  useEffect(() => () => producerRef.current?.close(), [])

  const handleClose = useCallback(
    (id: string) => {
      setTiles((prev) => {
        const target = prev.find((t) => t.id === id)
        if (target?.kind === 'camera') stopCamera()
        return prev.filter((t) => t.id !== id)
      })
    },
    [stopCamera],
  )

  function addManual() {
    const sid = manualId.trim()
    if (!sid) return
    openStream(sid)
    setManualId('')
  }

  const unopened = available.filter((sid) => !tiles.some((t) => t.streamId === sid))

  return (
    <section aria-labelledby="streams-heading">
      <SectionHeading
        id="streams-heading"
        eyebrow="See"
        title="Live video streams"
        meta={
          <>
            <StatusPill
              tone={controlConnected ? 'ok' : 'idle'}
              pulse={!controlConnected}
              label={controlConnected ? 'Vision link' : 'Vision offline'}
              title="WebSocket to the brain server that carries vision-agent commands"
            />
            <span className="text-xs tabular-nums text-fg-muted">
              {tiles.length} tile{tiles.length === 1 ? '' : 's'}
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={() => (cameraOn ? stopCamera() : void startCamera())}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                cameraOn
                  ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30 hover:bg-rose-500/25'
                  : 'bg-accent text-accent-ink hover:bg-accent-strong'
              }`}
            >
              {cameraOn ? 'Stop my camera' : 'Publish my camera'}
            </button>
            {tiles.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  stopCamera()
                  setTiles([])
                }}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
              >
                Close all
              </button>
            )}
          </>
        }
      />

      {/* ── Add a stream ── */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <div className="flex min-w-[240px] flex-1 items-center gap-2 rounded-full bg-surface px-2 py-1.5 ring-1 ring-white/8 focus-within:ring-accent/40">
          <input
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addManual()}
            placeholder="Stream ID (e.g. pc_cam)"
            aria-label="Stream ID"
            className="min-w-0 flex-1 bg-transparent px-2 text-sm text-fg outline-none placeholder:text-fg-muted"
          />
          <button
            type="button"
            onClick={addManual}
            disabled={!manualId.trim()}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-opacity disabled:opacity-30"
            title="Open stream"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => void refreshAvailable()}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
        >
          <RefreshIcon className={`h-3.5 w-3.5 ${discovering ? 'animate-spin' : ''}`} />
          Discover
        </button>
      </div>

      {unopened.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
            Live on server
          </span>
          {unopened.map((sid) => (
            <button
              key={sid}
              type="button"
              onClick={() => openStream(sid)}
              className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-fg transition-colors hover:bg-accent hover:text-accent-ink"
            >
              + {sid}
            </button>
          ))}
        </div>
      )}

      {/* ── Tiles ── */}
      {tiles.length === 0 ? (
        <div className="mt-4 grid place-items-center rounded-2xl bg-surface px-6 py-16 text-center ring-1 ring-white/8">
          <p className="text-sm font-medium text-fg">No streams open</p>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-fg-muted">
            Add a stream ID above, pick a live one from discovery, publish this device's camera, or
            ask the assistant to show you a feed.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {tiles.map((tile) => (
            <StreamTile
              key={tile.id}
              tile={tile}
              onClose={handleClose}
              onCapture={onCaptureToChat}
            />
          ))}
        </div>
      )}
    </section>
  )
}
