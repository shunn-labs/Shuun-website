import { Reveal } from './Reveal'

// Straight from the deck's competitive-advantage slide, in its own words.
const edges = [
  {
    title: 'The only closed loop: measure → act → prove',
    body: 'We generate the intervention, dispatch it to field workers, and log completion with timestamp and photo evidence. That evidence chain is what a verifier actually needs.',
  },
  {
    title: 'We own the full stack — aerial, ground, and execution',
    body: 'Others analyse third-party satellite data. We capture our own per-tree and ground-sensor data, which is what makes calibration accurate and the insight actionable.',
  },
  {
    title: 'Registry-native from day one',
    body: 'Methodology-ready outputs (VM0047, CCTS) from the first flight — serving the operational dashboard and the VVB audit from the same record.',
  },
]

export function EdgeSection() {
  return (
    // This was the page's one dark stretch. On an all-light site it earns its
    // emphasis from a tinted ground and a heavier rule instead of inverting.
    <section className="relative overflow-hidden border-t border-fg-on-paper/8 bg-leaf-soft/50 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 grid-field-light opacity-80" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
            03 — Why us
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
            Detecting a problem is only the first step.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-on-paper-muted">
            Watering, replanting and pest control are managed separately across this
            industry, leaving no continuous record from detection to resolution. We close
            that gap and keep the receipt.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-leaf/20 bg-leaf/20 md:grid-cols-3">
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
