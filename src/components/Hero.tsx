import { useEffect, useRef, useState } from 'react'
import { ArrowRightIcon, PlayIcon } from './icons/Icons'
import { VideoModal } from './VideoModal'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(false)
  const [missionOpen, setMissionOpen] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    video.muted = true
    if (prefersReducedMotion) {
      video.pause()
      return
    }

    // Autoplay blocked (e.g. Safari Low Power Mode or a site autoplay
    // setting) — resume as soon as the visitor interacts with the page,
    // since that satisfies every browser's gesture requirement.
    const resume = () => {
      video.play().catch(() => {})
    }
    const events: Array<keyof WindowEventMap> = ['click', 'touchstart', 'scroll', 'keydown']

    video.play().catch(() => {
      events.forEach((event) => window.addEventListener(event, resume, { once: true, passive: true }))
    })

    return () => {
      events.forEach((event) => window.removeEventListener(event, resume))
    }
  }, [])

  // Pause the ambient background footage while the mission video plays,
  // so the two clips don't compete for attention (or audio).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (missionOpen) {
      video.pause()
    } else {
      video.play().catch(() => {})
    }
  }, [missionOpen])

  return (
    <section
      id="top"
      className="relative flex min-h-[92svh] items-center overflow-hidden bg-ink"
      style={{ paddingTop: 'var(--header-offset, 64px)' }}
    >
      {/* full-bleed looping footage, muted and decorative */}
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
        <source src="/videos/drone-uav-loop.mp4" type="video/mp4" />
      </video>

      {/* even wash so the footage never fights with foreground contrast, anywhere in the frame */}
      <div className="pointer-events-none absolute inset-0 bg-ink/45" />
      {/* stronger scrim behind the copy, fading out toward the open frame on the right */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/35 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-ink/55 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10 lg:p-12">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide text-fg-muted uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Now piloting: wildfire fuel-load reduction
          </p>
          <h1 className="text-4xl font-semibold text-fg sm:text-5xl md:text-6xl">
            See the risk from the air. Clear it on the ground. Verify it&apos;s done.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            Shunn Labs pairs aerial detection with ground robots to reduce wildfire fuel load, treat
            invasive species, and monitor utility corridors — every action proposed by our system and
            confirmed by a person before a robot ever moves.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#detect"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] hover:bg-accent-strong"
            >
              See how it works
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setMissionOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-white/30"
            >
              <PlayIcon className="h-4 w-4" />
              Watch a mission
            </button>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-6">
            {[
              ['Detect', 'aerial scan flags the risk'],
              ['Approve', 'a person confirms the action'],
              ['Verify', 'a second pass confirms it’s done'],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="font-display text-2xl font-semibold text-fg">{value}</dt>
                <dd className="mt-1 text-xs text-fg-muted">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <VideoModal isOpen={missionOpen} onClose={() => setMissionOpen(false)} src="/videos/mission-preview.mp4" />
    </section>
  )
}
