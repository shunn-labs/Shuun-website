import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ArrowRightIcon } from '../components/icons/Icons'
import { useAuth } from '../lib/auth/useAuth'

const HIGHLIGHTS = [
  {
    title: 'Live sensor readings',
    body: 'Six sensors streaming now, and the grid grows on its own as more come online.',
  },
  {
    title: 'Multi-stream video wall',
    body: 'Open any live stream, publish this device’s camera, capture frames into chat.',
  },
  {
    title: 'Assistant in the loop',
    body: 'Ask about a reading, request a feed, or drop a file — with voice in and out.',
  },
]

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName
}

export function WelcomePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useDocumentTitle('Welcome — Shuun Labs')

  async function handleSignOut() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/8 blur-[140px]" />
      </div>

      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-6 lg:px-8">
        {/* Points at /welcome rather than / — for a signed-in user this page
            is home, and / would only forward straight back here. */}
        <Link
          to="/welcome"
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
        >
          <img src="/logo.png" alt="" width={40} height={87} className="h-8 w-auto" />
          Shuun Labs
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-fg-muted sm:block">{user?.email}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-fg-muted ring-1 ring-white/10 transition-colors hover:text-fg"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-24">
        <p className="mb-3 text-xs font-semibold tracking-wide text-accent uppercase">
          You're in
        </p>
        <h1 className="text-4xl font-semibold text-fg sm:text-5xl">
          Welcome, {user ? firstName(user.full_name) : 'operator'}.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-muted">
          Your account is ready. Mission control gives you the full sense-decide-act loop in
          one place — live telemetry, video, and the assistant that ties them together.
        </p>

        {/* No "Back to site" link: `/` forwards signed-in users straight
            back here, so the button would have been a no-op loop. */}
        <div className="mt-9">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] hover:bg-accent-strong"
          >
            Go to dashboard
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {user && !user.is_email_verified && user.has_password && (
          <p className="mt-8 max-w-xl rounded-xl bg-accent/8 px-4 py-3 text-xs leading-relaxed text-accent ring-1 ring-accent/25">
            Your email isn't verified yet. Verification isn't enforced on this environment,
            so you can carry on — it becomes required once email delivery is switched on.
          </p>
        )}

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl bg-surface p-5 ring-1 ring-white/8 transition-colors hover:bg-surface-raised"
            >
              <h2 className="text-sm font-semibold text-fg">{item.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-fg-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
