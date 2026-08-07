import { Reveal } from './Reveal'

// Both figures are the deck's own, kept as the deck states them.
const scale = [
  { value: '10 M+', label: 'hectares of forest lost every year' },
  { value: '1 M+', label: 'species at risk' },
]

const problems = [
  {
    index: '01',
    title: 'Manual monitoring doesn’t scale',
    body: 'Field teams inspect sites periodically and record tree survival, growth, and health by hand. Problems are detected too late, and restoration costs rise.',
  },
  {
    index: '02',
    title: 'Data collection isn’t continuous monitoring',
    body: 'Satellite imagery lacks the resolution for individual trees, and drone surveys give only periodic snapshots. Neither covers a project’s full lifecycle.',
  },
]

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative scroll-mt-[6.25rem] border-t border-fg-on-paper/8 bg-paper py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
                01 — The problem
              </p>
              <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
                Nature is degrading faster than we can restore it.
              </h2>

              <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
                {scale.map((item) => (
                  <div key={item.value}>
                    <dt className="font-display text-4xl font-semibold text-leaf">{item.value}</dt>
                    <dd className="mt-1.5 max-w-[14rem] font-mono text-[11px] leading-relaxed tracking-wide text-fg-on-paper-muted uppercase">
                      {item.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          <div className="grid gap-5">
            {problems.map((problem, i) => (
              <Reveal key={problem.title} delay={i * 100}>
                <article className="leaf-card h-full rounded-3xl border border-fg-on-paper/10 bg-paper-raised p-8 sm:p-10">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-fg-on-paper-muted">
                    {problem.index}
                  </span>
                  <h3 className="mt-5 text-2xl font-semibold text-fg-on-paper">{problem.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-fg-on-paper-muted">
                    {problem.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
