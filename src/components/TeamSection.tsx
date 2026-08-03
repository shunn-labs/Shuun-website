import { team } from '../data/team'
import { Reveal } from './Reveal'

export function TeamSection() {
  return (
    <section id="team" className="scroll-mt-16 bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-fg-muted uppercase">Our team</p>
          <h2 className="mt-3 text-3xl font-semibold text-fg sm:text-4xl">
            The people building it.
          </h2>
        </Reveal>

        <ul className="mt-14 divide-y divide-white/10 border-y border-white/10">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 60}>
              <li className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-5">
                <p className="text-lg font-semibold text-fg">{member.name}</p>
                <p className="text-sm text-fg-muted">{member.role}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
