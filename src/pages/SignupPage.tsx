import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { AuthShell } from '../components/auth/AuthShell'
import { FormField, PasswordField } from '../components/auth/FormField'
import { AuthDivider, GoogleButton } from '../components/auth/GoogleButton'
import { useAuth } from '../lib/auth/useAuth'
import { ApiError } from '../lib/auth/client'

interface FormState {
  full_name: string
  email: string
  password: string
  confirm: string
}

const EMPTY: FormState = { full_name: '', email: '', password: '', confirm: '' }

export function SignupPage() {
  const { signup, status } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState<FormState>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useDocumentTitle('Create your account — Shunn Labs')

  // Already signed in? Don't show a signup form.
  useEffect(() => {
    if (status === 'authenticated') navigate('/welcome', { replace: true })
  }, [status, navigate])

  function update(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}

    if (!form.full_name.trim()) next.full_name = 'Enter your name'
    if (!form.email.trim()) next.email = 'Enter your email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address'

    if (form.password.length < 12)
      next.password = 'Use at least 12 characters'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match'

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      await signup({
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        password: form.password,
      })
      navigate('/welcome', { replace: true })
    } catch (error) {
      if (error instanceof ApiError) {
        // Map server-side field errors back onto the inputs.
        const mapped: Partial<Record<keyof FormState, string>> = {}
        for (const fieldError of error.fieldErrors) {
          if (fieldError.field in EMPTY) {
            mapped[fieldError.field as keyof FormState] = fieldError.message
          }
        }
        setErrors((prev) => ({ ...prev, ...mapped }))
        setFormError(error.fieldErrors.length ? null : error.message)
      } else {
        setFormError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="One account for mission control — live telemetry, video streams, and the assistant."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:text-accent-strong">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton label="Sign up with Google" disabled={submitting} />
      <AuthDivider label="or sign up with email" />

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
          label="Full name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={form.full_name}
          error={errors.full_name}
          onChange={(e) => update('full_name', e.target.value)}
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={form.email}
          error={errors.email}
          onChange={(e) => update('email', e.target.value)}
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 12 characters"
          value={form.password}
          error={errors.password}
          hint="Mix upper and lower case, digits and symbols."
          showStrength
          onChange={(e) => update('password', e.target.value)}
        />

        <PasswordField
          label="Confirm password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirm}
          error={errors.confirm}
          onChange={(e) => update('confirm', e.target.value)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-xs leading-relaxed text-fg-muted">
          By creating an account you agree to our terms of service and privacy policy.
        </p>
      </form>
    </AuthShell>
  )
}
