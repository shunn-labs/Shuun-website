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
    href: '#detect',
    columns: [
      [
        { label: 'Aerial detection', description: 'Multispectral and thermal scans that flag risk', href: '#detect' },
        { label: 'Human approval', description: 'A person confirms every action before it happens', href: '#approve' },
        { label: 'Ground execution', description: 'Robots act on unstructured terrain, any conditions', href: '#execute' },
      ],
      [
        { label: 'Orchestration OS', description: 'One dashboard for every mission, in flight or on the ground', href: '#pulse' },
        { label: 'Mission audit log', description: 'Every detection and action, logged for review', href: '#pulse' },
        { label: 'All of the platform', description: 'See the full detect-to-verify loop', href: '#detect' },
      ],
    ],
  },
  {
    label: 'Solutions',
    href: '#solutions',
    columns: [
      [
        { label: 'Wildfire fuel reduction', description: 'Flag hazardous fuel load, clear it, verify the corridor', href: '#solutions' },
        { label: 'Invasive species treatment', description: 'Spot-treat outbreaks instead of blanket spraying', href: '#solutions' },
        { label: 'Utility corridor monitoring', description: 'Continuous sweeps for encroachment and equipment risk', href: '#solutions' },
      ],
      [
        { label: 'Post-fire recovery', description: 'Map regrowth and erosion risk before the next season', href: '#solutions' },
        { label: 'Conservation monitoring', description: 'Track habitat health without adding foot traffic', href: '#solutions' },
        { label: 'All solutions', description: 'Explore every use case', href: '#solutions' },
      ],
    ],
  },
  { label: 'Industries', href: '#industries' },
  { label: 'Company', href: '/team' },
  { label: 'Resources', href: '#resources' },
]
