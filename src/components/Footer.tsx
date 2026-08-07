export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-12 sm:flex-row sm:justify-between lg:px-8">
        <a href="/" className="flex items-center gap-2 font-display text-base font-semibold text-fg">
          <img src="/logo.png" alt="" width={40} height={87} className="h-8 w-auto" />
          Shuun Labs
        </a>
        <p className="text-xs text-fg-muted">
          © {new Date().getFullYear()} Shuun Labs. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
