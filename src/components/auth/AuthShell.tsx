import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthShellProps {
  eyebrow: string
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

/**
 * Split layout shared by sign-up and sign-in: form on the left, brand
 * panel on the right. The panel is decorative and drops away on mobile.
 */
export function AuthShell({ eyebrow, title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-svh bg-ink lg:grid-cols-2">
      {/* ── Form column ── */}
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
        >
          <img src="/logo.png" alt="" width={40} height={87} className="h-8 w-auto" />
          Shuun Labs
        </Link>

        <div className="flex flex-1 items-center py-10">
          <div className="w-full max-w-md">
            <p className="mb-2 text-xs font-semibold tracking-wide text-accent uppercase">
              {eyebrow}
            </p>
            <h1 className="text-3xl font-semibold text-fg sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </div>
        </div>

        {footer && <div className="text-sm text-fg-muted">{footer}</div>}
      </div>

      {/* ── Brand column ── */}
      <aside className="relative hidden overflow-hidden bg-surface lg:block">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-1/3 h-[560px] w-[560px] rounded-full bg-accent/10 blur-[130px]" />
          <div className="absolute -left-20 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/5 blur-[100px]" />
        </div>

        <div className="relative flex h-full flex-col justify-between p-16">
          <div />
          <div>
            <p className="font-display text-4xl leading-tight font-semibold text-fg">
              Sense.
              <br />
              Decide.
              <br />
              <span className="text-accent">Act.</span>
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-fg-muted">
              Mission control for autonomous physical AI — live sensor telemetry, video
              streams, and an assistant that closes the loop.
            </p>
          </div>

          <dl className="flex gap-10">
            {[
              ['Onboard', 'inference at the edge'],
              ['Geotagged', 'every detection'],
              ['<1s', 'manual override'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-xl font-semibold text-accent">{value}</dt>
                <dd className="mt-1 text-xs text-fg-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </div>
  )
}
