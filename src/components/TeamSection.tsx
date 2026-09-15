import { team } from '../data/team'
import { Reveal } from './Reveal'

export function TeamSection() {
  return (
    <section
      id="team"
      className="relative scroll-mt-[6.25rem] border-t border-fg-on-paper/8 bg-paper py-28 sm:py-36"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
            04 — Our team
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] font-semibold text-fg-on-paper">
            The people building it.
          </h2>
        </Reveal>

        {/* Centred flex rather than a fixed column grid, so a short row sits in
            the middle instead of hugging the left edge. */}
        <ul className="mt-16 flex flex-wrap justify-center gap-5">
          {team.map((member, i) => (
            <Reveal
              key={member.name}
              as="li"
              delay={i * 80}
              className="w-full max-w-[18rem] sm:w-[calc((100%-2.5rem)/3)]"
            >
              <div className="leaf-card group flex h-full flex-col overflow-hidden rounded-2xl border border-fg-on-paper/10 bg-paper-raised">
                {member.photo ? (
                  <img
                    src={member.photo}
                    alt={member.name}
                    width={640}
                    height={640}
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="grid aspect-square w-full place-items-center bg-leaf-soft font-display text-5xl font-semibold text-leaf/40"
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
                <div className="flex flex-1 flex-col border-t border-fg-on-paper/8 p-5 text-center">
                  <p className="text-base font-semibold text-fg-on-paper">{member.name}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-wide text-leaf uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
