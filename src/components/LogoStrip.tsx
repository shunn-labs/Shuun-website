const partners = [
  'Cascade Grid Cooperative',
  'Pinehaven Fire District',
  'Sierra Conservation Trust',
  'Redwood Mutual Insurance',
  'Ashford Land Stewardship Council',
  'Continental Pipeline Partners',
]

export function LogoStrip() {
  const items = [...partners, ...partners]

  return (
    <section className="border-y border-white/5 bg-ink py-10">
      <p className="mx-auto mb-6 max-w-7xl px-5 text-center text-xs font-medium tracking-wide text-fg-muted uppercase lg:px-8">
        Piloting with teams managing wildfire and environmental risk
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
