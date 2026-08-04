import { Link } from 'react-router-dom'
import { CloseIcon } from './icons/Icons'

interface AnnouncementBarProps {
  onDismiss: () => void
}

export function AnnouncementBar({ onDismiss }: AnnouncementBarProps) {
  return (
    <div className="flex h-9 items-center justify-center gap-3 bg-accent px-4 text-xs font-medium text-accent-ink sm:text-sm">
      <div className="flex min-w-0 items-center gap-1.5">
        <span className="truncate">We&apos;re raising our seed round —</span>
        <Link to="/invest" className="shrink-0 underline underline-offset-2 hover:no-underline">
          get in touch
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="shrink-0 rounded-full p-1 transition-colors hover:bg-black/10"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
