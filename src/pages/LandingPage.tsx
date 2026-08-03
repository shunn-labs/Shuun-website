import { ContactSection } from '../components/ContactSection'
import { Hero } from '../components/Hero'
import { ProblemSection } from '../components/ProblemSection'
import { SolutionSection } from '../components/SolutionSection'
import { TeamSection } from '../components/TeamSection'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function LandingPage() {
  useDocumentTitle()

  return (
    <main>
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <TeamSection />
      <ContactSection />
    </main>
  )
}
