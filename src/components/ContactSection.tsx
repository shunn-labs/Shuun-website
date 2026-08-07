import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

const audiences = [
  'Government forest departments',
  'NGOs running plantation programs',
  'Agriculture & plantation estates',
  'Carbon project developers',
]

export function ContactSection() {
  return (
    <section
      id="contact"
      className="relative scroll-mt-[6.25rem] border-t border-fg-on-paper/8 bg-paper py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-leaf/20 bg-leaf-soft px-8 py-16 sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute inset-0 grid-field-light opacity-70" />
            <div className="relative grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
              <div>
                <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
                  05 — Contact us
                </p>
                <h2 className="mt-5 max-w-xl text-[clamp(1.9rem,4vw,3rem)] font-semibold text-fg-on-paper">
                  Tell us about the land you need monitored.
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-fg-on-paper-muted">
                  A single survey is enough to start — it proves our accuracy on your own
                  land before anything longer-term is on the table.
                </p>
                <a
                  href="mailto:000shuun@gmail.com"
                  className="group mt-9 inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong"
                >
                  000shuun@gmail.com
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <ul className="grid gap-px overflow-hidden rounded-2xl border border-leaf/15 bg-leaf/15">
                {audiences.map((audience) => (
                  <li
                    key={audience}
                    className="flex items-center gap-3 bg-paper-raised px-5 py-4 text-sm text-fg-on-paper"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                    {audience}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
