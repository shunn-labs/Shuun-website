// ═══════════════════════════════════════════════════════════
//  sensors.ts — live sensor telemetry feed
//
//  The feed is deliberately schema-driven and count-agnostic: the UI
//  renders whatever sensors the payload contains, so adding a seventh
//  sensor upstream needs no frontend change.
//
//  Transport, tried in order:
//    1. WebSocket  {brain}/ws/sensors        (push)
//    2. REST poll  {brain}/api/sensors       (1 Hz)
//    3. Local simulator                      (so the dashboard is usable
//                                             before the telemetry service
//                                             lands — clearly labelled
//                                             "simulated" in the UI)
//
//  Accepted payload shapes:
//    { sensors: [ { id, label, value, unit, min, max, status, ts }, … ] }
//    [ { … }, … ]
//    { soil_moisture: 42.1, air_temp: { value: 31.2, unit: "°C" }, … }
// ═══════════════════════════════════════════════════════════

import { brainHttp, brainWs, getToken, resolveBrain } from './endpoints'

export type SensorStatus = 'nominal' | 'warning' | 'critical' | 'stale'
export type SensorSource = 'live' | 'polled' | 'simulated'

export interface SensorReading {
  id: string
  label: string
  value: number
  unit: string
  /** Expected operating range — drives the range bar and status colour. */
  min: number
  max: number
  status: SensorStatus
  /** Optional warning band inside [min, max]. */
  warnBelow?: number
  warnAbove?: number
  group?: string
  ts: number
}

export interface SensorSnapshot {
  readings: SensorReading[]
  source: SensorSource
  connected: boolean
  updatedAt: number
}

const HISTORY_LIMIT = 60
const POLL_MS = 1000
const SIM_MS = 1000

// ── Default descriptors ──────────────────────────────────
// Used by the simulator, and to fill in labels/ranges when the server
// sends bare numbers. Unknown sensor ids still render, just with
// derived defaults — that's what keeps the grid open-ended.

interface SensorDescriptor {
  id: string
  label: string
  unit: string
  min: number
  max: number
  warnBelow?: number
  warnAbove?: number
  group: string
  /** Simulator only: centre of the random walk. */
  seed: number
  drift: number
}

export const SENSOR_DESCRIPTORS: SensorDescriptor[] = [
  {
    id: 'soil_moisture',
    label: 'Soil moisture',
    unit: '%',
    min: 0,
    max: 100,
    warnBelow: 25,
    group: 'Field',
    seed: 42,
    drift: 1.4,
  },
  {
    id: 'air_temp',
    label: 'Air temperature',
    unit: '°C',
    min: -10,
    max: 55,
    warnAbove: 42,
    group: 'Field',
    seed: 31,
    drift: 0.5,
  },
  {
    id: 'humidity',
    label: 'Relative humidity',
    unit: '%',
    min: 0,
    max: 100,
    warnBelow: 20,
    warnAbove: 90,
    group: 'Field',
    seed: 58,
    drift: 1.8,
  },
  {
    id: 'water_turbidity',
    label: 'Water turbidity',
    unit: 'NTU',
    min: 0,
    max: 50,
    warnAbove: 20,
    group: 'Water',
    seed: 8,
    drift: 1.1,
  },
  {
    id: 'battery',
    label: 'Battery',
    unit: '%',
    min: 0,
    max: 100,
    warnBelow: 30,
    group: 'Platform',
    seed: 78,
    drift: 0.4,
  },
  {
    id: 'altitude',
    label: 'Altitude AGL',
    unit: 'm',
    min: 0,
    max: 120,
    warnAbove: 110,
    group: 'Platform',
    seed: 64,
    drift: 2.6,
  },
]

const descriptorById = new Map(SENSOR_DESCRIPTORS.map((d) => [d.id, d]))

function titleCase(id: string): string {
  return id
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function classify(value: number, min: number, max: number, warnBelow?: number, warnAbove?: number): SensorStatus {
  if (value <= min || value >= max) return 'critical'
  if (warnBelow !== undefined && value < warnBelow) return 'warning'
  if (warnAbove !== undefined && value > warnAbove) return 'warning'
  return 'nominal'
}

// ── Normalisation ────────────────────────────────────────

type RawSensor = Partial<SensorReading> & { id?: string; name?: string; key?: string }

function normalizeOne(raw: RawSensor, fallbackId: string, now: number): SensorReading | null {
  const id = raw.id ?? raw.key ?? fallbackId
  const value = Number(raw.value)
  if (!Number.isFinite(value)) return null

  const d = descriptorById.get(id)
  const min = raw.min ?? d?.min ?? 0
  const max = raw.max ?? d?.max ?? Math.max(100, Math.ceil(value * 1.5))
  const warnBelow = raw.warnBelow ?? d?.warnBelow
  const warnAbove = raw.warnAbove ?? d?.warnAbove

  return {
    id,
    label: raw.label ?? raw.name ?? d?.label ?? titleCase(id),
    value,
    unit: raw.unit ?? d?.unit ?? '',
    min,
    max,
    warnBelow,
    warnAbove,
    group: raw.group ?? d?.group ?? 'Sensors',
    status: raw.status ?? classify(value, min, max, warnBelow, warnAbove),
    ts: raw.ts ?? now,
  }
}

/** Turn any of the accepted payload shapes into a flat reading list. */
export function normalizePayload(payload: unknown): SensorReading[] {
  const now = Date.now()

  const list =
    Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { sensors?: unknown })?.sensors)
        ? ((payload as { sensors: unknown[] }).sensors)
        : null

  if (list) {
    return list
      .map((item, i) => normalizeOne(item as RawSensor, `sensor_${i + 1}`, now))
      .filter((r): r is SensorReading => r !== null)
  }

  if (payload && typeof payload === 'object') {
    return Object.entries(payload as Record<string, unknown>)
      .map(([key, val]) => {
        const raw: RawSensor =
          typeof val === 'number' ? { value: val } : ((val ?? {}) as RawSensor)
        return normalizeOne({ ...raw, id: raw.id ?? key }, key, now)
      })
      .filter((r): r is SensorReading => r !== null)
  }

  return []
}

// ── History ──────────────────────────────────────────────

export type SensorHistory = Record<string, number[]>

export function pushHistory(prev: SensorHistory, readings: SensorReading[]): SensorHistory {
  const next: SensorHistory = { ...prev }
  for (const r of readings) {
    const series = next[r.id] ? [...next[r.id], r.value] : [r.value]
    next[r.id] = series.length > HISTORY_LIMIT ? series.slice(-HISTORY_LIMIT) : series
  }
  return next
}

// ── Simulator ────────────────────────────────────────────

function makeSimulator() {
  const values = new Map(SENSOR_DESCRIPTORS.map((d) => [d.id, d.seed]))

  return function tick(): SensorReading[] {
    const now = Date.now()
    return SENSOR_DESCRIPTORS.map((d) => {
      const current = values.get(d.id) ?? d.seed
      // Random walk with a gentle pull back toward the seed so values stay
      // in a believable band instead of drifting to a rail.
      const wander = (Math.random() - 0.5) * d.drift * 2
      const pull = (d.seed - current) * 0.02
      const next = Math.min(d.max, Math.max(d.min, current + wander + pull))
      values.set(d.id, next)

      return {
        id: d.id,
        label: d.label,
        value: Math.round(next * 10) / 10,
        unit: d.unit,
        min: d.min,
        max: d.max,
        warnBelow: d.warnBelow,
        warnAbove: d.warnAbove,
        group: d.group,
        status: classify(next, d.min, d.max, d.warnBelow, d.warnAbove),
        ts: now,
      }
    })
  }
}

// ── Feed ─────────────────────────────────────────────────

type SnapshotListener = (snapshot: SensorSnapshot) => void

/**
 * Start the sensor feed. Returns a stop function.
 *
 * Falls forward automatically: if the WS endpoint isn't there we poll, and
 * if polling 404s we simulate — always reporting which one is in play.
 */
export function startSensorFeed(onSnapshot: SnapshotListener): () => void {
  let stopped = false
  let ws: WebSocket | null = null
  let timer: ReturnType<typeof setInterval> | null = null

  const emit = (readings: SensorReading[], source: SensorSource, connected: boolean) => {
    if (stopped || readings.length === 0) return
    onSnapshot({ readings, source, connected, updatedAt: Date.now() })
  }

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function startSimulator() {
    if (stopped) return
    clearTimer()
    const tick = makeSimulator()
    emit(tick(), 'simulated', false)
    timer = setInterval(() => emit(tick(), 'simulated', false), SIM_MS)
  }

  async function startPolling() {
    if (stopped) return
    clearTimer()

    const token = getToken()
    const fetchOnce = async () => {
      try {
        const res = await fetch(`${brainHttp()}/api/sensors`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          signal: AbortSignal.timeout(4000),
        })
        if (!res.ok) throw new Error(String(res.status))
        emit(normalizePayload(await res.json()), 'polled', true)
        return true
      } catch {
        return false
      }
    }

    if (!(await fetchOnce())) {
      startSimulator()
      return
    }
    timer = setInterval(() => void fetchOnce(), POLL_MS)
  }

  async function startSocket() {
    await resolveBrain()
    if (stopped) return

    let sock: WebSocket
    try {
      sock = new WebSocket(brainWs('/ws/sensors'))
    } catch {
      void startPolling()
      return
    }
    ws = sock

    // If the endpoint doesn't exist the socket dies quickly; don't leave the
    // grid empty while we wait to find that out.
    const fallbackTimer = setTimeout(() => {
      if (sock.readyState !== WebSocket.OPEN) void startPolling()
    }, 3000)

    sock.onopen = () => {
      const token = getToken()
      if (token) sock.send(JSON.stringify({ type: 'auth', token }))
    }

    sock.onmessage = (event) => {
      clearTimeout(fallbackTimer)
      clearTimer()
      let data: unknown
      try {
        data = JSON.parse(event.data as string)
      } catch {
        return
      }
      emit(normalizePayload(data), 'live', true)
    }

    sock.onclose = () => {
      clearTimeout(fallbackTimer)
      if (stopped) return
      ws = null
      void startPolling()
    }
  }

  void startSocket()

  return () => {
    stopped = true
    clearTimer()
    try {
      ws?.close()
    } catch {
      /* already gone */
    }
  }
}
