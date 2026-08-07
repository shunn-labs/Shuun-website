import { Link } from 'react-router-dom'
import { CloseIcon } from './icons/Icons'

interface AnnouncementBarProps {
  onDismiss: () => void
}

export function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  return (
    // A solid accent band across the top read as a cookie notice and drowned
    // the hero. Dark with an accent dot says the same thing and lets the
    // footage be the first colour anyone sees.
    <div className="flex h-9 items-center justify-center gap-3 border-b border-white/5 bg-ink/90 px-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] tracking-wide text-fg-muted uppercase">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent animate-pulse-dot" />
        <span className="truncate">We&apos;re raising our seed round</span>
        <Link
          to="/invest"
          className="shrink-0 text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
        >
          get in touch
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 rounded-full p-1 text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
