import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../data/nav";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";
import { AnnouncementBar } from "./AnnouncementBar";
import { CloseIcon, MenuIcon } from "./icons/Icons";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  // The section links are same-page anchors, which do nothing from another
  // route — off the homepage they have to navigate back to it first.
  const onHomepage = useLocation().pathname === "/";
  const sectionHref = (href: string) => (onHomepage ? href : `/${href}`);

  useLockBodyScroll(mobileOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {announcementVisible && (
        <AnnouncementBar onDismiss={() => setAnnouncementVisible(false)} />
      )}
      <header
        className={`transition-colors duration-300 ${
          scrolled
            ? "border-b border-fg-on-paper/8 bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 lg:px-8">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Shunn Labs"
              width={593}
              height={192}
              className="h-9 w-auto"
            />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={sectionHref(item.href)}
                    className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-on-paper-muted transition-colors hover:text-fg-on-paper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            to="/invest"
            className="hidden rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong lg:block"
          >
            Invest in us
          </Link>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-fg-on-paper lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div
            className={`overflow-y-auto border-t border-fg-on-paper/8 bg-paper px-5 pb-10 pt-4 lg:hidden ${
              announcementVisible
                ? "h-[calc(100svh-6.25rem)]"
                : "h-[calc(100svh-4rem)]"
            }`}
          >
            <ul className="divide-y divide-fg-on-paper/8">
              {navItems.map((item) => (
                <li key={item.label} className="py-3">
                  <a
                    href={sectionHref(item.href)}
                    className="text-base font-medium text-fg-on-paper"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              to="/invest"
              className="mt-6 block rounded-full bg-leaf px-4 py-3 text-center text-sm font-semibold text-leaf-ink"
              onClick={() => setMobileOpen(false)}
            >
              Invest in us
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}
