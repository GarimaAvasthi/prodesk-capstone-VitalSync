"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  Menu,
  ShieldCheck,
  Stethoscope,
  Workflow,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Experience", href: "#experience" },
];

const metrics = [
  { label: "Patient wait time", value: "-31%" },
  { label: "Daily care visibility", value: "24/7" },
  { label: "Teams onboarded", value: "120+" },
];

const features = [
  {
    icon: CalendarDays,
    title: "Cleaner scheduling",
    body: "Coordinate visits, follow-ups, and internal handoffs without the usual spreadsheet archaeology.",
  },
  {
    icon: HeartPulse,
    title: "Vitals at a glance",
    body: "Turn scattered measurements into a calm, readable story clinicians and patients can act on.",
  },
  {
    icon: ShieldCheck,
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

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <header
        className={`sticky top-4 z-40 mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "glass-panel border-[var(--line)]"
            : "border-transparent bg-white/55 backdrop-blur dark:bg-slate-950/30"
        }`}
      >
        <Link href="/" className="inline-flex items-center gap-3 text-[var(--foreground)] hover:opacity-80 transition-opacity">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-lg shadow-[var(--brand)]/30">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="display-title text-lg font-semibold">VitalSync</p>
            <p className="text-xs text-[var(--muted)]">Calm systems for active care</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href="/login" className="app-button app-button-secondary px-5 py-2.5 text-sm">
            Sign in
          </Link>
          <Link href="/signin" className="app-button app-button-primary px-5 py-2.5 text-sm">
            Start workspace
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--line)] md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="glass-panel mx-auto mt-4 flex max-w-7xl flex-col gap-3 rounded-3xl p-5 md:hidden animate-fade-scale">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="rounded-xl px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--line)]">
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex flex-col gap-3 border-t border-[var(--line)] pt-4">
            <ThemeToggle />
            <div className="flex gap-2">
              <Link href="/login" className="app-button app-button-secondary flex-1 px-4 py-3 text-sm justify-center">Sign in</Link>
              <Link href="/signin" className="app-button app-button-primary flex-1 px-4 py-3 text-sm justify-center">Start</Link>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl">
        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-8 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
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
                      <Workflow className="h-6 w-6 text-emerald-200" />
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
                        <Stethoscope className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-5 text-sm leading-6 text-[var(--muted)]">Appointments coordinated across clinics and remote consults.</p>
                  </div>
                  <div className="metric-card rounded-2xl p-6">
                    <p className="text-sm font-medium text-[var(--muted)]">Patient confidence</p>
                    <p className="mt-3 text-base leading-6 font-medium text-[var(--foreground)]">Recovery instructions, booking details, and alerts all land in one calm place.</p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--brand-strong)] transition-colors cursor-pointer">
                      Explore patient UX
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

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
                  <feature.icon className="h-6 w-6" />
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

      </main>
    </div>
  );
}