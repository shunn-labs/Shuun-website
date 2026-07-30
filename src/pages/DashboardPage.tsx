import { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityLog } from '../components/dashboard/ActivityLog'
import type { AssistantChatHandle } from '../components/dashboard/AssistantChat'
import { AssistantChat } from '../components/dashboard/AssistantChat'
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar'
import { SensorGrid } from '../components/dashboard/SensorGrid'
import type { StreamGridHandle } from '../components/dashboard/StreamGrid'
import { StreamGrid } from '../components/dashboard/StreamGrid'
import type { BrainState } from '../lib/nandi/brainSocket'

/**
 * Mission control: live sensor telemetry, the video wall, and the assistant
 * side by side. Sign-in is intentionally out of the loop for now — the page
 * talks straight to the brain and vision APIs with whatever session token is
 * stored locally.
 */
export function DashboardPage() {
  const [brainState, setBrainState] = useState<BrainState>('offline')
  const [logsOpen, setLogsOpen] = useState(false)
  const [dragging, setDragging] = useState(false)

  const chatRef = useRef<AssistantChatHandle>(null)
  const streamsRef = useRef<StreamGridHandle>(null)
  const dragDepth = useRef(0)

  useEffect(() => {
    document.title = 'Mission control — Shunn Labs'
  }, [])

  // ── Vision capture → chat attachment ───────────────────
  const handleCaptureToChat = useCallback((file: File) => {
    chatRef.current?.attachFiles([file])
    chatRef.current?.focus()
  }, [])

  const handleCameraToggle = useCallback(() => {
    streamsRef.current?.toggleCamera()
  }, [])

  // ── Keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        chatRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // ── Drop files anywhere to attach ──────────────────────
  useEffect(() => {
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragDepth.current += 1
      setDragging(true)
    }
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragDepth.current -= 1
      if (dragDepth.current <= 0) {
        dragDepth.current = 0
        setDragging(false)
      }
    }
    const onDragOver = (e: DragEvent) => e.preventDefault()
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      dragDepth.current = 0
      setDragging(false)
      const files = e.dataTransfer?.files
      if (files?.length) chatRef.current?.attachFiles(Array.from(files))
    }

    document.addEventListener('dragenter', onDragEnter)
    document.addEventListener('dragleave', onDragLeave)
    document.addEventListener('dragover', onDragOver)
    document.addEventListener('drop', onDrop)
    return () => {
      document.removeEventListener('dragenter', onDragEnter)
      document.removeEventListener('dragleave', onDragLeave)
      document.removeEventListener('dragover', onDragOver)
      document.removeEventListener('drop', onDrop)
    }
  }, [])

  return (
    <div className="min-h-svh bg-ink">
      <DashboardTopBar
        brainState={brainState}
        logsOpen={logsOpen}
        onToggleLogs={() => setLogsOpen((v) => !v)}
      />

      <main className="mx-auto grid max-w-[1600px] gap-6 px-5 py-6 lg:px-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-10">
          <SensorGrid />
          <StreamGrid ref={streamsRef} onCaptureToChat={handleCaptureToChat} />
          {logsOpen && (
            <section className="h-[340px] xl:hidden">
              <ActivityLog />
            </section>
          )}
        </div>

        {/* Right rail: chat, plus the log drawer on wide screens. */}
        <div className="flex min-w-0 flex-col gap-6 xl:sticky xl:top-[73px] xl:h-[calc(100svh-97px)]">
          <div className={`min-h-[520px] ${logsOpen ? 'xl:flex-1' : 'xl:flex-1'}`}>
            <AssistantChat
              ref={chatRef}
              onCameraToggle={handleCameraToggle}
              onStateChange={setBrainState}
            />
          </div>
          {logsOpen && (
            <div className="hidden h-[280px] shrink-0 xl:block">
              <ActivityLog />
            </div>
          )}
        </div>
      </main>

      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-50 grid place-items-center bg-ink/80 backdrop-blur-sm">
          <span className="rounded-2xl border-2 border-dashed border-accent px-8 py-6 font-display text-lg font-semibold text-accent">
            Drop files to attach
          </span>
        </div>
      )}
    </div>
  )
}
