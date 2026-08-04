// ═══════════════════════════════════════════════════════════
//  POST /api/deck-lead — records who asked for the pitch deck.
//
//  Deliberately never blocks the visitor: if the notification email
//  cannot be sent, the lead is still written to the function log and the
//  caller still gets a 204, because failing to email ourselves is not a
//  reason to withhold the deck from someone who just asked for it.
//
//  Set RESEND_API_KEY in the Vercel project to get the email; without it
//  the log line is the only record.
// ═══════════════════════════════════════════════════════════

// Edge, because this file exports a Web handler — `(request) => Response`.
// Vercel's Node runtime hands a plain /api file the `(req, res)` pair
// instead, so under Node nothing here ever ends the response and every
// request hangs until the gateway gives up. Edge is also the right shape
// for the work: one validation and one fetch, no Node APIs.
export const config = { runtime: 'edge' }

// The app tsconfig sets `types: ["vite/client"]`, so Node's globals are not
// in scope when Vercel typechecks this file — and adding "node" there would
// pull Node types into the browser bundle's build. One declaration is the
// smaller price. Node supplies the real object at runtime.
declare const process: { env: Record<string, string | undefined> }

const NOTIFY_TO = '000shuun@gmail.com'
// Resend's shared sender works without a verified domain. Swap for an
// address on shuun.site once that domain is verified in Resend.
const NOTIFY_FROM = 'Shunn Labs <onboarding@resend.dev>'

/** Deliberately loose: the point is to catch typos, not to police addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

interface LeadBody {
  email?: unknown
  name?: unknown
  organisation?: unknown
}

function asTrimmedString(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } })
  }

  let body: LeadBody
  try {
    body = (await request.json()) as LeadBody
  } catch {
    return Response.json({ error: 'Expected a JSON body.' }, { status: 400 })
  }

  const email = asTrimmedString(body.email, 254)
  const name = asTrimmedString(body.name, 120)
  const organisation = asTrimmedString(body.organisation, 120)

  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 })
  }

  // The log is the fallback record, so write it before anything that can fail.
  console.log('deck-lead', JSON.stringify({ email, name, organisation, at: new Date().toISOString() }))

  const apiKey = process.env.RESEND_API_KEY
  if (apiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: NOTIFY_FROM,
          to: [NOTIFY_TO],
          reply_to: email,
          subject: `Pitch deck requested — ${name || email}`,
          text: [
            `Email:        ${email}`,
            `Name:         ${name || '—'}`,
            `Organisation: ${organisation || '—'}`,
          ].join('\n'),
        }),
      })
      if (!response.ok) {
        console.error('deck-lead: resend rejected the send', response.status, await response.text())
      }
    } catch (error) {
      console.error('deck-lead: could not reach resend', error)
    }
  }

  return new Response(null, { status: 204 })
}
