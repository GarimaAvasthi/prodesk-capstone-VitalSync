"use client";

import { useEffect } from "react";
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
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import PatientCRUD from "@/components/PatientCRUD";
import AnalyticsChart from "@/components/AnalyticsChart";
import TaskCRUD from "@/components/TaskCRUD";
import TaskStatsChart from "@/components/TaskStatsChart";
import StaffCRUD from "@/components/StaffCRUD";
import StaffDeptChart from "@/components/StaffDeptChart";

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

  useEffect(() => {
    if (!isAuthenticated || !user) router.push("/login");
  }, [isAuthenticated, router, user]);

  if (!user || !isAuthenticated) return null;

  return (
    <div className="mx-auto flex max-w-400 gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 space-y-5">
        {/* ── Top bar ─────────────────────────────────────────────────────── */}
        <section className="section-shell flex flex-col gap-4 rounded-3xl p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <span className="eyebrow">{user.role || "care"} workspace</span>
            <h1 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">
              Good to see you, {user.name.split(" ")[0]}.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-(--muted)">
              Welcome to your command center. Review today&apos;s priorities, manage assigned tasks, and track operational health across your workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-65 items-center gap-3 rounded-full border border-(--line) bg-(--surface-strong) px-5 py-3.5 transition-all hover:border-(--brand)/50">
              <Search className="h-5 w-5 text-(--muted)" />
              <input
                type="text"
                placeholder="Search records, labs, visits..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-(--muted) font-medium"
              />
            </div>
            <ThemeToggle />
          </div>
        </section>

        {/* ── Role views ──────────────────────────────────────────────────── */}
        {user.role === "patient" ? <PatientCenter /> : null}
        {user.role === "doctor"  ? <DoctorCenter />  : null}
        {user.role === "admin"   ? <AdminCenter />   : null}
      </main>
    </div>
  );
}

// ── Patient ───────────────────────────────────────────────────────────────────
function PatientCenter() {
  return (
    <div className="space-y-5 animate-fade-up">
      {/* Row 1 — health snapshot + safety notes */}
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="section-shell rounded-3xl p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="eyebrow">Patient snapshot</span>
              <h2 className="display-title mt-4 text-3xl sm:text-4xl leading-tight">
                Your day, distilled into the next best actions.
              </h2>
            </div>
            <div className="rounded-2xl bg-(--brand-soft) p-4 text-(--brand) shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {patientMetrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <div className={`inline-flex rounded-2xl p-3.5 ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-medium text-(--muted)">{metric.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-(--foreground)">
                  {metric.value}
                  <span className="ml-2 text-xs font-semibold text-(--muted)">{metric.unit}</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-3xl p-5 sm:p-6">
          <span className="eyebrow">Safety notes</span>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-amber-600 dark:text-amber-200 shrink-0" />
                <div>
                  <p className="font-semibold text-(--foreground)">Allergy alert</p>
                  <p className="mt-1.5 text-sm leading-6 text-(--muted)">Review active allergies before next consultation.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-(--line) bg-(--surface-strong) p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-(--brand) shrink-0" />
                <div>
                  <p className="font-semibold text-(--foreground)">Coverage active</p>
                  <p className="mt-1.5 text-sm leading-6 text-(--muted)">Primary plan verified for upcoming appointments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Row 2 — biometric trend + task list */}
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-shell rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="eyebrow">Trend monitor</span>
              <h3 className="mt-3 text-2xl font-semibold text-(--foreground)">Biometric rhythm</h3>
            </div>
            <div className="rounded-full bg-(--brand-soft) px-4 py-2 text-xs font-semibold text-(--brand) shrink-0">
              Stable range
            </div>
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrends}>
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0f9f7a" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#0f9f7a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(93,115,104,0.18)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#7b8c84", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid rgba(16,35,28,0.08)",
                    boxShadow: "0 18px 45px -28px rgba(12,46,33,0.45)",
                  }}
                />
                <Area type="monotone" dataKey="heart" stroke="#0f9f7a" strokeWidth={3} fill="url(#heartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <TaskCRUD />
      </section>

      {/* Row 3 — task progress chart (real data) */}
      <section>
        <TaskStatsChart />
      </section>
    </div>
  );
}

// ── Doctor ────────────────────────────────────────────────────────────────────
function DoctorCenter() {
  const panels = [
    { label: "Patients today", value: "28", note: "4 follow-ups need a chart review",       icon: Users },
    { label: "Average wait",   value: "11m", note: "Down from 18m last week",                icon: Clock3 },
    { label: "Telehealth",     value: "9",   note: "All sessions have prep notes attached",  icon: Stethoscope },
    { label: "Urgent flags",   value: "2",   note: "Both already routed to triage",          icon: Zap },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <section className="section-shell rounded-3xl p-5 sm:p-6">
        <span className="eyebrow">Doctor workspace</span>
        <h2 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">
          A centralized command center for patient flow.
        </h2>
      </section>

      {/* Stat panels */}
      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {panels.map((panel) => (
          <article key={panel.label} className="section-shell rounded-2xl p-6 card-interactive">
            <div className="inline-flex rounded-2xl bg-(--brand-soft) p-3.5 text-(--brand)">
              <panel.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-medium text-(--muted)">{panel.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-(--foreground)">{panel.value}</p>
            <p className="mt-4 text-sm leading-6 text-(--muted)">{panel.note}</p>
          </article>
        ))}
      </section>

      {/* Patient CRUD + Admissions chart (real data) */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <PatientCRUD />
        <AnalyticsChart />
      </section>

      {/* Care Team Management */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <StaffCRUD />
        <StaffDeptChart />
      </section>
    </div>
  );
}

// ── Admin ─────────────────────────────────────────────────────────────────────
function AdminCenter() {
  const stats = [
    { label: "Active clinics",        value: "12",  icon: ShieldCheck },
    { label: "Daily appointments",    value: "442", icon: CalendarDays },
    { label: "Care staff onboarded",  value: "18",  icon: UserPlus },
    { label: "Patient satisfaction",  value: "96%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-5 animate-fade-up">
      <section className="section-shell rounded-3xl p-5 sm:p-6">
        <span className="eyebrow">Operations workspace</span>
        <h2 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">
          Comprehensive overview of your system health.
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-(--muted)">
          Monitor and analyze daily operational signals, facility throughput, and staffing capacity across the entire network.
        </p>
      </section>

      {/* Stat panels */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="section-shell rounded-2xl p-6 card-interactive">
            <div className="inline-flex rounded-2xl bg-(--brand-soft) p-3.5 text-(--brand)">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-medium text-(--muted)">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-(--foreground)">{stat.value}</p>
          </article>
        ))}
      </section>

      {/* Staff CRUD + Staff Department chart (real data) */}
      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <StaffCRUD />
        <StaffDeptChart />
      </section>
    </div>
  );
}