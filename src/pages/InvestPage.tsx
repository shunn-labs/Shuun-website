import { Reveal } from "../components/Reveal";
import { ArrowRightIcon } from "../components/icons/Icons";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export function InvestPage() {
  useDocumentTitle("Invest — Shunn Labs");

  return (
    <main className="bg-paper">
      <section className="relative overflow-hidden bg-paper pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
              Raising our pre-seed round
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] font-semibold text-fg-on-paper">
              Invest in Shunn Labs
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-on-paper-muted">
              We&apos;re building Project Punarvan — autonomous robotics and AI
              for reforestation. Two forest departments have already issued
              letters of intent. If it looks like a fit, write to us.
            </p>
            <a
              href="mailto:000shuun@gmail.com?subject=Investing%20in%20Shunn%20Labs"
              className="group mt-9 inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 text-sm font-semibold text-leaf-ink transition-colors hover:bg-leaf-strong"
            >
              Talk to us
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.18em] text-leaf uppercase">
              Demo
            </p>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold text-fg-on-paper sm:text-4xl">
              Early steps.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-on-paper-muted">
              Early footage from our work so far: prototype experiments, vision
              models tested on captured frames, and a first dashboard. None of it
              is the finished system — Project Punarvan is still being built.
            </p>
            <video
              className="mt-10 w-full rounded-3xl border border-fg-on-paper/10 bg-[#050807] shadow-[0_40px_80px_-40px_rgba(11,20,16,0.45)]"
              controls
              playsInline
              preload="metadata"
              poster="/videos/demo-detection-poster.jpg"
            >
              <source src="/videos/demo-detection.mp4" type="video/mp4" />
              Your browser can&apos;t play this video.{" "}
              <a href="/videos/demo-detection.mp4">Download it instead.</a>
            </video>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
