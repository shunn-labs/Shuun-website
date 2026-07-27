import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { ArrowRightIcon } from './icons/Icons'

interface FeatureSectionProps {
  id?: string
  eyebrow: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
  art: ReactNode
  reverse?: boolean
  tone?: 'light' | 'dark'
}

export function FeatureSection({
  id,
  eyebrow,
  title,
  body,
  ctaLabel,
  ctaHref,
  art,
  reverse = false,
  tone = 'light',
}: FeatureSectionProps) {
  const isDark = tone === 'dark'

  return (
    <section
      id={id}
      className={`${isDark ? 'bg-surface' : 'bg-paper'} py-20 sm:py-28`}
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-16 lg:px-8 ${
          reverse ? 'lg:[&>*:first-child]:order-2' : ''
        }`}
      >
        <Reveal>
          <div
            className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl ${
              isDark ? 'bg-ink' : 'bg-white'
            } ring-1 ${isDark ? 'ring-white/10' : 'ring-black/5'}`}
          >
            <div
              className={`absolute inset-0 ${
                isDark
                  ? 'bg-[radial-gradient(circle_at_30%_20%,rgba(244,196,48,0.12),transparent_60%)]'
                  : 'bg-[radial-gradient(circle_at_30%_20%,rgba(11,13,19,0.06),transparent_60%)]'
              }`}
            />
            <div className={`relative w-2/3 ${isDark ? 'text-accent' : 'text-fg-on-paper'}`}>{art}</div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <p
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-accent' : 'text-fg-on-paper-muted'
            }`}
          >
            {eyebrow}
          </p>
          <h2 className={`text-3xl font-semibold sm:text-4xl ${isDark ? 'text-fg' : 'text-fg-on-paper'}`}>
            {title}
          </h2>
          <p className={`mt-5 max-w-lg text-base leading-relaxed ${isDark ? 'text-fg-muted' : 'text-fg-on-paper-muted'}`}>
            {body}
          </p>
          <a
            href={ctaHref}
            className={`group mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-transform hover:scale-[1.03] ${
              isDark ? 'bg-accent text-accent-ink hover:bg-accent-strong' : 'bg-fg-on-paper text-paper hover:bg-black'
            }`}
          >
            {ctaLabel}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
