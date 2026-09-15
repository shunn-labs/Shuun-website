export interface TeamMember {
  name: string
  role: string
  focus: string
  /** Omitted where we have no photo — the card falls back to an initial. */
  photo?: string
}

export const team: TeamMember[] = [
  { name: 'Somnath Halder', role: 'Founder & CEO', focus: 'Electronics & Robotics', photo: '/team/somnath.jpg' },
  { name: 'Manish Kumar', role: 'Co-Founder & COO', focus: 'Business Management', photo: '/team/manish.jpg' },
  { name: 'Aryan', role: 'Co-Founder & CTO', focus: 'AI & Software', photo: '/team/aryan.jpeg' },
]
