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

// Only the two products we have a real picture of. Nandi is the software
// layer and has nothing photographable, so it stays in the step list rather
// than being padded out with stock art.
const hardware = [
  {
    name: 'Bhairav',
    image: '/solution/bhairav.jpg',
    alt: 'Soil sensors, a weather station and a static camera installed across a plantation slope',
    caption: 'ground sensing, weather and land security across the plot.',
  },
  {
    name: 'Garud',
    image: '/solution/garud.jpg',
    alt: 'The Garud measurement drone hovering over a field during a test flight',
    caption: 'the autonomous measurement drone, in the field.',
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="scroll-mt-[6.25rem] bg-paper py-24 sm:py-32">
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {hardware.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <figure>
                <img
                  src={item.image}
                  alt={item.alt}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="aspect-[3/2] w-full rounded-2xl object-cover ring-1 ring-black/10"
                />
                <figcaption className="mt-3 text-sm text-fg-on-paper-muted">
                  <span className="font-semibold text-fg-on-paper">{item.name}</span> — {item.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

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
