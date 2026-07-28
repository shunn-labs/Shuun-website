import { NetworkArt } from './art/RobotArt'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function PulseSection() {
  return (
    <section id="pulse" className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-accent/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <Reveal>
          <p className="mb-3 text-xs font-semibold tracking-wide text-accent uppercase">Pulse orchestration OS</p>
          <h2 className="text-3xl font-semibold text-fg sm:text-4xl">
            Every detection, decision, and action — in one place
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted">
            Pulse is the command center behind the loop: it stores every flight's imagery and
            telemetry in a queryable, versioned form, generates geotagged reports a non-technical
            buyer can act on, and turns your dataset and model checkpoints into a documented,
            defensible IP asset — not loose files.
          </p>
          <a
            href="#contact"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] hover:bg-accent-strong"
          >
            See Pulse in action
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative aspect-[4/3] rounded-3xl bg-surface ring-1 ring-white/10">
            <NetworkArt className="h-full w-full p-10 text-accent" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
