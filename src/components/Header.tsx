import { useEffect, useRef, useState } from 'react'
import { navItems } from '../data/nav'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { AnnouncementBar } from './AnnouncementBar'
import { ChevronDownIcon, CloseIcon, MenuIcon } from './icons/Icons'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hero reads this to reserve exactly enough space below the fixed
  // header/announcement stack, since the two live in separate components.
  useEffect(() => {
    document.documentElement.style.setProperty('--header-offset', announcementVisible ? '100px' : '64px')
  }, [announcementVisible])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenMenu(null)
        setMobileOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  function openOnHover(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
  }

  function closeOnLeave() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120)
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {announcementVisible && <AnnouncementBar onDismiss={() => setAnnouncementVisible(false)} />}
      <header
        className={`transition-colors duration-300 ${
          scrolled || openMenu ? 'bg-ink/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight text-fg"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-ink">
              <span className="h-2 w-2 rounded-sm bg-accent-ink" />
            </span>
            Shunn Labs
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.columns && openOnHover(item.label)}
                  onMouseLeave={() => item.columns && closeOnLeave()}
                  onBlur={(e) => {
                    if (item.columns && !e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenMenu(null)
                    }
                  }}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-fg-muted transition-colors hover:text-fg"
                    aria-expanded={item.columns ? openMenu === item.label : undefined}
                    onFocus={() => item.columns && openOnHover(item.label)}
                  >
                    {item.label}
                    {item.columns && <ChevronDownIcon className="h-3.5 w-3.5" />}
                  </a>

                  {item.columns && (
                    <div
                      inert={openMenu === item.label ? undefined : true}
                      className={`absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-3 transition-all duration-150 ${
                        openMenu === item.label
                          ? 'pointer-events-auto translate-y-0 opacity-100'
                          : 'pointer-events-none -translate-y-1 opacity-0'
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-white/8 bg-surface p-6 shadow-2xl shadow-black/40">
                        {item.columns.map((column, i) => (
                          <ul key={i} className="space-y-4">
                            {column.map((link) => (
                              <li key={link.label}>
                                <a href={link.href} className="group block">
                                  <p className="text-sm font-semibold text-fg group-hover:text-accent">
                                    {link.label}
                                  </p>
                                  {link.description && (
                                    <p className="mt-0.5 text-xs leading-snug text-fg-muted">{link.description}</p>
                                  )}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#contact" className="text-sm font-medium text-fg-muted hover:text-fg">
              Support
            </a>
            <a
              href="#contact"
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] hover:bg-accent-strong"
            >
              Talk to sales
            </a>
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
          <div className="h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/5 bg-ink px-5 pb-10 pt-4 lg:hidden">
            <ul className="divide-y divide-white/5">
              {navItems.map((item) => (
                <li key={item.label} className="py-3">
                  <a href={item.href} className="text-base font-medium text-fg" onClick={() => setMobileOpen(false)}>
                    {item.label}
                  </a>
                  {item.columns && (
                    <ul className="mt-3 space-y-3 pl-1">
                      {item.columns.flat().map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="block text-sm text-fg-muted"
                            onClick={() => setMobileOpen(false)}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="mt-6 block rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-ink"
              onClick={() => setMobileOpen(false)}
            >
              Talk to sales
            </a>
          </div>
        )}
      </header>
    </div>
  )
}
