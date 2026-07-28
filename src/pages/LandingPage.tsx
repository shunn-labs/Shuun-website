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
        id="sense"
        eyebrow="Sense"
        title="Multimodal sensing, built for real-time decisions"
        body="Every flight synchronizes RGB, multispectral, and thermal capture, geotagged and timestamped per frame. Inference runs onboard, at the edge — no live cloud connection required, because field connectivity in rural and border areas can't be assumed."
        ctaLabel="See the sensing stack"
        ctaHref="#pulse"
        art={<ScanArt className="h-full w-full" />}
      />

      <FeatureSection
        id="decide"
        eyebrow="Decide"
        title="Every detection is scored, not guessed"
        body="Real-time anomaly and change-detection models flag water contamination, vegetation change, or equipment risk with a confidence score. Every flagged detection is geotagged, logged, and queued — for autonomous investigation or human review, depending on the mission's risk profile."
        ctaLabel="See the decision layer"
        ctaHref="#pulse"
        art={<ApprovalArt className="h-full w-full" />}
        reverse
        tone="dark"
      />

      <FeatureSection
        id="act"
        eyebrow="Act"
        title="The sense-decide-act loop, closed autonomously"
        body="On a flagged detection, the system inserts a revisit waypoint and re-routes to capture closer-range evidence — always inside an operator-defined geofence, with manual override that interrupts any autonomous action within one second. It's the same core loop and AI stack we're extending from environment monitoring today toward ground robots as a second physical form factor."
        ctaLabel="See the action loop"
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
