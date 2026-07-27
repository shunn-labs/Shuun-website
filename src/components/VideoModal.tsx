import { useEffect, useRef, useState } from 'react'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'
import { CloseIcon } from './icons/Icons'

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  src: string
}

export function VideoModal({ isOpen, onClose, src }: VideoModalProps) {
  const [entered, setEntered] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(isOpen)

  useEffect(() => {
    if (!isOpen) {
      setEntered(false)
      return
    }
    const frame = requestAnimationFrame(() => setEntered(true))
    closeButtonRef.current?.focus()
    return () => cancelAnimationFrame(frame)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mission video"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-300 sm:p-8 ${
        entered ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-fg transition-colors hover:bg-white/20 sm:top-8 sm:right-8"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <div
        className={`relative aspect-video w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ${
          entered ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <video className="h-full w-full" src={src} controls autoPlay playsInline loop>
          Your browser doesn&apos;t support embedded video.
        </video>
      </div>
    </div>
  )
}
