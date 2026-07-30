import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AuthUser, SessionResponse } from './client'
import { ApiError, authApi } from './client'
import type { AuthStatus } from './context'
import { AuthContext } from './context'

// Refresh a little before the access token actually expires, so a request
// never races the expiry boundary.
const REFRESH_SKEW_SECONDS = 60

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current)
      refreshTimer.current = null
    }
  }, [])

  /**
   * Schedule the next silent rotation. Kept in a ref-driven timer rather
   * than an effect dependency so re-renders don't restart the clock.
   */
  const scheduleRefresh = useCallback(
    (expiresIn: number) => {
      clearTimer()
      const delay = Math.max(expiresIn - REFRESH_SKEW_SECONDS, 30) * 1000
      refreshTimer.current = setTimeout(async () => {
        try {
          const session = await authApi.refresh()
          setUser(session.user)
          scheduleRefresh(session.expires_in)
        } catch {
          // Refresh failed (expired, revoked, or reuse detected server-side).
          // Drop to anonymous and let the route guard redirect.
          setUser(null)
          setStatus('anonymous')
        }
      }, delay)
    },
    [clearTimer],
  )

  const adoptSession = useCallback(
    (session: SessionResponse) => {
      setUser(session.user)
      setStatus('authenticated')
      scheduleRefresh(session.expires_in)
    },
    [scheduleRefresh],
  )

  /**
   * Ask the server whether we are still signed in.
   *
   * Tries the access cookie first, then one rotation, because the access
   * token is short-lived while the refresh token is not.
   */
  const validateSession = useCallback(
    async (isStale: () => boolean) => {
      try {
        const me = await authApi.me()
        if (isStale()) return
        setUser(me)
        setStatus('authenticated')
        // The remaining TTL is unknown here, so rotate on a short cycle.
        scheduleRefresh(REFRESH_SKEW_SECONDS + 60)
        return
      } catch (error) {
        // A network blip is not proof of sign-out; only a 401 is.
        if (!(error instanceof ApiError) || !error.isUnauthorized) {
          if (!isStale()) setStatus((prev) => (prev === 'loading' ? 'anonymous' : prev))
          return
        }
      }

      try {
        const session = await authApi.refresh()
        if (isStale()) return
        adoptSession(session)
      } catch {
        if (!isStale()) {
          clearTimer()
          setUser(null)
          setStatus('anonymous')
        }
      }
    },
    [adoptSession, clearTimer, scheduleRefresh],
  )

  // Restore an existing session on first load.
  useEffect(() => {
    let cancelled = false
    void validateSession(() => cancelled)
    return () => {
      cancelled = true
    }
  }, [validateSession])

  /**
   * Re-check when the tab comes back to the foreground.
   *
   * Without this, a session revoked elsewhere (signed out on another
   * device, password changed, admin action) leaves this tab rendering an
   * app the server will refuse every request for, until the refresh timer
   * happens to fire. Revalidating on focus turns that into a redirect the
   * moment the user returns.
   */
  useEffect(() => {
    let lastCheck = 0
    // Focus and visibilitychange both fire on a tab switch; throttle so we
    // send one request, not two.
    const THROTTLE_MS = 30_000

    function recheck() {
      if (document.visibilityState !== 'visible') return
      const now = Date.now()
      if (now - lastCheck < THROTTLE_MS) return
      lastCheck = now
      void validateSession(() => false)
    }

    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [validateSession])

  useEffect(() => clearTimer, [clearTimer])

  const signup = useCallback(
    async (input: { email: string; full_name: string; password: string }) => {
      adoptSession(await authApi.signup(input))
    },
    [adoptSession],
  )

  const login = useCallback(
    async (input: { email: string; password: string }) => {
      adoptSession(await authApi.login(input))
    },
    [adoptSession],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      // Clear locally even if the call failed — the user asked to leave.
      clearTimer()
      setUser(null)
      setStatus('anonymous')
    }
  }, [clearTimer])

  const value = useMemo(
    () => ({ user, status, signup, login, logout }),
    [user, status, signup, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
