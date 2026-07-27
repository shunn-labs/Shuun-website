import { LinkedInIcon, XIcon, YoutubeIcon } from './icons/Icons'

const columns = [
  {
    heading: 'Navigation',
    links: [
      { label: 'Platform', href: '#detect' },
      { label: 'Solutions', href: '#solutions' },
      { label: 'Industries', href: '#industries' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/team' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#resources' },
      { label: 'Case studies', href: '#resources' },
      { label: 'Blog', href: '#resources' },
      { label: 'Webinars', href: '#resources' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'Our team', href: '/team' },
      { label: 'Contact sales', href: '#contact' },
      { label: 'Support', href: '#contact' },
      { label: 'Partners', href: '/team' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <a href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-fg">
              <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-ink">
                <span className="h-2 w-2 rounded-sm bg-accent-ink" />
              </span>
              Shunn Labs
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              Aerial detection and human-approved ground robots for environmental risk work.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">{col.heading}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-fg-muted">© {new Date().getFullYear()} Shunn Labs. All rights reserved.</p>

          <div className="flex items-center gap-5">
            <a href="#top" aria-label="Shunn Labs on X" className="text-fg-muted hover:text-fg">
              <XIcon className="h-4 w-4" />
            </a>
            <a href="#top" aria-label="Shunn Labs on LinkedIn" className="text-fg-muted hover:text-fg">
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a href="#top" aria-label="Shunn Labs on YouTube" className="text-fg-muted hover:text-fg">
              <YoutubeIcon className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-center gap-6 text-xs text-fg-muted">
            <a href="#top" className="hover:text-fg">
              Privacy policy
            </a>
            <a href="#top" className="hover:text-fg">
              Terms of use
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
