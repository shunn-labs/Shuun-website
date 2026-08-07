import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowRightIcon } from './icons/Icons'

/** Remembers the visitor so they see the form once, not on every visit. */
const STORAGE_KEY = 'shuun.deck-access'

function readStoredAccess(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    // Private mode / storage disabled: the form simply shows every time.
    return false
  }
}

interface DeckGateProps {
  children: ReactNode
}

/**
 * Asks for an email before showing the deck.
 *
 * The gate is a courtesy, not a security boundary — the PDF and slide
 * images are static files anyone can request directly. Treat it as lead
 * capture, and keep genuinely confidential material out of the deck.
 */
export function DeckGate({ children }: DeckGateProps) {
  const [unlocked, setUnlocked] = useState(readStoredAccess)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') ?? '').trim()
    const name = String(data.get('name') ?? '').trim()
    const organisation = String(data.get('organisation') ?? '').trim()

    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/deck-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, organisation }),
        // Nobody waits on a stuck button to read a deck. If the call has not
        // answered by now, drop it and let them through.
        signal: AbortSignal.timeout(8000),
      })

      // A rejected address is the visitor's to fix, so say so and stop.
      // Anything else is our problem — losing the lead is a smaller cost
      // than making a real investor argue with a form, so they go through.
      if (response.status === 400) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null
        setError(payload?.error ?? 'Enter a valid email address.')
        return
      }
      if (!response.ok) {
        console.error('deck-lead: request failed', response.status)
      }
    } catch (error) {
      console.error('deck-lead: could not send', error)
    } finally {
      setSubmitting(false)
    }

    try {
      localStorage.setItem(STORAGE_KEY, email)
    } catch {
      // Not being able to remember them is not a reason to withhold the deck.
    }
    setUnlocked(true)
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-ink p-8 sm:p-10">
      <h3 className="text-xl font-semibold text-fg">Where should we send it?</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-muted">
        Leave an email and the deck opens right here. We only use it to follow up about the
        round.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="deck-email" className="block font-mono text-[11px] tracking-wide text-fg-muted uppercase">
            Email
          </label>
          <input
            id="deck-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@fund.com"
            className="mt-2 w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted/50 focus:border-accent/60"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="deck-name" className="block font-mono text-[11px] tracking-wide text-fg-muted uppercase">
              Name <span className="text-fg-muted/60">(optional)</span>
            </label>
            <input
              id="deck-name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-2 w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-accent/60"
            />
          </div>
          <div>
            <label htmlFor="deck-org" className="block font-mono text-[11px] tracking-wide text-fg-muted uppercase">
              Fund / company <span className="text-fg-muted/60">(optional)</span>
            </label>
            <input
              id="deck-org"
              name="organisation"
              type="text"
              autoComplete="organization"
              className="mt-2 w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-accent/60"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Opening…' : 'Show me the deck'}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </div>
  )
}
