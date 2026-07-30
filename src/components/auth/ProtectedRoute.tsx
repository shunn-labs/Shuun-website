import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../lib/auth/useAuth'

/**
 * Gate for authenticated routes.
 *
 * This is a UX guard, not a security boundary — it decides what to render,
 * not what data exists. Every protected resource is still authorized
 * server-side on each request.
 */
export function ProtectedRoute() {
  const { status } = useAuth()
  const location = useLocation()

  // Session restore is in flight. Rendering the redirect now would bounce
  // a signed-in user to /login on every hard refresh.
  if (status === 'loading') {
    return (
      <div className="grid min-h-svh place-items-center bg-ink">
        <div className="flex flex-col items-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
          <p className="text-sm text-fg-muted">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (status === 'anonymous') {
    // Remember where they were headed so login can send them back.
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return <Outlet />
}
