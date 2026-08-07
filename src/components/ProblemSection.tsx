import { Reveal } from './Reveal'

const problems = [
  {
    title: 'Manual monitoring doesn’t scale',
    body: 'Field teams inspect sites periodically and record tree survival, growth, and health by hand. Problems are found too late, and restoration costs rise.',
    // Deliberately not a number: we have no measured figure for detection lag,
    // and inventing one on an investor-facing page is not worth the polish.
    stat: 'By hand',
    statLabel: 'every survival, growth and health check, on foot',
  },
  {
    title: 'Data collection isn’t continuous monitoring',
    body: 'Satellite imagery lacks per-tree resolution and drone surveys give only periodic snapshots. Neither covers a project’s full lifecycle.',
    stat: '10 m',
    statLabel: 'best free satellite pixel — a sapling is a fraction of it',
  },
]

export function ProblemSection() {
  return (
    <section
      id="problem"
      className="relative scroll-mt-[6.25rem] overflow-hidden border-t border-white/5 bg-ink py-28 sm:py-36"
    >
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
            01 — The problem
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold text-fg">
            Nature is degrading faster than we can restore it.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {problems.map((problem, i) => (
            <Reveal key={problem.title} delay={i * 100}>
              <article className="edge-card flex h-full flex-col rounded-3xl border border-white/10 bg-surface/60 p-8 sm:p-10">
                <p className="font-display text-5xl font-semibold text-accent sm:text-6xl">
                  {problem.stat}
                </p>
                <p className="mt-2 font-mono text-[11px] leading-relaxed tracking-wide text-fg-muted uppercase">
                  {problem.statLabel}
                </p>
                <h3 className="mt-10 text-2xl font-semibold text-fg">{problem.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-fg-muted">{problem.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
