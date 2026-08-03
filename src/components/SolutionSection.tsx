import { Reveal } from './Reveal'

const steps = [
  {
    title: 'Sense',
    body: 'Connected IoT sensors collect ground-truth environmental data continuously, at plot level.',
  },
  {
    title: 'See',
    body: 'Scheduled autonomous drone surveys and AI vision measure every tree.',
  },
  {
    title: 'Secure',
    body: 'Static camera networks detect fire, encroachment, grazing, and unauthorized activity in real time.',
  },
  {
    title: 'Act',
    body: 'Maintenance tasks are generated automatically, and every intervention is recorded with evidence.',
  },
  {
    title: 'Report',
    body: 'Registry-ready MRV reports carry the complete monitoring and maintenance history.',
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="scroll-mt-16 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-fg-on-paper-muted uppercase">
            Solution
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-fg-on-paper sm:text-4xl">
            A closed-loop monitoring and maintenance system.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-on-paper-muted">
            One-time surveys and disconnected field visits are replaced by a continuous
            sense → detect → act → report loop, built from day one to output carbon-registry
            compliant data.
          </p>
        </Reveal>

        <ol className="mt-14 divide-y divide-black/10 border-y border-black/10">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 60}>
              <li className="grid gap-2 py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
                <p className="font-display text-lg font-semibold text-fg-on-paper">{step.title}</p>
                <p className="text-base leading-relaxed text-fg-on-paper-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
