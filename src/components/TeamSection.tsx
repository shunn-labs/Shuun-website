import { team } from '../data/team'
import { Reveal } from './Reveal'

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative scroll-mt-[6.25rem] border-t border-white/5 bg-ink py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
            03 — Our team
          </p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-semibold text-fg">
            The people building it.
          </h2>
        </Reveal>

        <ul className="mt-16 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 80}>
              <li className="edge-card group overflow-hidden rounded-2xl border border-white/10 bg-surface/60">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="aspect-square w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                ) : (
                  // No photo for this one, so the tile carries an initial
                  // rather than leaving a hole in the row.
                  <div
                    aria-hidden="true"
                    className="grid aspect-square w-full place-items-center bg-surface-raised font-display text-5xl font-semibold text-fg-muted/40"
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="p-5">
                  <p className="text-base font-semibold text-fg">{member.name}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-wide text-fg-muted uppercase">
                    {member.role}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
