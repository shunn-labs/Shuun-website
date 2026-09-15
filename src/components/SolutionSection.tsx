import { Reveal } from './Reveal'

const steps = [
  {
    title: 'Map',
    aside: 'from the air',
    body: 'Sharabh will survey the target area, detect terrain and obstacles, and flag the spots worth planting.',
  },
  {
    title: 'Decide',
    aside: 'the plan',
    body: 'Nandi will process the map and plan the task sequence and the optimal planting pattern.',
  },
  {
    title: 'Execute',
    aside: 'on the ground',
    body: 'Bhairav will walk to each spot, drill, plant the sapling and report completion.',
  },
  {
    title: 'Monitor',
    aside: 'after planting',
    body: 'Sharabh and Bhairav will keep tracking growth and health long after the sapling is in the ground.',
  },
]

const systems = [
  {
    name: 'Sharabh',
    kind: 'The drone',
    tagline: 'Eyes in the sky',
    capabilities: [
      'Aerial mapping and terrain scanning',
      'Detection of rocks, water bodies, vegetation and wildlife',
      'Planting-spot selection from soil, slope and sunlight',
      'Multispectral imagery for NDVI and vegetation health',
    ],
  },
  {
    name: 'Bhairav',
    kind: 'The robodog',
    tagline: 'Ground executor',
    capabilities: [
      'Designed for hills, dense forest floor and riverbanks',
      'Ground inspection and soil drilling',
      'Sapling planting and pick-and-place',
      'Real-time execution of Nandi’s tasks',
    ],
  },
  {
    name: 'Nandi',
    kind: 'The AI brain',
    tagline: 'Agentic orchestrator',
    capabilities: [
      'Coordination of Sharabh’s maps with Bhairav’s work',
      'Site, species and planting-density planning',
      'Tree count, height, biomass and CO₂ estimates',
      'Disease and deforestation-risk early warnings',
    ],
  },
]

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="relative scroll-mt-[6.25rem] border-t border-fg-on-paper/8 bg-paper-dim/60 py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
            02 — Project Punarvan
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
            One fleet to map, plant and watch the forest grow.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-on-paper-muted">
            We&apos;re developing autonomous robotics and agentic AI for large-scale tree
            plantation, reforestation and forest-health monitoring — a drone to survey from
            the air, a robot to plant on the ground, and a brain designed to coordinate both
            and learn from every planting.
          </p>
        </Reveal>

        {/* Four stages on one rule, so the workflow is legible as a sequence
            before a word of it is read. */}
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[9px] hidden h-px bg-gradient-to-r from-leaf/25 via-leaf to-leaf/25 lg:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              {/* Stacked, the marker moves into a gutter of its own and the
                  text is indented past it. Left in the text column, the
                  connecting rule ran straight through the copy. */}
              <li className="relative pl-9 sm:pl-0">
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[8px] top-[22px] h-[calc(100%+18px)] w-px bg-leaf/25 sm:hidden"
                  />
                )}
                <span className="absolute left-0 top-0 z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-leaf/40 bg-paper-dim ring-4 ring-paper-dim sm:relative sm:left-auto sm:top-auto">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                </span>
                <p className="font-mono text-[11px] leading-relaxed tracking-[0.18em] text-fg-on-paper-muted uppercase sm:mt-5">
                  {String(i + 1).padStart(2, '0')} · {step.aside}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-fg-on-paper">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-on-paper-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {systems.map((system, i) => (
            <Reveal key={system.name} delay={i * 90}>
              <article className="leaf-card flex h-full flex-col rounded-3xl border border-fg-on-paper/10 bg-paper-raised p-8">
                <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
                  {system.tagline}
                </p>
                <h3 className="mt-4 font-display text-3xl font-semibold text-fg-on-paper">
                  {system.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-fg-on-paper-muted">
                  {system.kind} · in development
                </p>
                <ul className="mt-6 space-y-3 border-t border-fg-on-paper/8 pt-6">
                  {system.capabilities.map((capability) => (
                    <li
                      key={capability}
                      className="flex gap-3 text-sm leading-relaxed text-fg-on-paper-muted"
                    >
                      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
