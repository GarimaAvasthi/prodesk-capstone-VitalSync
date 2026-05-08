import Link from "next/link";
import dynamic from "next/dynamic";
import LandingNav from "@/components/LandingNav";

const metrics = [
  { label: "Patient wait time", value: "-31%" },
  { label: "Daily care visibility", value: "24/7" },
  { label: "Teams onboarded", value: "120+" },
];

import LandingSections from "@/components/LandingSections";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <LandingNav />

      <main className="mx-auto max-w-7xl">
        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <div
            className="space-y-10"
          >
            <div className="space-y-6">
              <span className="eyebrow">Streamlined healthcare operations</span>
              <h1 className="display-title max-w-3xl text-5xl leading-[1.1] text-balance sm:text-6xl lg:text-7xl">
                A healthcare workspace that feels steady.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted)]">
                VitalSync brings appointments, patient context, and care coordination all at one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <p className="text-2xl font-extrabold text-[var(--foreground)]">{metric.value}</p>
                  <p className="mt-2 text-sm font-medium text-[var(--muted)]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative animate-fade-up"
          >
            <div className="section-shell relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-400/10" />
              <div className="grid gap-5 sm:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-2xl bg-gradient-to-br from-[#0d1f18] via-[#123229] to-[#164d3b] p-7 text-white shadow-2xl shadow-emerald-950/20">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-emerald-100/70">Live care pulse</p>
                      <p className="display-title mt-3 text-3xl">Stable + visible</p>
                    </div>
                    <div className="animate-float rounded-2xl bg-white/10 p-3 flex-shrink-0">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-emerald-200"
                      >
                        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2V9a2 2 0 0 0 -2 -2h-6l-2 -2H5a2 2 0 0 0 -2 2z" />
                        <path d="M12 10v4" />
                        <path d="M10 12h4" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-7 rounded-2xl bg-white/8 p-5">
                    <div className="flex items-center justify-between text-sm text-white/70 font-medium">
                      <span>Care plan completion</span>
                      <span>84%</span>
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-emerald-300 to-cyan-200 transition-all duration-500" />
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/70">Clear handoffs, fewer delayed follow-ups, and visibility across patient touchpoints.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="metric-card rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[var(--muted)]">Today</p>
                        <p className="mt-2 text-3xl font-extrabold">142</p>
                      </div>
                      <div className="rounded-xl bg-[var(--brand-soft)] p-3 text-[var(--brand)] flex-shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4.8 2.3A.3.3 0 1 0 5 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 1.8-1.7z" />
                          <path d="M10 13h4" />
                          <path d="M12 11v4" />
                        </svg>
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Appointments coordinated across clinics and remote consults.</p>
                  </div>
                  <div className="metric-card rounded-2xl p-6">
                    <p className="text-sm font-medium text-[var(--muted)]">Patient confidence</p>
                    <p className="mt-3 text-base leading-6 font-medium text-[var(--foreground)]">Recovery instructions, booking details, and alerts all land in one calm place.</p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors cursor-pointer">
                      Explore patient UX
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <LandingSections />

      </main>
    </div>
  );
}