import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClock } from '../../hooks/useClock'
import { useAuth } from '../../lib/auth/useAuth'
import type { BrainState } from '../../lib/nandi/brainSocket'
import { reconnectBrain } from '../../lib/nandi/brainSocket'
import { getToken, setToken } from '../../lib/nandi/endpoints'
import { TerminalIcon } from '../icons/DashboardIcons'
import { StatusPill } from './StatusPill'

const STATE_PILL: Record<BrainState, { tone: 'ok' | 'warn' | 'err' | 'idle'; label: string }> = {
  connected: { tone: 'ok', label: 'Brain online' },
  connecting: { tone: 'warn', label: 'Brain connecting' },
  offline: { tone: 'err', label: 'Brain offline' },
  unauthorized: { tone: 'err', label: 'Token required' },
}

interface DashboardTopBarProps {
  brainState: BrainState
  logsOpen: boolean
  onToggleLogs: () => void
}

export function DashboardTopBar({ brainState, logsOpen, onToggleLogs }: DashboardTopBarProps) {
  const { time, date } = useClock()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tokenOpen, setTokenOpen] = useState(false)
  const [tokenDraft, setTokenDraft] = useState(() => getToken() ?? '')

  const pill = STATE_PILL[brainState]

  function applyToken() {
    setToken(tokenDraft.trim())
    reconnectBrain()
    setTokenOpen(false)
  }

  async function handleSignOut() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/welcome"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight text-fg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-ink">
              <span className="h-2 w-2 rounded-sm bg-accent-ink" />
            </span>
            Shunn Labs
          </Link>
          <span className="hidden h-5 w-px bg-white/10 sm:block" />
          <span className="hidden text-sm font-medium text-fg-muted sm:block">Mission control</span>
        </div>

        <div className="hidden items-baseline gap-2 md:flex">
          <span className="font-display text-lg font-semibold tabular-nums text-fg">{time}</span>
          <span className="text-xs text-fg-muted">{date}</span>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill tone={pill.tone} pulse={brainState === 'connecting'} label={pill.label} />

          {/* Static on mobile so the popover anchors to the sticky header
              instead of a button that sits too far left to hang 320px off. */}
          <div className="sm:relative">
            <button
              type="button"
              onClick={() => setTokenOpen((v) => !v)}
              aria-expanded={tokenOpen}
              className="rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
            >
              Session
            </button>

            {tokenOpen && (
              <div className="absolute right-5 top-full z-50 mt-2 w-[calc(100vw-2.5rem)] max-w-80 rounded-2xl border border-white/8 bg-surface p-4 shadow-2xl shadow-black/40 sm:right-0 sm:w-80">
                <p className="text-sm font-semibold text-fg">API session token</p>
                <p className="mt-1 text-xs leading-relaxed text-fg-muted">
                  Sign-in is disabled for now. Paste a bearer token from the brain API to enable
                  chat, uploads, and speech; streams and sensors work without one.
                </p>
                <input
                  type="password"
                  value={tokenDraft}
                  onChange={(e) => setTokenDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyToken()}
                  placeholder="eyJhbGciOi…"
                  aria-label="API session token"
                  className="mt-3 w-full rounded-lg bg-ink px-3 py-2 text-sm text-fg ring-1 ring-white/10 outline-none focus:ring-accent/40"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTokenDraft('')
                      setToken('')
                      reconnectBrain()
                    }}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={applyToken}
                    className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-accent-ink hover:bg-accent-strong"
                  >
                    Save & reconnect
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleLogs}
            aria-pressed={logsOpen}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${
              logsOpen
                ? 'bg-accent text-accent-ink ring-transparent'
                : 'text-fg-muted ring-white/10 hover:text-fg'
            }`}
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            Logs
          </button>

          <span className="hidden h-5 w-px bg-white/10 sm:block" />

          {user && (
            <span
              className="hidden max-w-[160px] truncate text-xs font-medium text-fg-muted lg:block"
              title={user.email}
            >
              {user.full_name}
            </span>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
