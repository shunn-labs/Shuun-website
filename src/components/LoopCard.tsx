import { useEffect, useRef } from 'react'

interface LoopCardProps {
  src: string
  poster: string
  /** Stage of the loop this clip illustrates, e.g. "See". */
  stage: string
  title: string
  body: string
}

/**
 * A muted looping clip in the site's card language: footage on top, text
 * underneath on paper — the same shape as the team and problem cards, so the
 * page reads as one system rather than a dark strip dropped into a light page.
 *
 * Playback starts only once the card is near the viewport and pauses when it
 * leaves: three autoplaying videos on one page is a real cost on a phone.
 */
export function LoopCard({ src, poster, stage, title, body }: LoopCardProps) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') {
      video.play().catch(() => {})
      return
    }

    // With a cold buffer the first play() can lose the race and reject,
    // leaving the clip on its poster forever. Retrying once the element says
    // it can play is what makes the lazy start reliable.
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
    <figure className="leaf-card group flex h-full flex-col overflow-hidden rounded-3xl border border-fg-on-paper/10 bg-paper-raised">
      <div className="relative overflow-hidden bg-[#050807]">
        <video
          ref={ref}
          className="aspect-[3/2] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>

      <figcaption className="flex flex-1 flex-col border-t border-fg-on-paper/8 p-7">
        <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">{stage}</p>
        <h3 className="mt-3 font-display text-xl font-semibold text-fg-on-paper">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-on-paper-muted">{body}</p>
      </figcaption>
    </figure>
  )
}
