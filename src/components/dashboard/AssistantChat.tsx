import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { Ref } from 'react'
import { CloseIcon } from '../icons/Icons'
import { CameraIcon, MicIcon, PaperclipIcon, SendIcon, SpeakerIcon } from '../icons/DashboardIcons'
import type { Attachment, BrainState } from '../../lib/nandi/brainSocket'
import {
  ensureBrainConnection,
  onBrainReply,
  onBrainState,
  sendQuery,
  uploadFile,
} from '../../lib/nandi/brainSocket'
import { isSpeaking, recordAndTranscribe, speak, stopRecording, stopSpeaking } from '../../lib/nandi/speech'
import { StatusPill } from './StatusPill'

const TTS_KEY = 'nandi_tts_enabled'

export interface AssistantChatHandle {
  /** Push files (e.g. a captured video frame) into the composer. */
  attachFiles: (files: File[]) => void
  focus: () => void
}

interface AssistantChatProps {
  onCameraToggle: () => void
  onStateChange?: (state: BrainState) => void
  ref?: Ref<AssistantChatHandle>
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
  pending?: boolean
  attachments?: Attachment[]
}

type UploadStatus = 'uploading' | 'done' | 'error'

interface PendingUpload {
  id: string
  filename: string
  status: UploadStatus
  attachment?: Attachment
}

let idCounter = 0
const nextId = () => `m_${++idCounter}_${Date.now()}`

const STATE_PILL: Record<BrainState, { tone: 'ok' | 'warn' | 'err' | 'idle'; label: string }> = {
  connected: { tone: 'ok', label: 'Connected' },
  connecting: { tone: 'warn', label: 'Connecting' },
  offline: { tone: 'err', label: 'Offline' },
  unauthorized: { tone: 'err', label: 'No token' },
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function AssistantChat({ onCameraToggle, onStateChange, ref }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [uploads, setUploads] = useState<PendingUpload[]>([])
  const [state, setState] = useState<BrainState>('offline')
  const [recording, setRecording] = useState(false)
  const [ttsEnabled, setTtsEnabled] = useState(
    () => localStorage.getItem(TTS_KEY) !== 'false',
  )

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  // ── Socket wiring ──────────────────────────────────────
  useEffect(() => {
    const offState = onBrainState((next) => {
      setState(next)
      onStateChange?.(next)
    })

    const offReply = onBrainReply(({ response_text }) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        const reply: ChatMessage = {
          id: nextId(),
          role: 'assistant',
          text: response_text,
          ts: Date.now(),
        }
        // Replace the "thinking" placeholder rather than stacking under it.
        return last?.pending ? [...prev.slice(0, -1), reply] : [...prev, reply]
      })

      if (localStorage.getItem(TTS_KEY) !== 'false') void speak(response_text)
    })

    ensureBrainConnection()
    return () => {
      offState()
      offReply()
    }
  }, [onStateChange])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-grow the composer up to a sensible cap.
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`
  }, [draft])

  // ── Uploads ────────────────────────────────────────────
  const addFiles = useCallback((files: File[]) => {
    const entries: PendingUpload[] = files.map((file) => ({
      id: nextId(),
      filename: file.name,
      status: 'uploading',
    }))
    setUploads((prev) => [...prev, ...entries])

    files.forEach((file, i) => {
      const entryId = entries[i].id
      uploadFile(file)
        .then((attachment) => {
          setUploads((prev) =>
            prev.map((u) => (u.id === entryId ? { ...u, status: 'done', attachment } : u)),
          )
        })
        .catch((err: Error) => {
          console.error('[chat] upload failed:', err)
          setUploads((prev) => prev.map((u) => (u.id === entryId ? { ...u, status: 'error' } : u)))
        })
    })
  }, [])

  useImperativeHandle(ref, () => ({
    attachFiles: addFiles,
    focus: () => textareaRef.current?.focus(),
  }))

  // ── Send ───────────────────────────────────────────────
  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      const ready = uploads.filter((u) => u.status === 'done' && u.attachment)
      const attachments = ready.map((u) => u.attachment!)

      if (!trimmed && attachments.length === 0) return
      if (uploads.some((u) => u.status === 'uploading')) return

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'user',
          text: trimmed || '(file attachment)',
          ts: Date.now(),
          attachments: attachments.length ? attachments : undefined,
        },
        { id: nextId(), role: 'assistant', text: '', ts: Date.now(), pending: true },
      ])

      sendQuery(trimmed, attachments)
      setDraft('')
      setUploads([])
    },
    [uploads],
  )

  // ── Mic ────────────────────────────────────────────────
  async function handleMic() {
    if (recording) {
      stopRecording()
      setRecording(false)
      return
    }

    setRecording(true)
    try {
      const transcript = await recordAndTranscribe()
      if (transcript) {
        if (localStorage.getItem('nandi_auto_send_stt') !== 'false') send(transcript)
        else setDraft((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }
    } catch (err) {
      console.error('[chat] mic failed:', err)
    } finally {
      setRecording(false)
    }
  }

  function handleTtsToggle() {
    setTtsEnabled((prev) => {
      const next = !prev
      localStorage.setItem(TTS_KEY, String(next))
      if (!next && isSpeaking()) stopSpeaking()
      return next
    })
  }

  const uploading = uploads.some((u) => u.status === 'uploading')
  const canSend = (draft.trim().length > 0 || uploads.some((u) => u.status === 'done')) && !uploading
  const pill = STATE_PILL[state]

  const iconButton =
    'grid h-9 w-9 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-fg/8 hover:text-fg'

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl bg-surface ring-1 ring-fg/8">
      <header className="flex items-center justify-between gap-2 border-b border-fg/5 px-4 py-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-accent uppercase">Decide</p>
          <h2 className="text-base font-semibold text-fg">Assistant</h2>
        </div>
        <StatusPill tone={pill.tone} pulse={state === 'connecting'} label={pill.label} />
      </header>

      {state === 'unauthorized' && (
        <p className="border-b border-fg/5 bg-rose-500/8 px-4 py-2.5 text-xs leading-relaxed text-rose-700">
          The brain API rejected the session token. Paste a valid one in the top bar to enable chat,
          uploads, speech, and the activity log.
        </p>
      )}

      {/* ── Messages ── */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-sm text-fg-muted">
              Ask about a reading, request a stream, or drop a file.
            </p>
            <p className="mt-1.5 text-xs text-fg-muted/70">
              Enter sends · Shift+Enter for a newline
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
              {msg.role === 'user' ? 'You' : 'Nandi'}
            </span>
            <div
              className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-accent text-accent-ink'
                  : 'bg-surface-raised text-fg ring-1 ring-fg/8'
              }`}
            >
              {msg.pending ? (
                <span className="text-fg-muted italic">Thinking…</span>
              ) : (
                msg.text
              )}
            </div>
            {msg.attachments && (
              <div className="flex flex-wrap justify-end gap-1.5">
                {msg.attachments.map((att) => (
                  <span
                    key={att.file_id}
                    className="rounded-full bg-fg/5 px-2 py-0.5 text-[11px] text-fg-muted"
                  >
                    {att.filename}
                  </span>
                ))}
              </div>
            )}
            <span className="text-[10px] tabular-nums text-fg-muted/70">{formatTime(msg.ts)}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* ── Attachment strip ── */}
      {uploads.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-fg/5 px-4 py-2.5">
          {uploads.map((u) => (
            <span
              key={u.id}
              className={`inline-flex max-w-[180px] items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] ring-1 ${
                u.status === 'error'
                  ? 'bg-rose-500/10 text-rose-700 ring-rose-500/30'
                  : u.status === 'done'
                    ? 'bg-emerald-500/10 text-emerald-700 ring-emerald-400/25'
                    : 'bg-fg/5 text-fg-muted ring-fg/10'
              }`}
            >
              <span className="truncate">{u.filename}</span>
              <span className="shrink-0">
                {u.status === 'uploading' ? '…' : u.status === 'done' ? '✓' : '!'}
              </span>
              <button
                type="button"
                aria-label={`Remove ${u.filename}`}
                disabled={u.status === 'uploading'}
                onClick={() => setUploads((prev) => prev.filter((x) => x.id !== u.id))}
                className="shrink-0 disabled:opacity-40"
              >
                <CloseIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* ── Composer ── */}
      <div className="border-t border-fg/5 p-3">
        <div className="flex items-end gap-1 rounded-2xl bg-ink px-2 py-1.5 ring-1 ring-fg/10 focus-within:ring-accent/40">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files) addFiles(Array.from(e.target.files))
              e.target.value = ''
            }}
          />

          <button
            type="button"
            className={iconButton}
            title="Attach files"
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon className="h-4.5 w-4.5" />
          </button>

          <textarea
            ref={textareaRef}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(draft)
              }
            }}
            placeholder="Message Nandi…"
            aria-label="Message"
            className="min-h-9 flex-1 resize-none self-center bg-transparent px-1 py-2 text-sm text-fg outline-none placeholder:text-fg-muted"
          />

          <button type="button" className={iconButton} title="Toggle my camera" onClick={onCameraToggle}>
            <CameraIcon className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            className={`${iconButton} ${recording ? 'bg-rose-500/20 text-rose-700' : ''}`}
            title={recording ? 'Stop recording' : 'Voice input'}
            onClick={() => void handleMic()}
          >
            <MicIcon className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            className={`${iconButton} ${ttsEnabled ? 'text-accent' : ''}`}
            title={ttsEnabled ? 'Spoken replies on' : 'Spoken replies off'}
            onClick={handleTtsToggle}
          >
            <SpeakerIcon className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-ink transition-opacity hover:bg-accent-strong disabled:opacity-30"
            title="Send"
            disabled={!canSend}
            onClick={() => send(draft)}
          >
            <SendIcon className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
