import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth/useAuth'
import { navItems } from '../data/nav'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { AnnouncementBar } from './AnnouncementBar'
import { CloseIcon, MenuIcon } from './icons/Icons'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const { status } = useAuth()
  const signedIn = status === 'authenticated'

  // The section links are same-page anchors, which do nothing from another
  // route — off the homepage they have to navigate back to it first.
  const onHomepage = useLocation().pathname === '/'
  const sectionHref = (href: string) => (onHomepage ? href : `/${href}`)

  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {announcementVisible && <AnnouncementBar onDismiss={() => setAnnouncementVisible(false)} />}
      <header
        className={`transition-colors duration-300 ${
          scrolled ? 'border-b border-white/5 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
          >
            <img src="/logo.png" alt="" width={40} height={87} className="h-8 w-auto" />
            Shuun Labs
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={sectionHref(item.href)}
                    className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/invest"
              className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-fg transition-colors hover:border-white/35 hover:bg-white/5"
            >
              Invest in us
            </Link>
            {signedIn ? (
              <Link
                to="/dashboard"
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-fg-muted hover:text-fg">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-fg lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div
            className={`overflow-y-auto border-t border-white/5 bg-ink px-5 pb-10 pt-4 lg:hidden ${
              announcementVisible ? 'h-[calc(100svh-6.25rem)]' : 'h-[calc(100svh-4rem)]'
            }`}
          >
            <ul className="divide-y divide-white/5">
              {navItems.map((item) => (
                <li key={item.label} className="py-3">
                  <a
                    href={sectionHref(item.href)}
                    className="text-base font-medium text-fg"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="py-3">
                <Link
                  to="/invest"
                  className="text-base font-medium text-fg"
                  onClick={() => setMobileOpen(false)}
                >
                  Invest in us
                </Link>
              </li>
            </ul>
            <div className="mt-6 space-y-3">
              <Link
                to={signedIn ? '/dashboard' : '/signup'}
                className="block rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-ink"
                onClick={() => setMobileOpen(false)}
              >
                {signedIn ? 'Dashboard' : 'Create account'}
              </Link>
              {!signedIn && (
                <Link
                  to="/login"
                  className="block rounded-full px-4 py-3 text-center text-sm font-semibold text-fg ring-1 ring-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
