export interface TeamMember {
  name: string
  role: string
  /** Omitted where we have no photo — the card falls back to an initial. */
  photo?: string
}

export const team: TeamMember[] = [
  { name: 'Somnath Halder', role: 'Founder & CEO', photo: '/team/somnath.jpg' },
  { name: 'Manish Kumar', role: 'Co-Founder & COO', photo: '/team/manish.jpg' },
  { name: 'Aryan', role: 'Co-Founder & CTO' },
  { name: 'Sancheeta', role: 'Intern', photo: '/team/sancheeta.jpg' },
]
