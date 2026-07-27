import { CTABanner } from '../components/CTABanner'
import { ContactBanner } from '../components/ContactBanner'
import { FeatureSection } from '../components/FeatureSection'
import { Hero } from '../components/Hero'
import { LogoStrip } from '../components/LogoStrip'
import { PulseSection } from '../components/PulseSection'
import { ResourcesSection } from '../components/ResourcesSection'
import { SolutionsGrid } from '../components/SolutionsGrid'
import { ApprovalArt, QuadrupedArt, ScanArt } from '../components/art/RobotArt'

export function LandingPage() {
  return (
    <main>
      <Hero />
      <LogoStrip />

      <FeatureSection
        id="detect"
        eyebrow="Detect"
        title="Flag the risk before it becomes a hazard"
        body="A drone sweep combines multispectral, thermal, and visual sensing to flag hazardous fuel load, invasive growth, or equipment risk. When the system isn't confident, it says so and routes the flag to a person instead of guessing."
        ctaLabel="See detection in action"
        ctaHref="#pulse"
        art={<ScanArt className="h-full w-full" />}
      />

      <FeatureSection
        id="approve"
        eyebrow="Approve"
        title="Nothing moves without a person confirming it"
        body="Every flagged task lands in the ops dashboard with the sensor evidence attached. A person reviews it and approves the action before any robot is dispatched — the same loop we'd want if it were our own backyard."
        ctaLabel="See the approval workflow"
        ctaHref="#pulse"
        art={<ApprovalArt className="h-full w-full" />}
        reverse
        tone="dark"
      />

      <FeatureSection
        id="execute"
        eyebrow="Execute"
        title="Ground robots built for terrain, not warehouses"
        body="Once approved, a ground robot navigates unstructured terrain — slopes, rubble, dense brush — to carry out the task with a modular payload: cutter, sprayer, or gripper, matched to the job."
        ctaLabel="See ground execution"
        ctaHref="#pulse"
        art={<QuadrupedArt className="h-full w-full" />}
      />

      <SolutionsGrid />
      <PulseSection />
      <ResourcesSection />
      <CTABanner />
      <ContactBanner />
    </main>
  )
}
