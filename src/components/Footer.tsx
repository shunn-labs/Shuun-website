import { Link } from 'react-router-dom'

const links = [
  { label: 'Problem', href: '/#problem' },
  { label: 'Solution', href: '/#solution' },
  { label: 'Our team', href: '/#team' },
  { label: 'Contact us', href: '/#contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-fg-on-paper/8 bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-14 lg:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <a
              href="/"
              className="flex items-center"
            >
              <img src="/logo-wordmark.png" alt="Shuun Labs" width={475} height={160} className="h-9 w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-on-paper-muted">
              Autonomous intelligence for environmental monitoring and restoration.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[11px] tracking-wide text-fg-on-paper-muted uppercase transition-colors hover:text-fg-on-paper"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/invest"
              className="font-mono text-[11px] tracking-wide text-brand uppercase transition-colors hover:text-brand-strong"
            >
              Invest in us
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-fg-on-paper/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[11px] tracking-wide text-fg-on-paper-muted">
            © {new Date().getFullYear()} Shuun Labs
          </p>
          <p className="font-mono text-[11px] tracking-wide text-fg-on-paper-muted">labs.shuun.site</p>
        </div>
      </div>
    </footer>
  )
}
