import { DeckGate } from '../components/DeckGate'
import { Reveal } from '../components/Reveal'
import { ArrowRightIcon } from '../components/icons/Icons'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const DECK_URL = '/shuun-labs-pitch-deck.pdf'

// Rendered from the PDF at build-prep time. Shown as images rather than an
// embedded PDF because mobile browsers routinely refuse to render one inline,
// leaving an empty frame where the deck should be.
const DECK_SLIDES = Array.from(
  { length: 14 },
  (_, i) => `/deck/slide-${String(i + 1).padStart(2, '0')}.jpg`,
)

export function InvestPage() {
  useDocumentTitle('Invest — Shuun Labs')

  return (
    <main className="bg-paper">
      <section className="relative overflow-hidden bg-paper pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
              Raising our seed round
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-fg-on-paper">
              Invest in Shuun Labs
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-on-paper-muted">
              The deck, and footage of what we have built so far. If it looks like a fit,
              write to us and we&apos;ll take it from there.
            </p>
            <a
              href="mailto:000shuun@gmail.com?subject=Investing%20in%20Shuun%20Labs"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong"
            >
              Talk to us
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
              01 — Demo
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-fg-on-paper sm:text-4xl">
              Where we are today.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-on-paper-muted">
              Our own footage of the drone we fly, the vision models running on captured
              frames, and the dashboard behind them. It is progress on the stack, not a
              deployed end-to-end system — the closed loop in the film is what we are
              building toward.
            </p>
            <video
              className="mt-10 w-full rounded-3xl border border-fg-on-paper/10 bg-[#050807] shadow-[0_40px_80px_-40px_rgba(11,20,16,0.45)]"
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

      <section className="border-t border-fg-on-paper/8 bg-paper-dim/60 py-24 sm:py-28">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
              02 — Pitch deck
            </p>
            <h2 className="mt-5 text-3xl font-semibold text-fg-on-paper sm:text-4xl">
              Problem, solution, market, traction and team.
            </h2>
            <p className="mt-4 font-mono text-[11px] tracking-wide text-fg-on-paper-muted uppercase">
              14 slides
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
                className="group inline-flex items-center gap-2 rounded-full border border-fg-on-paper/15 px-6 py-3 text-sm font-semibold text-fg-on-paper transition-colors hover:border-fg-on-paper/35 hover:bg-fg-on-paper/5"
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
                    className="w-full rounded-2xl border border-fg-on-paper/10 bg-paper-raised shadow-sm"
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
