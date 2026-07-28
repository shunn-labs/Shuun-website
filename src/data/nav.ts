export interface NavLink {
  label: string
  description?: string
  href: string
}

export interface NavItem {
  label: string
  href: string
  columns?: NavLink[][]
}

export const navItems: NavItem[] = [
  {
    label: 'Platform',
    href: '#sense',
    columns: [
      [
        { label: 'Sensing', description: 'Multispectral, thermal, and RGB capture, synced per frame', href: '#sense' },
        { label: 'Decision layer', description: 'Real-time anomaly scoring, confidence-gated', href: '#decide' },
        { label: 'Action layer', description: 'Autonomous re-route within a geofence, manual override always on', href: '#act' },
      ],
      [
        { label: 'Orchestration OS', description: 'One dashboard for every mission, in flight or on the ground', href: '#pulse' },
        { label: 'Mission audit log', description: 'Every detection and action, logged and versioned', href: '#pulse' },
        { label: 'All of the platform', description: 'See the full sense-decide-act loop', href: '#sense' },
      ],
    ],
  },
  {
    label: 'Solutions',
    href: '#solutions',
    columns: [
      [
        { label: 'Water & vegetation monitoring', description: 'The flagship use case — contamination and change detection', href: '#solutions' },
        { label: 'Border & defense security', description: 'Dual-use monitoring, in step with our DRDO/iDEX engagement', href: '#solutions' },
        { label: 'Infrastructure & mining inspection', description: 'Private revenue independent of government payment cycles', href: '#solutions' },
      ],
      [
        { label: 'Disaster management & logistics', description: 'Flood, fire, and landslide monitoring for government agencies', href: '#solutions' },
        { label: 'Ground robotics platform', description: 'The second physical form factor for the same AI stack', href: '#solutions' },
        { label: 'All solutions', description: 'Explore every sector', href: '#solutions' },
      ],
    ],
  },
  { label: 'Sectors', href: '#industries' },
  { label: 'Company', href: '/team' },
  { label: 'Resources', href: '#resources' },
]
