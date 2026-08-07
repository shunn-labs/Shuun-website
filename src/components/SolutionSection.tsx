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

// Only the two products we have a real picture of. Nandi is the software layer
// and has nothing photographable, so it is described rather than padded out
// with stock art.
const hardware = [
  {
    name: 'Bhairav',
    image: '/solution/bhairav.jpg',
    alt: 'Soil sensors, a weather station and a static camera installed across a plantation slope',
    caption: 'Ground sensing, weather and land security across the plot.',
  },
  {
    name: 'Garud',
    image: '/solution/garud.jpg',
    alt: 'The Garud measurement drone hovering over a field during a test flight',
    caption: 'The autonomous measurement drone, in the field.',
  },
]

export function SolutionSection() {
  return (
    <section
      id="solution"
      className="glow-field relative scroll-mt-[6.25rem] overflow-hidden border-t border-white/5 bg-surface/40 py-28 sm:py-36"
    >
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
            02 — The solution
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold text-fg">
            A closed loop, from the soil to the registry.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg-muted">
            One-time surveys and disconnected field visits are replaced by a continuous
            sense → detect → act → report loop, built from day one to output
            carbon-registry compliant data.
          </p>
        </Reveal>

        {/* The five stages read as one run rather than five bullets: a single
            rule threads the markers, so the loop is visible before it is read. */}
        <ol className="relative mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <li className="group h-full bg-ink p-6 transition-colors duration-500 hover:bg-surface-raised sm:p-7">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-fg-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="h-px flex-1 bg-white/10 transition-colors duration-500 group-hover:bg-accent/50" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-fg">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {hardware.map((item, i) => (
            <Reveal key={item.name} delay={i * 90}>
              <figure className="edge-card group h-full overflow-hidden rounded-3xl border border-white/10 bg-ink">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={1200}
                    height={800}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 p-6">
                    <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
                      {item.name}
                    </p>
                    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-fg">
                      {item.caption}
                    </p>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
