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
    title: "Why we didn't build our own robot",
    href: '#resources',
    gradient: 'from-amber-500/30 via-slate-800 to-slate-950',
  },
  {
    category: 'Field notes',
    type: 'Case study',
    readTime: '6 min read',
    title: 'Inside a closed-loop wildfire fuel-reduction mission',
    href: '#resources',
    gradient: 'from-sky-500/25 via-slate-800 to-slate-950',
  },
  {
    category: 'Engineering',
    type: 'Article',
    readTime: '7 min read',
    title: "Confidence-gated detection: teaching the system to say 'not sure'",
    href: '#resources',
    gradient: 'from-emerald-500/25 via-slate-800 to-slate-950',
  },
]
