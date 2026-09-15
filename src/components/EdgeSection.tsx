import { Reveal } from './Reveal'

const edges = [
  {
    title: 'Legs, not wheels',
    body: 'Most forestry ground robots are wheeled and built for flat farmland. Bhairav is being designed as a quadruped, to stay stable on the rocky slopes, dense undergrowth and riverbanks where reforestation is needed most.',
  },
  {
    title: 'Planted, not scattered',
    body: 'Field studies put the survival of seeds scattered from the air at 0–20%. Bhairav will drill, place and secure each sapling in prepared soil, avoiding the fragile seed-to-sapling stage.',
  },
  {
    title: 'Designed for forestry',
    body: 'General-purpose robot dogs carry expensive features forestry never uses. Bhairav is being designed only for drilling, planting, pick-and-place and ground inspection — to optimise performance and cost.',
  },
  {
    title: 'An AI that learns',
    body: 'Traditional planting has no memory — each session starts from scratch. Nandi will track what was planted and what survived, and keep refining site selection and planting strategy.',
  },
]

export function EdgeSection() {
  return (
    <section className="relative overflow-hidden border-t border-fg-on-paper/8 bg-leaf-soft/50 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 grid-field-light opacity-80" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
            03 — Why us
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
            Others solve one piece. We&apos;re building the whole system.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-on-paper-muted">
            Existing reforestation technology tackles terrain, survival or intelligence in
            isolation. Project Punarvan is designed to bring terrain-adaptive planting,
            high-survival methods and a learning decision layer together in one fleet.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-leaf/20 bg-leaf/20 sm:grid-cols-2">
          {edges.map((edge, i) => (
            <Reveal key={edge.title} delay={i * 90}>
              <article className="h-full bg-paper-raised p-8 transition-colors duration-500 hover:bg-paper sm:p-9">
                <span className="font-mono text-[11px] tracking-[0.18em] text-leaf">
                  {String.fromCharCode(65 + i)}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-fg-on-paper">{edge.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-fg-on-paper-muted">{edge.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
