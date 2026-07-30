import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AuthShell } from '../components/auth/AuthShell'
import { FormField, PasswordField } from '../components/auth/FormField'
import { AuthDivider, GoogleButton } from '../components/auth/GoogleButton'
import { useAuth } from '../lib/auth/useAuth'
import { ApiError, GOOGLE_ERROR_MESSAGES } from '../lib/auth/client'

export function LoginPage() {
  const { login, status } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useDocumentTitle('Sign in — Shunn Labs')

  // Surface an error handed back by the Google callback redirect.
  useEffect(() => {
    const code = searchParams.get('error')
    if (code) {
      setFormError(GOOGLE_ERROR_MESSAGES[code] ?? 'Sign-in failed. Please try again.')
    }
  }, [searchParams])

  // Where the guard bounced the user from, if anywhere.
  //
  // Only same-origin *paths* are honoured: accepting an arbitrary `next`
  // would turn the login page into an open redirect, which is a standard
  // phishing primitive. `//evil.com` is rejected for the same reason —
  // the browser reads it as a protocol-relative absolute URL.
  const rawNext = searchParams.get('next')
  const destination =
    rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/welcome'

  // Covers both "arrived already signed in" and "just signed in": the auth
  // state flipping is the single trigger, so this can't race handleSubmit's
  // own navigate and send the user somewhere else.
  useEffect(() => {
    if (status === 'authenticated') navigate(destination, { replace: true })
  }, [status, navigate, destination])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)

    if (!email.trim() || !password) {
      setFormError('Enter your email and password.')
      return
    }

    setSubmitting(true)
    try {
      await login({ email: email.trim(), password })
      // Navigation is handled by the effect above once status flips.
    } catch (error) {
      if (error instanceof ApiError && error.isRateLimited) {
        const minutes = Math.ceil((error.retryAfterSeconds ?? 900) / 60)
        setFormError(`Too many attempts. Try again in about ${minutes} minute(s).`)
      } else if (error instanceof ApiError) {
        setFormError(error.message)
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Pick up where you left off in mission control."
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent-strong">
            Create one
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" disabled={submitting} />
      <AuthDivider label="or sign in with email" />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <div
            role="alert"
            className="rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200 ring-1 ring-rose-500/30"
          >
            {formError}
          </div>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
