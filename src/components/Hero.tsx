import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon } from './icons/Icons'

const CAPABILITIES = [
  { value: 'Per-tree', label: 'resolution, not per-plot' },
  { value: 'Continuous', label: 'not a quarterly snapshot' },
  { value: 'Registry-ready', label: 'MRV from day one' },
]

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
    <section id="top" className="relative flex min-h-svh flex-col justify-end overflow-hidden bg-ink">
      {/* Drone footage over farmland, muted and decorative. The source clip is
          already trimmed to start at its 3s mark, so the loop restarts there. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
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

      {/* Three stacked passes rather than one flat wash: an overall damp, a
          heavy foot for the type to sit on, and a green cast that ties the
          footage to the palette instead of leaving it a grey rectangle. */}
      <div className="pointer-events-none absolute inset-0 bg-ink/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/10" />
      <div className="pointer-events-none absolute inset-0 mix-blend-soft-light bg-accent/12" />
      <div className="pointer-events-none absolute inset-0 grid-field opacity-60" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-40 sm:pb-20 lg:px-8">
        <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
          Autonomous environmental intelligence
        </p>

        <h1 className="mt-6 max-w-5xl text-[clamp(2.5rem,6.4vw,5.25rem)] font-semibold text-fg">
          We measure the forest,
          <br />
          <span className="text-gradient">tree by tree.</span>
        </h1>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          Drones, ground sensors and an agentic AI layer that watch a plantation
          continuously — detect what changed, dispatch the fix, and file the evidence a
          carbon registry will accept.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#solution"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
          >
            See how it works
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/invest"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-fg backdrop-blur-sm transition-colors hover:border-white/35 hover:bg-white/5"
          >
            Investor deck
          </a>
        </div>

        <dl className="mt-16 grid max-w-3xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div key={item.value} className="bg-ink/70 px-5 py-5 backdrop-blur-md">
              <dt className="font-display text-xl font-semibold text-fg">{item.value}</dt>
              <dd className="mt-1 font-mono text-[11px] tracking-wide text-fg-muted uppercase">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-8 lg:px-8">
        <span
          aria-hidden="true"
          className="block h-8 w-px bg-gradient-to-b from-accent to-transparent animate-scroll-hint"
        />
      </div>
    </section>
  )
}
