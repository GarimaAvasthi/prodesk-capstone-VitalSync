"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Clock3,
  Droplets,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardSidebar from "@/components/DashboardSidebar";
import MobileNav from "@/components/MobileNav";
import ThemeToggle from "@/components/ThemeToggle";
import AIChatbot from "@/components/AIChatbot";
import { useAuthStore } from "@/store/authStore";
import PatientCRUD from "@/components/PatientCRUD";
import AnalyticsChart from "@/components/AnalyticsChart";
import TaskCRUD from "@/components/TaskCRUD";
import TaskStatsChart from "@/components/TaskStatsChart";
import AdminUserDirectory from "@/components/AdminUserDirectory";
import PatientHealthTracker from "@/components/PatientHealthTracker";
import PageLoader from "@/components/PageLoader";

// ── Static vitals data (patient biometric demo) ──────────────────────────────
const healthTrends = [
  { time: "08:00", heart: 68 },
  { time: "10:00", heart: 72 },
  { time: "12:00", heart: 78 },
  { time: "14:00", heart: 74 },
  { time: "16:00", heart: 69 },
  { time: "18:00", heart: 76 },
  { time: "20:00", heart: 71 },
];

const patientMetrics = [
  { label: "Heart rate", value: "72",  unit: "bpm", icon: HeartPulse, tone: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200" },
  { label: "Hydration",  value: "2.1", unit: "L",   icon: Droplets,   tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-200" },
  { label: "Activity",   value: "94",  unit: "%",   icon: Activity,   tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" },
  { label: "Sleep",      value: "7.8", unit: "hrs", icon: Clock3,     tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200" },
];

// ── Root dashboard page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router, user]);

  if (!mounted || !user || !isAuthenticated) return <PageLoader />;

  return (
    <>
      {/* Mobile navigation header (hamburger) */}
      <MobileNav />

      <div className="mx-auto flex w-full max-w-[1600px] gap-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-8 lg:py-6">
        {/* Desktop sidebar — hidden on mobile */}
        <DashboardSidebar />

        <main className="min-w-0 flex-1 space-y-4">
          {/* ── Top bar ─────────────────────────────────────────────────────── */}
          <section className="section-shell flex flex-col gap-4 rounded-2xl p-4 sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 min-w-0">
              <span className="eyebrow">{user.role || "care"} workspace</span>
              <h1 className="display-title mt-3 text-2xl text-balance sm:text-4xl lg:text-5xl leading-tight">
                Good to see you, {user.name.split(" ")[0]}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
                Welcome to your command center. Review today&apos;s priorities, manage assigned tasks, and track operational health across your workspace.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 transition-all hover:border-[var(--brand)]/50 sm:min-w-[260px] sm:flex-none">
                <Search className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                <input
                  type="text"
                  placeholder="Search records..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted)] font-medium"
                />
              </div>
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>
          </section>

          {/* ── Role views ──────────────────────────────────────────────────── */}
          {user.role === "patient" ? <PatientCenter /> : null}
          {user.role === "doctor"  ? <DoctorCenter />  : null}
          {user.role === "admin"   ? <AdminCenter />   : null}
        </main>
      </div>
    </>
  );
}

// ── Patient ───────────────────────────────────────────────────────────────────
function PatientCenter() {
  return (
    <div className="space-y-4 animate-fade-up">
      {/* Real-time editable chronic disease metrics */}
      <PatientHealthTracker />

      {/* Row 2 — biometric trend + task list */}
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-shell rounded-2xl p-4 sm:rounded-3xl sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="eyebrow">Trend monitor</span>
              <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">Vital Sign Trends</h3>
            </div>
            <div className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)] shrink-0">
              Stable range
            </div>
          </div>
          <div className="mt-5 h-52 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrends}>
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0f9f7a" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#0f9f7a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(93,115,104,0.18)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#7b8c84", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(16,35,28,0.08)",
                    boxShadow: "0 18px 45px -28px rgba(12,46,33,0.45)",
                    fontSize: 13,
                  }}
                />
                <Area type="monotone" dataKey="heart" stroke="#0f9f7a" strokeWidth={3} fill="url(#heartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <TaskCRUD />
      </section>

      {/* Row 3 — task progress chart */}
      <section>
        <TaskStatsChart />
      </section>
    </div>
  );
}

// ── Doctor ────────────────────────────────────────────────────────────────────
function DoctorCenter() {
  const panels = [
    { label: "Patients today", value: "28", note: "4 follow-ups need a chart review",      icon: Users },
    { label: "Average wait",   value: "11m", note: "Down from 18m last week",               icon: Clock3 },
    { label: "Telehealth",     value: "9",   note: "All sessions have prep notes attached", icon: Stethoscope },
    { label: "Urgent flags",   value: "2",   note: "Both already routed to triage",         icon: Zap },
  ];

  return (
    <div className="space-y-4 animate-fade-up">
      <section className="section-shell rounded-2xl p-4 sm:rounded-3xl sm:p-6">
        <span className="eyebrow">Doctor workspace</span>
        <h2 className="display-title mt-3 text-2xl text-balance sm:text-4xl leading-tight">
          A centralized command center for patient flow.
        </h2>
      </section>

      {/* Stat panels */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {panels.map((panel) => (
          <article key={panel.label} className="section-shell rounded-2xl p-4 sm:p-6 card-interactive">
            <div className="inline-flex rounded-xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
              <panel.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="mt-3 text-xs font-medium text-[var(--muted)] sm:mt-5 sm:text-sm">{panel.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--foreground)] sm:mt-2 sm:text-3xl">{panel.value}</p>
            <p className="mt-2 hidden text-xs leading-5 text-[var(--muted)] sm:mt-4 sm:block sm:text-sm sm:leading-6">{panel.note}</p>
          </article>
        ))}
      </section>

      {/* Patient CRUD + Admissions chart (real data) */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <PatientCRUD />
        <AnalyticsChart />
      </section>
    </div>
  );
}

// ── Admin ─────────────────────────────────────────────────────────────────────
function AdminCenter() {
  const stats = [
    { label: "Active clinics",       value: "12",  icon: ShieldCheck },
    { label: "Daily appointments",   value: "442", icon: CalendarDays },
    { label: "Care staff onboarded", value: "18",  icon: UserPlus },
    { label: "Patient satisfaction", value: "96%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-4 animate-fade-up">
      <section className="section-shell rounded-2xl p-4 sm:rounded-3xl sm:p-6">
        <span className="eyebrow">Operations workspace</span>
        <h2 className="display-title mt-3 text-2xl text-balance sm:text-4xl leading-tight">
          Comprehensive overview of your system health.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base sm:leading-8">
          Monitor and analyze daily operational signals, facility throughput, and staffing capacity across the entire network.
        </p>
      </section>

      {/* Stat panels */}
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="section-shell rounded-2xl p-4 sm:p-6 card-interactive">
            <div className="inline-flex rounded-xl bg-[var(--brand-soft)] p-3 text-[var(--brand)]">
              <stat.icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="mt-3 text-xs font-medium text-[var(--muted)] sm:mt-5 sm:text-sm">{stat.label}</p>
            <p className="mt-1 text-2xl font-extrabold text-[var(--foreground)] sm:mt-2 sm:text-3xl">{stat.value}</p>
          </article>
        ))}
      </section>

      {/* Global User Directory */}
      <section>
        <AdminUserDirectory />
      </section>
    </div>
  );
}