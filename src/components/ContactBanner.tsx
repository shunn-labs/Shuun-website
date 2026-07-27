import { QuadrupedArt } from './art/RobotArt'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function ContactBanner() {
  return (
    <section id="contact" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <div className="aspect-[4/3] rounded-3xl bg-white ring-1 ring-black/5">
            <QuadrupedArt className="h-full w-full p-10 text-fg-on-paper" />
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="text-2xl font-semibold text-fg-on-paper sm:text-3xl">
            Have a corridor, site, or season in mind?
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-fg-on-paper-muted">
            Tell us about the terrain and the risk you're managing. We'll walk through whether a
            pilot makes sense before either of us commits to anything.
          </p>
          <a
            href="mailto:hello@shunnlabs.example"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
          >
            Get started
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
