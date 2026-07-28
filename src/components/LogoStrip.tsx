const partners = [
  'DRDO / iDEX Innovation Programs',
  'Agri-Input & FPO Networks',
  'State Disaster Management Authorities',
  'Infrastructure & Mining Operators',
  'Border Security & Defense Agencies',
  'Conservation & Environment Programs',
]

export function LogoStrip() {
  const items = [...partners, ...partners]

  return (
    <section className="border-y border-white/5 bg-ink py-10">
      <p className="mx-auto mb-6 max-w-7xl px-5 text-center text-xs font-medium tracking-wide text-fg-muted uppercase lg:px-8">
        Built for organizations across environment, defense, and infrastructure
      </p>
      <div
        className="group relative mx-auto max-w-7xl overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="flex w-max animate-marquee gap-16 group-hover:[animation-play-state:paused]">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-display text-lg font-medium text-fg-muted/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
