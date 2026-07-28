import { Reveal } from '../components/Reveal'
import { ArrowRightIcon } from '../components/icons/Icons'
import { team } from '../data/team'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

const avatarTones = [
  'bg-accent/15 text-accent-deep',
  'bg-sky-500/15 text-sky-700',
  'bg-emerald-500/15 text-emerald-700',
]

export function TeamPage() {
  return (
    <main>
      <section className="bg-ink pt-32 pb-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="mb-3 text-xs font-semibold tracking-wide text-fg-muted uppercase">Company</p>
            <h1 className="max-w-2xl text-4xl font-semibold text-fg sm:text-5xl">
              Three founders, one DRDO-experienced mentor
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
              A small, deliberately cross-functional team split across AI/ML, hardware and flight
              operations, and government relations — backed by a mentor with active DRDO project
              experience.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={i * 60}>
                <div className="flex h-full flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
                  <div
                    className={`grid h-14 w-14 place-items-center rounded-xl font-display text-lg font-semibold ${
                      avatarTones[i % avatarTones.length]
                    }`}
                  >
                    {initials(member.name)}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-fg-on-paper">{member.name}</h3>
                  <p className="text-sm font-medium text-accent-deep">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-fg-on-paper-muted">{member.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper pb-20 sm:pb-28">
        <Reveal>
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 rounded-3xl border border-black/5 bg-white px-8 py-10 lg:flex-row lg:items-center lg:px-12 lg:py-12">
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold text-fg-on-paper sm:text-3xl">
                We're hiring across engineering, field ops, and policy
              </h3>
              <p className="mt-3 text-base leading-relaxed text-fg-on-paper-muted">
                If you'd rather be solving problems that touch real terrain than shipping another
                dashboard, we should talk.
              </p>
            </div>
            <a
              href="mailto:careers@shunnlabs.example"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
            >
              See open roles
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
