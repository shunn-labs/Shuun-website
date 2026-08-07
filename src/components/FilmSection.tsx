import { useRef, useState } from 'react'
import { Reveal } from './Reveal'
import { PlayIcon } from './icons/Icons'

const FILM = {
  src: '/videos/shuun-labs-film.mp4',
  poster: '/videos/shuun-labs-film-poster.jpg',
  length: '1:13',
}

export function FilmSection() {
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
    <section
      id="film"
      className="relative scroll-mt-[6.25rem] border-t border-fg-on-paper/8 bg-paper py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
                The film · {FILM.length}
              </p>
              <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] font-semibold text-fg-on-paper">
                Measure. Act. Prove.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-fg-on-paper-muted">
              A closed loop, from the first flight to the final report — the whole system
              in a minute.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border border-fg-on-paper/10 bg-[#050807] shadow-[0_40px_80px_-40px_rgba(11,20,16,0.45)]">
            <video
              ref={videoRef}
              className="aspect-video w-full"
              poster={FILM.poster}
              playsInline
              // 13 MB with a soundtrack: nothing loads until someone asks for
              // it, and it never plays over anyone unannounced.
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
        </Reveal>
      </div>
    </section>
  )
}
