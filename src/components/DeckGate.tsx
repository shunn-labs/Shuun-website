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
    <div className="mt-10 rounded-2xl border border-black/10 bg-white p-8 sm:p-10">
      <h3 className="text-lg font-semibold text-fg-on-paper">Where should we send it?</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-fg-on-paper-muted">
        Leave an email and the deck opens right here. We only use it to follow up about the
        round.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 max-w-md space-y-4">
        <div>
          <label htmlFor="deck-email" className="block text-xs font-semibold text-fg-on-paper">
            Email
          </label>
          <input
            id="deck-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@fund.com"
            className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-fg-on-paper outline-none placeholder:text-fg-on-paper-muted/60 focus:border-black/40"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="deck-name" className="block text-xs font-semibold text-fg-on-paper">
              Name <span className="font-normal text-fg-on-paper-muted">(optional)</span>
            </label>
            <input
              id="deck-name"
              name="name"
              type="text"
              autoComplete="name"
              className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-fg-on-paper outline-none focus:border-black/40"
            />
          </div>
          <div>
            <label htmlFor="deck-org" className="block text-xs font-semibold text-fg-on-paper">
              Fund / company <span className="font-normal text-fg-on-paper-muted">(optional)</span>
            </label>
            <input
              id="deck-org"
              name="organisation"
              type="text"
              autoComplete="organization"
              className="mt-1.5 w-full rounded-xl border border-black/15 bg-white px-4 py-2.5 text-sm text-fg-on-paper outline-none focus:border-black/40"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group inline-flex items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Opening…' : 'Show me the deck'}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </form>
    </div>
  )
}
