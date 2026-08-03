import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-16 bg-paper py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide text-fg-on-paper-muted uppercase">
            Contact us
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold text-fg-on-paper sm:text-4xl">
            Tell us about the land you need monitored.
          </h2>
          <a
            href="mailto:000shuun@gmail.com"
            className="group mt-9 inline-flex items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
          >
            000shuun@gmail.com
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
