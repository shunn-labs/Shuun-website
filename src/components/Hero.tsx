import { useEffect, useRef, useState } from 'react'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    video.muted = true
    if (prefersReducedMotion) {
      video.pause()
    } else {
      video.play().catch(() => {
        /* autoplay blocked — video stays on its poster frame, no crash */
      })
    }
  }, [])

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden bg-ink">
      {/* Drone footage over farmland, muted and decorative. The source clip is
          already trimmed to start at its 3s mark, so the loop restarts there too. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
      >
        <source src="/videos/drone-field-loop.mp4" type="video/mp4" />
      </video>

      <div className="pointer-events-none absolute inset-0 bg-ink/60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-32 text-center lg:px-8">
        <h1 className="text-5xl font-semibold text-fg sm:text-6xl md:text-7xl">
          Autonomous Intelligence
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
          For environmental monitoring and restoration.
        </p>
      </div>
    </section>
  )
}
