import type { ReactNode } from 'react'

interface SectionHeadingProps {
  id?: string
  eyebrow: string
  title: string
  /** Status pills / counts, right-aligned on wide screens. */
  meta?: ReactNode
  actions?: ReactNode
}

export function SectionHeading({ id, eyebrow, title, meta, actions }: SectionHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <p className="mb-1 text-xs font-semibold tracking-wide text-accent uppercase">{eyebrow}</p>
        <h2 id={id} className="text-xl font-semibold text-fg sm:text-2xl">
          {title}
        </h2>
      </div>
      {(meta || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {meta}
          {actions}
        </div>
      )}
    </div>
  )
}
