import { Reveal } from './Reveal'

const problems = [
  {
    title: 'Manual monitoring doesn’t scale',
    body: 'Field teams inspect sites periodically and record tree survival, growth, and health by hand. Problems are found too late, and restoration costs rise.',
  },
  {
    title: 'Data collection isn’t continuous monitoring',
    body: 'Satellite imagery lacks per-tree resolution and drone surveys give only periodic snapshots. Neither covers a project’s full lifecycle.',
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-16 bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Problem</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-fg sm:text-4xl">
            Nature is degrading faster than we can restore it.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 sm:gap-12">
          {problems.map((problem, i) => (
            <Reveal key={problem.title} delay={i * 80}>
              <p className="font-display text-sm text-accent">0{i + 1}</p>
              <h3 className="mt-3 text-xl font-semibold text-fg">{problem.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{problem.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
