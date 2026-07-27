import { resources } from '../data/resources'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function ResourcesSection() {
  return (
    <section id="resources" className="bg-ink py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold text-fg sm:text-4xl">From the lab</h2>
            <a href="#resources" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
              View all resources
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {resources.map((resource, i) => (
            <Reveal key={resource.title} delay={i * 80}>
              <a href={resource.href} className="group block">
                <div
                  className={`aspect-[16/10] rounded-2xl bg-gradient-to-br ${resource.gradient} ring-1 ring-white/10 transition-transform group-hover:scale-[1.02]`}
                />
                <span className="mt-4 inline-block rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-fg-muted">
                  {resource.category}
                </span>
                <p className="mt-3 text-lg leading-snug font-semibold text-fg group-hover:text-accent">
                  {resource.title}
                </p>
                <p className="mt-2 text-xs text-fg-muted">
                  {resource.type} · {resource.readTime}
                </p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
