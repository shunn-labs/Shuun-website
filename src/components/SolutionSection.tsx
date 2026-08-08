import { LoopCard } from './LoopCard'
import { Reveal } from './Reveal'

const steps = [
  {
    title: 'Sense',
    aside: 'ground truth, continuous',
    body: 'Connected IoT sensors collect ground-truth environmental data at plot level, without waiting for a site visit.',
  },
  {
    title: 'See',
    aside: 'aerial, per-tree',
    body: 'Scheduled autonomous drone surveys and AI vision measure every tree — height, biomass, NDVI, count.',
  },
  {
    title: 'Secure',
    aside: 'real time',
    body: 'Static camera networks detect fire, encroachment, grazing and unauthorised activity as it happens.',
  },
  {
    title: 'Act',
    aside: 'the part competitors skip',
    body: 'Maintenance tasks are generated and dispatched, and every intervention is logged with timestamp and photo evidence.',
  },
  {
    title: 'Report',
    aside: 'registry-native',
    body: 'Registry-ready MRV reports carry the full monitoring and maintenance history a verifier asks for.',
  },
]

// Three of the eleven clips: the two ends of the loop and the layer between
// them. Illustrative b-roll rather than footage of our own deployments, which
// is why each is captioned by stage rather than by product.
const clips = [
  {
    src: '/loop/aerial-capture.mp4',
    poster: '/loop/aerial-capture.jpg',
    stage: 'See',
    title: 'Per-tree capture',
    body: 'Scheduled drone surveys measure every tree — height, biomass, NDVI and count — instead of sampling a plot and extrapolating.',
  },
  {
    src: '/loop/ground-sensor.mp4',
    poster: '/loop/ground-sensor.jpg',
    stage: 'Sense',
    title: 'Ground truth between flights',
    body: 'Soil, weather and land-security sensors hold the plot-level record continuously, so a survey lands on context rather than a blank slate.',
  },
  {
    src: '/loop/platform.mp4',
    poster: '/loop/platform.jpg',
    stage: 'Report',
    title: 'One record, two audiences',
    body: 'The same monitoring and maintenance history drives the operational dashboard and the registry submission.',
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
            02 — The solution
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
            A closed loop, from the soil to the registry.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-on-paper-muted">
            One-time surveys and disconnected field visits are replaced by a continuous
            sense → detect → act → report loop, built from day one to output
            carbon-registry compliant data.
          </p>
        </Reveal>

        {/* Five stages on one rule, so the loop is legible as a sequence before
            a word of it is read. The rule is the product. */}
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-5 lg:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[9px] hidden h-px bg-gradient-to-r from-leaf/25 via-leaf to-leaf/25 lg:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="relative">
                {/* Stacked, the loop still has to read as a run, so the marker
                    column carries a vertical rule where the horizontal one
                    cannot exist. */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[8px] top-[18px] h-[calc(100%+2.5rem)] w-px bg-leaf/25 sm:hidden"
                  />
                )}
                <span className="relative z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-leaf/40 bg-paper-dim ring-4 ring-paper-dim">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                </span>
                {/* Reserved height, so a two-line aside cannot push one stage
                    title out of line with its neighbours. */}
                <p className="mt-5 font-mono text-[11px] leading-relaxed tracking-[0.18em] text-fg-on-paper-muted uppercase lg:min-h-[3.2em]">
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

        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip, i) => (
            <Reveal key={clip.title} delay={i * 90}>
              <LoopCard {...clip} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
