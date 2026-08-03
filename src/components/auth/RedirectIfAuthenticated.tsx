import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../lib/auth/useAuth'

/** Where a signed-in user is sent when they hit an entry-point page. */
export const SIGNED_IN_HOME = '/welcome'

interface RedirectIfAuthenticatedProps {
  /**
   * Hold the frame while the session is being restored.
   *
   * True for `/login` and `/signup`, where briefly flashing a sign-in form
   * at someone who is already signed in looks broken.
   *
   * False for `/`, which is public marketing: making every anonymous
   * visitor wait on a session check before seeing the homepage would be a
   * far worse trade than a signed-in user seeing it for one frame.
   */
  blockWhileLoading?: boolean
}

/**
 * Mirror of ProtectedRoute: keeps signed-in users off the entry pages.
 *
 * Applied to `/`, `/login` and `/signup` — typing any of those while signed
 * in lands on /welcome instead. `/dashboard` is deliberately excluded:
 * redirecting it would make the "Go to dashboard" button unreachable.
 */
export function RedirectIfAuthenticated({
  blockWhileLoading = true,
}: RedirectIfAuthenticatedProps) {
  const { status } = useAuth()
  const [searchParams] = useSearchParams()
  const location = useLocation()

  if (status === 'loading' && blockWhileLoading) {
    return (
      <div className="grid min-h-svh place-items-center bg-ink">
        <div className="flex flex-col items-center gap-3">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
          <p className="text-sm text-fg-muted">Checking your session…</p>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    // Honour ?next= so a guard bounce still reaches its original target.
    // Same-origin paths only: an open redirect here would be a phishing
    // primitive, and `//evil.com` is an absolute URL to the browser.
    const next = searchParams.get('next')
    const destination =
      next && next.startsWith('/') && !next.startsWith('//') ? next : SIGNED_IN_HOME

    // Never bounce a page to itself — that is an infinite redirect loop.
    if (destination !== location.pathname) {
      return <Navigate to={destination} replace />
    }
  }

  return <Outlet />
}
