// ═══════════════════════════════════════════════════════════
//  endpoints.ts — server discovery for the Nandi backends
//
//  Two backends are involved:
//    brain  (api.shuun.site)    — chat WS, logs WS, vision-control WS,
//                                 upload / download, STT / TTS
//    vision (vision.shuun.site) — WebRTC signaling + stream registry
//
//  Each has a production URL and a localhost fallback; we probe on
//  first use and stick to whichever answers.
// ═══════════════════════════════════════════════════════════

export const BRAIN_HOSTS = ['https://api.shuun.site', 'http://localhost:8000'] as const
export const VISION_HOSTS = ['https://vision.shuun.site', 'http://localhost:8765'] as const

export const TOKEN_KEY = 'user_token'
export const DEVICE_KEY = 'nandi_device_id'
export const SIGNAL_OVERRIDE_KEY = 'nandi_vision_signal_url'

let brainIndex = 0
let visionIndex = 0
let brainProbe: Promise<number> | null = null
let visionProbe: Promise<number> | null = null

function toWs(httpUrl: string): string {
  return httpUrl.replace(/^http/, 'ws')
}

async function probe(hosts: readonly string[], path: string): Promise<number> {
  for (let i = 0; i < hosts.length; i++) {
    try {
      const res = await fetch(hosts[i] + path, { signal: AbortSignal.timeout(3000) })
      if (res.ok) return i
    } catch {
      /* try the next host */
    }
  }
  return 0
}

/** Resolve (once) which brain host is reachable. */
export function resolveBrain(): Promise<number> {
  if (!brainProbe) {
    brainProbe = probe(BRAIN_HOSTS, '/health').then((i) => {
      brainIndex = i
      return i
    })
  }
  return brainProbe
}

/** Resolve (once) which vision host is reachable. */
export function resolveVision(): Promise<number> {
  if (!visionProbe) {
    visionProbe = probe(VISION_HOSTS, '/status').then((i) => {
      visionIndex = i
      return i
    })
  }
  return visionProbe
}

export function brainHttp(): string {
  return BRAIN_HOSTS[brainIndex]
}

export function brainWs(path: string): string {
  return toWs(BRAIN_HOSTS[brainIndex]) + path
}

export function visionHttp(): string {
  return VISION_HOSTS[visionIndex]
}

/**
 * WebRTC signaling URL. A `nandi_vision_signal_url` localStorage entry
 * wins, matching the Nandi desktop client's escape hatch.
 */
export function signalUrl(): string {
  const override = localStorage.getItem(SIGNAL_OVERRIDE_KEY)
  if (override) return override
  return toWs(VISION_HOSTS[visionIndex]) + '/ws/signal'
}

// ── Identity ─────────────────────────────────────────────
// OAuth is intentionally out of the loop for now. The dashboard reads
// whatever bearer token is already in localStorage (set it from the
// dashboard's own connection panel) and connects without it otherwise.

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

/** Stable per-browser device name, used to namespace vision client ids. */
export function getDeviceId(): string {
  const match = document.cookie.match(/(?:^|;\s*)nandi_device_id=([^;]+)/)
  if (match) return decodeURIComponent(match[1])

  const generated = `dash_${Math.random().toString(36).slice(2, 8)}`
  const expires = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${DEVICE_KEY}=${encodeURIComponent(generated)};expires=${expires};path=/;SameSite=Lax`
  return generated
}

export function getClientId(): string {
  return `web_react_${getDeviceId()}`
}
