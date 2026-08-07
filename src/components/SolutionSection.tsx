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

const products = [
  {
    name: 'Garud',
    role: 'Autonomous measurement drone',
    image: '/solution/garud.jpg',
    alt: 'The Garud measurement drone hovering over a field during a test flight',
    points: ['Plant health capture', 'Structural measurement', 'Biomass & NDVI', 'Change tracking'],
  },
  {
    name: 'Bhairav',
    role: 'Environmental sensing & land security',
    image: '/solution/bhairav.jpg',
    alt: 'Soil sensors, a weather station and a static camera installed across a plantation slope',
    points: ['Soil sensor network', 'Weather station', 'Vision-based camera net'],
  },
  {
    name: 'Nandi',
    role: 'Agentic environmental intelligence platform',
    image: '/solution/nandi.jpg',
    alt: 'Architecture diagram: Garud and Bhairav feed Nandi, which outputs field actions, a live dashboard and a registry report',
    points: ['Manages components & data', 'Vision intelligence layer', 'Field-worker action items', 'Reporting logic'],
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
        <ol className="relative mt-16 grid gap-10 md:grid-cols-5 md:gap-6">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[9px] hidden h-px bg-gradient-to-r from-leaf/10 via-leaf/45 to-leaf/10 md:block"
          />
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="relative">
                <span className="relative z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-leaf/30 bg-paper">
                  <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                </span>
                <p className="mt-5 font-mono text-[11px] tracking-[0.18em] text-fg-on-paper-muted uppercase">
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

        <div className="mt-20 grid gap-5 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.name} delay={i * 90}>
              <article className="leaf-card group flex h-full flex-col overflow-hidden rounded-3xl border border-fg-on-paper/10 bg-paper-raised">
                <img
                  src={product.image}
                  alt={product.alt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="aspect-[3/2] w-full border-b border-fg-on-paper/8 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-2xl font-semibold text-fg-on-paper">
                    {product.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-leaf">{product.role}</p>
                  <ul className="mt-6 space-y-2.5 border-t border-fg-on-paper/8 pt-6">
                    {product.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-sm text-fg-on-paper-muted"
                      >
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-leaf/60" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
