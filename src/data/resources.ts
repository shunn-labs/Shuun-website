export interface Resource {
  category: string
  type: string
  readTime: string
  title: string
  href: string
  gradient: string
}

export const resources: Resource[] = [
  {
    category: 'Product philosophy',
    type: 'Article',
    readTime: '5 min read',
    title: 'Why sense-decide-act, not just detection',
    href: '#resources',
    gradient: 'from-amber-500/30 via-slate-800 to-slate-950',
  },
  {
    category: 'Field notes',
    type: 'Case study',
    readTime: '6 min read',
    title: 'Inside a flagship water-contamination detection mission',
    href: '#resources',
    gradient: 'from-sky-500/25 via-slate-800 to-slate-950',
  },
  {
    category: 'Engineering',
    type: 'Article',
    readTime: '7 min read',
    title: 'Onboard inference in under 500ms: engineering for the edge',
    href: '#resources',
    gradient: 'from-emerald-500/25 via-slate-800 to-slate-950',
  },
]
