import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function CTABanner() {
  return (
    <section className="bg-paper py-16 sm:py-20">
      <Reveal>
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-black/5 bg-white px-8 py-10 lg:flex-row lg:items-center lg:px-12 lg:py-12">
          <div className="max-w-xl">
            <h3 className="text-2xl font-semibold text-fg-on-paper sm:text-3xl">
              See what a fully-closed sense-decide-act loop looks like
            </h3>
            <p className="mt-3 text-base leading-relaxed text-fg-on-paper-muted">
              Walk through a real mission end to end — including the geofence, the manual override,
              and what happens when the system isn't confident and routes to a person instead.
            </p>
          </div>
          <a
            href="#contact"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
          >
            Get the guide
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    </section>
  )
}
