// ═══════════════════════════════════════════════════════════
//  speech.ts — mic capture → /api/stt, and text → /api/tts playback
//
//  Ported from Nandi_Frontend's audioRecorder.js + ttsPlayer.js. Both
//  proxy through the brain server, so no provider keys live in the browser.
// ═══════════════════════════════════════════════════════════

import { brainHttp, getToken, resolveBrain } from './endpoints'

const SILENCE_THRESHOLD = 0.015 // RMS below this counts as silence
const SILENCE_DURATION = 1600 // ms of silence before auto-stop
const MIN_RECORD_TIME = 600 // ms — ignore accidental taps

type VolumeCallback = (rms: number) => void

function rmsOf(analyser: AnalyserNode): number {
  const data = new Uint8Array(analyser.fftSize)
  analyser.getByteTimeDomainData(data)
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128
    sum += v * v
  }
  return Math.sqrt(sum / data.length)
}

// ── Recording ────────────────────────────────────────────

let mediaStream: MediaStream | null = null
let mediaRecorder: MediaRecorder | null = null
let recorderContext: AudioContext | null = null
let recorderAnalyser: AnalyserNode | null = null
let silenceTimer: ReturnType<typeof setTimeout> | null = null
let rafId = 0

function cleanupRecorder() {
  cancelAnimationFrame(rafId)
  if (silenceTimer) {
    clearTimeout(silenceTimer)
    silenceTimer = null
  }
  recorderContext?.close().catch(() => {})
  recorderContext = null
  recorderAnalyser = null
  mediaStream?.getTracks().forEach((t) => t.stop())
  mediaStream = null
}

export function isRecording(): boolean {
  return mediaRecorder?.state === 'recording'
}

export function stopRecording(): void {
  if (mediaRecorder?.state === 'recording') mediaRecorder.stop()
}

/**
 * Record until silence (or an explicit stopRecording) and resolve with the
 * transcript. Resolves with '' when the clip is too short to be speech.
 */
export async function recordAndTranscribe(onVolume?: VolumeCallback): Promise<string> {
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  recorderContext = new AudioContext()
  const source = recorderContext.createMediaStreamSource(mediaStream)
  recorderAnalyser = recorderContext.createAnalyser()
  recorderAnalyser.fftSize = 2048
  source.connect(recorderAnalyser)

  const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm'

  const recorder = new MediaRecorder(mediaStream, { mimeType })
  mediaRecorder = recorder
  const chunks: Blob[] = []
  const startedAt = Date.now()

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data)
  }

  const monitor = () => {
    if (!recorderAnalyser) return
    const rms = rmsOf(recorderAnalyser)
    onVolume?.(rms)

    if (rms < SILENCE_THRESHOLD) {
      if (!silenceTimer) {
        silenceTimer = setTimeout(() => {
          if (Date.now() - startedAt > MIN_RECORD_TIME) stopRecording()
        }, SILENCE_DURATION)
      }
    } else if (silenceTimer) {
      clearTimeout(silenceTimer)
      silenceTimer = null
    }

    rafId = requestAnimationFrame(monitor)
  }

  const done = new Promise<Blob>((resolve) => {
    recorder.onstop = () => {
      cleanupRecorder()
      onVolume?.(0)
      resolve(new Blob(chunks, { type: recorder.mimeType }))
    }
  })

  recorder.start(250)
  monitor()

  const blob = await done
  mediaRecorder = null
  if (blob.size < 1000) return ''

  return await transcribe(blob)
}

async function transcribe(blob: Blob): Promise<string> {
  await resolveBrain()

  const form = new FormData()
  form.append('audio', blob, 'recording.webm')

  const token = getToken()
  const res = await fetch(`${brainHttp()}/api/stt`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: form,
  })
  if (!res.ok) throw new Error(`STT failed: ${res.status}`)

  const data = await res.json()
  return data.text || ''
}

// ── Playback ─────────────────────────────────────────────

let playbackContext: AudioContext | null = null
let playbackSource: AudioBufferSourceNode | null = null
let playing = false
let playbackRaf = 0

export function isSpeaking(): boolean {
  return playing
}

export function stopSpeaking(): void {
  playing = false
  cancelAnimationFrame(playbackRaf)
  try {
    playbackSource?.stop()
  } catch {
    /* already stopped */
  }
  playbackContext?.close().catch(() => {})
  playbackSource = null
  playbackContext = null
}

/** Speak `text` through the backend TTS proxy, reporting output level. */
export async function speak(
  text: string,
  onVolume?: VolumeCallback,
  onEnd?: () => void,
): Promise<void> {
  stopSpeaking()
  await resolveBrain()

  const token = getToken()
  try {
    const res = await fetch(`${brainHttp()}/api/tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) throw new Error(`TTS failed: ${res.status}`)

    const buffer = await res.arrayBuffer()
    const ctx = new AudioContext()
    playbackContext = ctx

    const audioBuffer = await ctx.decodeAudioData(buffer)
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    playbackSource = source

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    source.connect(analyser)
    analyser.connect(ctx.destination)

    const monitor = () => {
      if (!playing) return
      onVolume?.(rmsOf(analyser))
      playbackRaf = requestAnimationFrame(monitor)
    }

    playing = true
    source.start(0)
    monitor()

    source.onended = () => {
      playing = false
      cancelAnimationFrame(playbackRaf)
      onVolume?.(0)
      onEnd?.()
    }
  } catch (err) {
    console.error('[tts] failed:', err)
    playing = false
    onEnd?.()
  }
}
