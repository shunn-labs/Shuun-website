import { solutions } from '../data/solutions'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function SolutionsGrid() {
  return (
    <section id="solutions" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-wide text-fg-on-paper-muted uppercase">Sectors</p>
            <h2 className="text-3xl font-semibold text-fg-on-paper sm:text-4xl">One platform, sequenced across five sectors</h2>
            <p className="mt-4 text-base leading-relaxed text-fg-on-paper-muted">
              We're proving the sense-decide-act loop first in environment and agriculture — the same
              architecture is built to extend to defense, infrastructure, and disaster response as it matures.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map((solution, i) => (
            <Reveal key={solution.title} delay={i * 60}>
              <a
                href={solution.href}
                className={`group flex h-full flex-col justify-between rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  solution.flagship ? 'border-accent/40 bg-white ring-2 ring-accent/30' : 'border-black/5 bg-white'
                }`}
              >
                <div>
                  {solution.flagship && (
                    <span className="mb-2 inline-block rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-accent-deep uppercase">
                      Flagship
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-fg-on-paper">{solution.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg-on-paper-muted">{solution.description}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-fg-on-paper">
                  Learn more
                  <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          ))}

          <Reveal delay={solutions.length * 60}>
            <a
              href="#industries"
              className="group flex h-full flex-col justify-between rounded-2xl bg-fg-on-paper p-6 text-paper transition-all hover:-translate-y-1"
            >
              <div>
                <h3 className="text-lg font-semibold">Who we're built for</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  DRDO and government agencies evaluating dual-use capability programs, agri-input
                  companies and cooperatives distributing to farmer networks, and private
                  infrastructure and mining operators piloting inspection use cases.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Browse sectors
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
