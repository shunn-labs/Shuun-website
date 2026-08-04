import { DeckGate } from '../components/DeckGate'
import { Reveal } from '../components/Reveal'
import { ArrowRightIcon } from '../components/icons/Icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const DECK_URL = '/shunn-labs-pitch-deck.pdf'

// Rendered from the PDF at build-prep time. Shown as images rather than an
// embedded PDF because mobile browsers routinely refuse to render one inline,
// leaving an empty frame where the deck should be.
const DECK_SLIDES = Array.from(
  { length: 11 },
  (_, i) => `/deck/slide-${String(i + 1).padStart(2, '0')}.jpg`,
)

export function InvestPage() {
  useDocumentTitle('Invest — Shunn Labs')

  return (
    <main>
      <section className="bg-ink pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-wide text-accent uppercase">
              Raising our seed round
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-fg sm:text-5xl">
              Invest in Shunn Labs
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-muted">
              The deck and a demo of the system in the field. If it looks like a fit, write to us
              and we&apos;ll take it from there.
            </p>
            <a
              href="mailto:000shuun@gmail.com?subject=Investing%20in%20Shunn%20Labs"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition-transform hover:scale-[1.03] hover:bg-accent-strong"
            >
              Talk to us
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-fg sm:text-3xl">Demo</h2>
            <p className="mt-3 text-base leading-relaxed text-fg-muted">
              Drone flight and live detection, tested in the field.
            </p>
            <video
              className="mt-8 w-full rounded-2xl border border-white/10 bg-surface"
              controls
              playsInline
              preload="metadata"
              poster="/videos/demo-detection-poster.jpg"
            >
              <source src="/videos/demo-detection.mp4" type="video/mp4" />
              Your browser can&apos;t play this video.{' '}
              <a href="/videos/demo-detection.mp4">Download it instead.</a>
            </video>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-semibold text-fg-on-paper sm:text-3xl">Pitch deck</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-fg-on-paper-muted">
              Problem, solution, market, traction and team — 11 slides.
            </p>
          </Reveal>

          {/* Deliberately outside Reveal: it reveals on 15% of the element
              being in view, and 15% of a column of eleven slides never is —
              the whole deck would sit at opacity 0 forever. */}
          <DeckGate>
            <div className="mt-8 flex justify-end">
              <a
                href={DECK_URL}
                download
                className="group inline-flex items-center gap-2 rounded-full bg-fg-on-paper px-6 py-3 text-sm font-semibold text-paper transition-transform hover:scale-[1.03]"
              >
                Download PDF
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>

            <ol className="mt-6 space-y-6">
              {DECK_SLIDES.map((src, i) => (
                <li key={src}>
                  <img
                    src={src}
                    alt={`Pitch deck slide ${i + 1} of ${DECK_SLIDES.length}`}
                    width={1600}
                    height={900}
                    // The first slide is near the fold on a laptop; the rest
                    // should not cost anyone bandwidth until they scroll.
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full rounded-2xl border border-black/10 bg-white shadow-sm"
                  />
                </li>
              ))}
            </ol>
          </DeckGate>
        </div>
      </section>
    </main>
  )
}
