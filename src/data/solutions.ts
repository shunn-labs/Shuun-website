export interface Solution {
  title: string
  description: string
  href: string
  flagship?: boolean
}

export const solutions: Solution[] = [
  {
    title: 'Water & vegetation anomaly detection',
    description: 'Flag water-body contamination and vegetation change from the air — the flagship use case proving the full sense-decide-act loop.',
    href: '#solutions',
    flagship: true,
  },
  {
    title: 'Border & defense security monitoring',
    description: 'The same detection model re-targeted to border-area vegetation and water monitoring, in step with our DRDO/iDEX engagement.',
    href: '#solutions',
  },
  {
    title: 'Infrastructure & mining inspection',
    description: 'Ventilation, slope stability, and pipeline or powerline monitoring — a private revenue engine independent of government payment cycles.',
    href: '#solutions',
  },
  {
    title: 'Disaster management & logistics',
    description: 'Flood, fire, and landslide monitoring for government disaster-management authorities, extending toward autonomous last-mile logistics.',
    href: '#solutions',
  },
  {
    title: 'Ground robotics platform expansion',
    description: 'Agricultural rovers and inspection crawlers as the second physical form factor for the same core AI stack.',
    href: '#solutions',
  },
]
