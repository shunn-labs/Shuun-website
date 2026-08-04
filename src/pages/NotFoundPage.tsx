import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useAuth } from '../lib/auth/useAuth'

/**
 * Catch-all for unknown paths.
 *
 * The primary action follows the session: a signed-in visitor is offered
 * their way back into the app, everyone else is offered the public site.
 */
export function NotFoundPage() {
  const { status } = useAuth()

  useDocumentTitle('Page not found — Shuun Labs')

  const signedIn = status === 'authenticated'

  return (
    <div className="grid min-h-svh place-items-center bg-ink px-5">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-semibold text-accent">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-fg">Page not found</h1>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          That URL doesn't exist. It may have moved, or the link may be out of date.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to={signedIn ? '/welcome' : '/'}
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
          >
            {signedIn ? 'Back to your account' : 'Back to home'}
          </Link>
          {signedIn && (
            <Link
              to="/dashboard"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
            >
              Go to dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
