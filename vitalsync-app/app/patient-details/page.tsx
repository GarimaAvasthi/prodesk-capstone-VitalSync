"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Droplets,
  HeartPulse,
  Pill,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";

const vitals = [
  { label: "Blood pressure", value: "118/72", note: "Target range", icon: HeartPulse },
  { label: "Oxygen saturation", value: "98%", note: "Stable", icon: Activity },
  { label: "Hydration", value: "2.1 L", note: "On track", icon: Droplets },
];

const timeline = [
  { title: "Cardiology follow-up", meta: "Today at 3:30 PM", detail: "Review medication response and activity tolerance." },
  { title: "Lab panel uploaded", meta: "Yesterday", detail: "Markers stayed within the expected range for the last 30 days." },
  { title: "Prescription renewal", meta: "In 2 days", detail: "Refill request is prepared and ready for clinician review." },
];

export default function PatientDetailsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, user]);

  if (!user || !isAuthenticated) return null;

  return (
    <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 space-y-6 animate-fade-up">
        <section className="section-shell rounded-[2rem] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to dashboard
              </button>
              <span className="eyebrow mt-5 block">Patient record</span>
              <h1 className="display-title mt-3 text-4xl text-balance sm:text-5xl">A clearer medical dossier for everyday care conversations.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                This page now prioritizes identity, recent health status, and what happens next so the record feels useful in motion instead of buried in styling.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="section-shell rounded-[2rem] p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[var(--foreground)] text-3xl font-bold text-white shadow-lg shadow-black/10">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold text-[var(--foreground)]">{user.name}</h2>
                <p className="text-sm text-[var(--muted)]">{user.email}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">Verified identity</span>
                  <span className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Role: {user.role || "patient"}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Blood type", "A+"],
                ["Age", "34 yrs"],
                ["Height", "172 cm"],
                ["Weight", "64 kg"],
              ].map(([label, value]) => (
                <div key={String(label)} className="metric-card">
                  <p className="text-sm text-[var(--muted)]">{label}</p>
                  <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-shell rounded-[2rem] p-6 sm:p-7">
            <span className="eyebrow">Risk and readiness</span>
            <div className="mt-5 space-y-3">
              <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-500/10">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-rose-600 dark:text-rose-200" />
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Allergy flag</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Penicillin sensitivity remains pinned high for safer prescribing.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--line)] bg-[color:var(--surface-strong)] p-4">
                <div className="flex items-start gap-3">
                  <Pill className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">Medication adherence</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">Current plan marked as consistent over the last two weeks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="section-shell rounded-[2rem] p-6 sm:p-7">
            <span className="eyebrow">Current vitals</span>
            <div className="mt-5 space-y-3">
              {vitals.map((vital) => (
                <article key={vital.label} className="rounded-[1.5rem] border border-[var(--line)] bg-[color:var(--surface-strong)] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
                        <vital.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--foreground)]">{vital.label}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{vital.note}</p>
                      </div>
                    </div>
                    <p className="text-xl font-semibold text-[var(--foreground)]">{vital.value}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="section-shell rounded-[2rem] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="eyebrow">Care timeline</span>
                <h2 className="mt-3 text-2xl font-semibold">What changed recently and what comes next</h2>
              </div>
              <div className="rounded-2xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
                <ClipboardCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {timeline.map((item, index) => (
                <article key={item.title} className="relative rounded-[1.5rem] border border-[var(--line)] bg-[color:var(--surface-strong)] p-4 pl-6">
                  {index !== timeline.length - 1 ? <div className="absolute left-[1.15rem] top-14 h-[calc(100%-2rem)] w-px bg-[var(--line)]" /> : null}
                  <div className="absolute left-4 top-6 h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="pl-4">
                      <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                    </div>
                    <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">{item.meta}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { icon: CalendarDays, title: "Next visit", body: "Cardiology follow-up is confirmed and pre-visit instructions are attached." },
            { icon: TimerReset, title: "Recent change", body: "Vitals returned to target range and the UI now makes that trend obvious at a glance." },
            { icon: ShieldCheck, title: "Record hygiene", body: "High-risk information is surfaced consistently instead of hidden deep in the page." },
          ].map((card) => (
            <article key={card.title} className="section-shell rounded-[1.75rem] p-5">
              <div className="inline-flex rounded-2xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{card.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}