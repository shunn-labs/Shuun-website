export interface Solution {
  title: string
  description: string
  href: string
  flagship?: boolean
}

export const solutions: Solution[] = [
  {
    title: 'Wildfire fuel reduction',
    description: 'Flag hazardous vegetation from the air, clear it on the ground, verify the corridor is safe.',
    href: '#solutions',
    flagship: true,
  },
  {
    title: 'Invasive species treatment',
    description: 'Spot-treat outbreaks precisely — no blanket spraying, no guesswork.',
    href: '#solutions',
  },
  {
    title: 'Utility corridor monitoring',
    description: 'Continuous aerial sweeps flag vegetation encroachment and equipment risk early.',
    href: '#solutions',
  },
  {
    title: 'Post-fire recovery',
    description: 'Map fuel regrowth and erosion risk before the next season starts.',
    href: '#solutions',
  },
  {
    title: 'Conservation monitoring',
    description: 'Track protected species and habitat health without adding foot traffic.',
    href: '#solutions',
  },
]
