import { useId, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string
  hint?: ReactNode
}

export function FormField({ label, error, hint, className = '', ...inputProps }: FormFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-fg">
        {label}
      </label>
      <input
        {...inputProps}
        id={id}
        aria-invalid={error ? true : undefined}
        // Point screen readers at whichever helper text is present.
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`mt-1.5 w-full rounded-xl bg-surface px-3.5 py-2.5 text-sm text-fg ring-1 outline-none transition-colors placeholder:text-fg-muted/60 ${
          error
            ? 'ring-rose-500/70 focus:ring-rose-600'
            : 'ring-fg/15 focus:ring-accent'
        }`}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1.5 text-xs text-rose-700">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

interface PasswordFieldProps extends FormFieldProps {
  /** Renders a strength meter below the input. */
  showStrength?: boolean
}

/** Password input with a reveal toggle and an optional strength meter. */
export function PasswordField({ showStrength = false, value, ...props }: PasswordFieldProps) {
  const [revealed, setRevealed] = useState(false)
  const password = typeof value === 'string' ? value : ''

  return (
    <div>
      <div className="relative">
        <FormField {...props} value={value} type={revealed ? 'text' : 'password'} />
        <button
          type="button"
          onClick={() => setRevealed((v) => !v)}
          // Nudged down to clear the label above the input.
          className="absolute right-3 top-[2.1rem] text-xs font-medium text-fg-muted transition-colors hover:text-fg"
          aria-pressed={revealed}
        >
          {revealed ? 'Hide' : 'Show'}
        </button>
      </div>
      {showStrength && password.length > 0 && <PasswordStrength password={password} />}
    </div>
  )
}

const STRENGTH_LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const
const STRENGTH_COLORS = [
  'bg-rose-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-emerald-500',
] as const

/**
 * Client-side strength hint only. It mirrors the server's policy so the
 * user gets instant feedback, but the server is the authority — never
 * trust this to decide whether a password is acceptable.
 */
function scorePassword(password: string): number {
  let score = 0
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  const classes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length

  if (classes >= 3) score += 1
  if (classes === 4) score += 1

  if (new Set(password).size < 5) score = 0

  return Math.min(score, 4)
}

function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password)

  return (
    <div className="mt-2">
      <div className="flex gap-1" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < score ? STRENGTH_COLORS[score] : 'bg-fg/10'
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-fg-muted">
        Strength: <span className="font-medium text-fg">{STRENGTH_LABELS[score]}</span>
      </p>
    </div>
  )
}
