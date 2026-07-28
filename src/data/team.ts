export interface TeamMember {
  name: string
  role: string
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Founder Name',
    role: 'Founder & CEO — AI/ML',
    bio: 'Owns model training and fine-tuning (YOLOv11, SAM2, Anomalib), dataset quality, and detection-accuracy iteration.',
  },
  {
    name: 'Founder Name',
    role: 'Co-founder — Hardware & Flight Ops',
    bio: 'Drone integration, Jetson edge deployment, MAVSDK autonomous re-route logic, and DGCA flight compliance.',
  },
  {
    name: 'Founder Name',
    role: 'Co-founder — Business & Government Relations',
    bio: 'DRDO/iDEX liaison, pilot customer outreach, and the demo narrative and reporting our government and enterprise buyers need.',
  },
  {
    name: 'Mentor Name',
    role: 'Advisor — DRDO & Dual-Use Programs',
    bio: 'DRDO-experienced mentor guiding the TDF/iDEX pathway and reviewing export-control and dual-use compliance from day one.',
  },
  {
    name: 'Developer Name',
    role: 'ML / Computer Vision Engineer',
    bio: 'Fine-tunes and iterates the perception models against flagged false positives and negatives from every pilot flight.',
  },
  {
    name: 'Developer Name',
    role: 'Backend & Platform Engineer',
    bio: 'Builds the FastAPI backend, PostGIS-backed database, and the dashboard that turns detections into an actionable report.',
  },
]
