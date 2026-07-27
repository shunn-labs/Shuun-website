export interface TeamMember {
  name: string
  role: string
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Mara Bishop',
    role: 'Founder & CEO',
    bio: 'Spent five years building autonomy stacks for commercial drones before starting Shunn Labs.',
  },
  {
    name: 'Devon Achebe',
    role: 'Co-founder & Head of Perception',
    bio: 'Computer vision researcher turned engineer; built the confidence-gated detection models behind every mission.',
  },
  {
    name: 'Priya Kellerman',
    role: 'Head of Field Operations',
    bio: 'Third-generation wildland firefighter — makes sure what we build survives contact with an actual forest.',
  },
  {
    name: 'Sam Okafor',
    role: 'Robotics Engineering Lead',
    bio: 'Mechanical and controls engineer integrating ground robot platforms and modular payload hardware.',
  },
  {
    name: 'Elena Vasquez',
    role: 'Regulatory & Policy Lead',
    bio: 'Former FAA BVLOS program advisor — keeps every mission inside the lines until the lines move.',
  },
  {
    name: 'Jordan Lin',
    role: 'Partnerships Lead',
    bio: 'Works directly with utilities, fire districts, and government agencies piloting the platform.',
  },
]
