import { team } from '../data/team'
import { Reveal } from './Reveal'

export function TeamSection() {
  return (
    <section id="team" className="scroll-mt-[6.25rem] bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Our team</p>
          <h2 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
            The people building it.
          </h2>
        </Reveal>

        <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 60}>
              <li>
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="aspect-square w-full rounded-2xl object-cover ring-1 ring-white/10"
                  />
                ) : (
                  // No photo for this one, so the tile carries an initial
                  // rather than leaving a hole in the row.
                  <div
                    aria-hidden="true"
                    className="grid aspect-square w-full place-items-center rounded-2xl bg-surface font-display text-4xl font-semibold text-fg-muted ring-1 ring-white/10"
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
                <p className="mt-4 text-base font-semibold text-fg">{member.name}</p>
                <p className="mt-0.5 text-sm text-fg-muted">{member.role}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
