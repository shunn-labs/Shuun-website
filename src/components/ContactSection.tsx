import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-[6.25rem] border-t border-white/5 bg-ink py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          {/* The panel is the one bright surface on the page, so the closing
              ask carries the accent instead of competing with it. */}
          <div className="glow-field relative overflow-hidden rounded-[2rem] border border-accent/25 bg-surface/70 px-8 py-16 text-center sm:px-16 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-field opacity-40" />
            <div className="relative">
              <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                04 — Contact us
              </p>
              <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold text-fg">
                Tell us about the land you need monitored.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-fg-muted">
                Forest departments, plantation estates, NGOs and carbon developers — if it
                grows and has to be proved, we should talk.
              </p>
              <a
                href="mailto:000shuun@gmail.com"
                className="group mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-strong"
              >
                000shuun@gmail.com
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
