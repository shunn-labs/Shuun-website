import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon, PlayIcon } from './icons/Icons'

const PROOF = [
  { value: 'Per-tree', label: 'resolution, not per-plot' },
  { value: 'Continuous', label: 'not a quarterly snapshot' },
  { value: 'VM0047', label: 'registry-native from day one' },
]

const FILM = {
  src: '/videos/shuun-labs-film.mp4',
  poster: '/videos/shuun-labs-film-poster.jpg',
  length: '1:13',
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  function play() {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    video.play().catch(() => {
      // Autoplay policy should not block a click, but if it does the native
      // controls are already showing and the visitor can start it themselves.
    })
  }

  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-32 pb-20 sm:pt-40 sm:pb-24">
      <div className="pointer-events-none absolute inset-0 grid-field-light" />
      {/* One warm light source behind the headline, so the paper has a centre
          rather than reading as an even sheet. */}
      <div className="pointer-events-none absolute -top-40 left-1/4 h-[420px] w-[620px] rounded-full bg-leaf-soft blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
          Autonomous environmental intelligence
        </p>

        <h1 className="mt-7 max-w-4xl text-[clamp(2.5rem,6.2vw,5rem)] font-semibold text-fg-on-paper">
          We measure the forest,{' '}
          <span className="text-gradient-leaf">tree by tree</span> — and prove it.
        </h1>

        <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <p className="max-w-xl text-lg leading-relaxed text-fg-on-paper-muted sm:text-xl">
            Drones, ground sensors and an agentic AI layer that watch a plantation
            continuously — detect what changed, dispatch the fix, and file the evidence
            chain a carbon registry will actually accept.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#solution"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong"
            >
              See how it works
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <Link
              to="/invest"
              className="inline-flex items-center rounded-full border border-fg-on-paper/15 px-7 py-3.5 text-sm font-semibold text-fg-on-paper transition-colors hover:border-fg-on-paper/35 hover:bg-fg-on-paper/5"
            >
              Investor deck
            </Link>
          </div>
        </div>

        {/* The film is the page's one video, and it sits here rather than below
            the fold: it is the whole pitch in a minute. It opens on its own
            poster and never plays unasked — 13 MB with a soundtrack should not
            arrive uninvited, and nothing else on the page competes with it. */}
        <div className="relative mt-14 overflow-hidden rounded-[1.75rem] border border-fg-on-paper/10 bg-[#050807] shadow-[0_40px_80px_-40px_rgba(11,20,16,0.45)]">
          <video
            ref={videoRef}
            className="aspect-video w-full"
            poster={FILM.poster}
            playsInline
            preload="none"
            controls={started}
          >
            <source src={FILM.src} type="video/mp4" />
            Your browser can&apos;t play this video.{' '}
            <a href={FILM.src}>Download it instead.</a>
          </video>

          {!started && (
            <button
              type="button"
              onClick={play}
              aria-label="Play the film"
              className="group absolute inset-0 grid place-items-center bg-[#050807]/20 transition-colors hover:bg-[#050807]/10"
            >
              <span className="flex items-center gap-3 rounded-full bg-paper/95 px-6 py-3.5 text-sm font-semibold text-fg-on-paper shadow-lg backdrop-blur-sm transition-transform group-hover:scale-[1.04]">
                <PlayIcon className="h-4 w-4" />
                Watch the film
                <span className="font-mono text-[11px] font-normal tracking-wide text-fg-on-paper-muted">
                  {FILM.length}
                </span>
              </span>
            </button>
          )}
        </div>

        <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-fg-on-paper/10 bg-fg-on-paper/10 sm:grid-cols-3">
          {PROOF.map((item) => (
            <div key={item.value} className="bg-paper-raised px-6 py-6">
              <dt className="font-display text-2xl font-semibold text-fg-on-paper">{item.value}</dt>
              <dd className="mt-1.5 font-mono text-[11px] tracking-wide text-fg-on-paper-muted uppercase">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
