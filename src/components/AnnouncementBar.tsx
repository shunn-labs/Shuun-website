import { Link } from 'react-router-dom'
import { CloseIcon } from './icons/Icons'

interface AnnouncementBarProps {
  onDismiss: () => void
}

export function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  return (
    <div className="flex h-9 items-center justify-center gap-3 border-b border-fg-on-paper/8 bg-paper-dim/90 px-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-2 font-mono text-[11px] tracking-wide text-fg-on-paper-muted uppercase">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-leaf animate-pulse-dot" />
        <span className="truncate">We&apos;re raising our seed round</span>
        <Link
          to="/invest"
          className="shrink-0 text-leaf underline decoration-leaf/30 underline-offset-4 transition-colors hover:decoration-leaf"
        >
          get in touch
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 rounded-full p-1 text-fg-on-paper-muted transition-colors hover:bg-fg-on-paper/5 hover:text-fg-on-paper"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
