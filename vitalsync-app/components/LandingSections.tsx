const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
    ),
    title: "Cleaner scheduling",
    body: "Coordinate visits, follow-ups, and internal handoffs without the usual spreadsheet archaeology.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
    ),
    title: "Vitals at a glance",
    body: "Turn scattered measurements into a calm, readable story clinicians and patients can act on.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
    ),
    title: "Trust-first workflows",
    body: "Clear permissions, safer context, and less guesswork when sensitive health data moves between teams.",
  },
];

const roleCards = [
  {
    title: "Patients",
    detail: "See upcoming care, medical history, and reset paths that do not feel like a punishment.",
    color: "from-emerald-400/30 to-transparent",
  },
  {
    title: "Clinicians",
    detail: "Work from a unified dashboard that highlights action, risk, and progress for better patient outcomes.",
    color: "from-sky-400/30 to-transparent",
  },
  {
    title: "Operations",
    detail: "Track utilization, staffing, and throughput with a shared language across the whole organization.",
    color: "from-amber-300/30 to-transparent",
  },
];

export default function LandingSections() {
  return (
    <>
      <section id="platform" className="py-8 sm:py-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Platform focus</span>
            <h2 className="display-title mt-4 text-3xl sm:text-4xl">Designed for clarity across the whole care loop.</h2>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="section-shell rounded-2xl p-7 card-interactive">
              <div className="mb-6 inline-flex rounded-xl bg-[var(--brand-soft)] p-4 text-[var(--brand)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">{feature.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="grid gap-4 py-8 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="section-shell rounded-3xl p-8">
          <span className="eyebrow">Platform fundamentals</span>
          <h2 className="display-title mt-4 text-3xl text-balance">Built for clarity and clinical momentum.</h2>
          <p className="mt-5 leading-8 text-[var(--muted)]">
            Every interface is designed with a readable hierarchy and meaningful contrast, ensuring care teams stay focused on what matters most.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {roleCards.map((card) => (
            <article key={card.title} className="section-shell relative overflow-hidden rounded-2xl p-7 card-interactive">
              <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${card.color}`} />
              <div className="relative">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{card.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{card.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
