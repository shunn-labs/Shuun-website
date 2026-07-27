import { solutions } from '../data/solutions'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function SolutionsGrid() {
  return (
    <section id="solutions" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-wide text-fg-on-paper-muted uppercase">Solutions</p>
            <h2 className="text-3xl font-semibold text-fg-on-paper sm:text-4xl">One loop, several fronts</h2>
            <p className="mt-4 text-base leading-relaxed text-fg-on-paper-muted">
              We're focused first on wildfire fuel-load reduction — the same detect-approve-execute-verify
              loop extends to these adjacent environmental risks.
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
                <h3 className="text-lg font-semibold">Who we work with</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  Utilities, fire districts, government conservation programs, and insurers already
                  paying for wildfire and environmental risk mitigation.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Browse industries
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
