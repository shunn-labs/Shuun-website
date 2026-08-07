import { useEffect, useRef } from 'react'

interface LoopVideoProps {
  src: string
  poster: string
  /** Stage of the loop this clip illustrates, e.g. "See". */
  stage: string
  caption: string
  className?: string
}

/**
 * A muted, looping clip used as illustration.
 *
 * Playback starts only once the clip is near the viewport: three autoplaying
 * videos on one page is a real cost on a phone, and none of them is the
 * reason anyone came.
 */
export function LoopVideo({ src, poster, stage, caption, className = '' }: LoopVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {})
      return
    }

    // With preload="none" the first play() can lose the race with an empty
    // buffer and reject, leaving the clip on its poster forever. Retrying once
    // the element says it can play is what makes the lazy start reliable.
    function start() {
      video!.play().catch(() => {
        video!.addEventListener('canplay', () => video!.play().catch(() => {}), { once: true })
        video!.load()
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else video.pause()
      },
      { rootMargin: '200px' },
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <figure
      className={`leaf-card group relative overflow-hidden rounded-3xl border border-fg-on-paper/10 bg-[#050807] ${className}`}
    >
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* The gradient exists to make the caption legible on any frame, so it
          is anchored to the caption rather than washing the whole clip. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050807] via-[#050807]/60 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-mono text-[11px] tracking-[0.18em] text-[#5cf29d] uppercase">{stage}</p>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-white/90">{caption}</p>
      </figcaption>
    </figure>
  )
}
