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

const healthTrends = [
  { time: "08:00", heart: 68, glucose: 92 },
  { time: "10:00", heart: 72, glucose: 98 },
  { time: "12:00", heart: 78, glucose: 103 },
  { time: "14:00", heart: 74, glucose: 99 },
  { time: "16:00", heart: 69, glucose: 94 },
  { time: "18:00", heart: 76, glucose: 101 },
  { time: "20:00", heart: 71, glucose: 96 },
];

const patientMetrics = [
  { label: "Heart rate", value: "72", unit: "bpm", icon: HeartPulse, tone: "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-200" },
  { label: "Hydration", value: "2.1", unit: "L", icon: Droplets, tone: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-200" },
  { label: "Activity", value: "94", unit: "%", icon: Activity, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200" },
  { label: "Sleep", value: "7.8", unit: "hrs", icon: Clock3, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-200" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
    }
  }, [isAuthenticated, router, user]);

  if (!user || !isAuthenticated) return null;

  return (
    <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <DashboardSidebar />

      <main className="min-w-0 flex-1 space-y-8">
        <section className="section-shell flex flex-col gap-6 rounded-3xl p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <span className="eyebrow">{user.role || "care"} workspace</span>
            <h1 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">Good to see you, {user.name.split(" ")[0]}.</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
              The dashboard now surfaces today&apos;s priorities first, keeps supporting details nearby, and uses one consistent visual system across each role.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-[260px] items-center gap-3 rounded-full border-1.5 border-[var(--line)] bg-[color:var(--surface-strong)] px-5 py-3.5 transition-all hover:border-[var(--brand)]/50">
              <Search className="h-5 w-5 text-[var(--muted)]" />
              <input
                type="text"
                placeholder="Search records, labs, visits..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[color:var(--muted)] font-medium"
              />
            </div>
            <ThemeToggle />
          </div>
        </section>

        {user.role === "patient" ? <PatientCenter /> : null}
        {user.role === "doctor" ? <DoctorCenter /> : null}
        {user.role === "admin" ? <AdminCenter /> : null}
      </main>
    </div>
  );
}

function PatientCenter() {
  const careList = [
    { title: "Follow-up with Dr. Rivera", meta: "Today, 3:30 PM", status: "Confirmed" },
    { title: "Blood pressure review", meta: "Tomorrow, 9:00 AM", status: "Prep needed" },
    { title: "Medication renewal", meta: "Due in 2 days", status: "Ready" },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="eyebrow">Patient snapshot</span>
              <h2 className="display-title mt-4 text-3xl sm:text-4xl leading-tight">Your day, distilled into the next best actions.</h2>
            </div>
            <div className="rounded-2xl bg-[var(--brand-soft)] p-4 text-[var(--brand)] flex-shrink-0">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {patientMetrics.map((metric) => (
              <article key={metric.label} className="metric-card">
                <div className={`inline-flex rounded-2xl p-3.5 ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm font-medium text-[var(--muted)]">{metric.label}</p>
                <p className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">
                  {metric.value}
                  <span className="ml-2 text-xs font-semibold text-[var(--muted)]">{metric.unit}</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Safety notes</span>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-1 h-5 w-5 text-amber-600 dark:text-amber-200 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Allergy alert</p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">Penicillin listed on file. Providers now see this high in the flow.</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[var(--brand)] flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--foreground)]">Coverage active</p>
                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">Primary plan verified for upcoming appointments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <span className="eyebrow">Trend monitor</span>
              <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Biometric rhythm</h3>
            </div>
            <div className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-xs font-semibold text-[var(--brand)] flex-shrink-0">Stable range</div>
          </div>
          <div className="mt-8 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthTrends}>
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f9f7a" stopOpacity={0.32} />
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

        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Coming up</span>
          <div className="mt-6 space-y-3">
            {careList.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] p-5 transition-all hover:bg-[var(--line)] group card-interactive">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-1.5 text-sm text-[var(--muted)]">{item.meta}</p>
                  </div>
                  <span className="rounded-full bg-[var(--brand-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--brand)] flex-shrink-0">{item.status}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DoctorCenter() {
  const panels = [
    { label: "Patients today", value: "28", note: "4 follow-ups need a chart review", icon: Users },
    { label: "Average wait", value: "11m", note: "Down from 18m last week", icon: Clock3 },
    { label: "Telehealth", value: "9", note: "All sessions have prep notes attached", icon: Stethoscope },
    { label: "Urgent flags", value: "2", note: "Both already routed to triage", icon: Zap },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="section-shell rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">Doctor workspace</span>
        <h2 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">A cleaner command center for patient flow.</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">We reduced the theatrical styling and shifted emphasis to operational awareness: queue health, visit prep, and what needs attention next.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
        {panels.map((panel) => (
          <article key={panel.label} className="section-shell rounded-2xl p-6 card-interactive">
            <div className="inline-flex rounded-2xl bg-[var(--brand-soft)] p-3.5 text-[var(--brand)]">
              <panel.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-medium text-[var(--muted)]">{panel.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">{panel.value}</p>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{panel.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Schedule lens</span>
          <div className="mt-6 space-y-3">
            {[
              ["09:00 AM", "Cardiology consult", "Room 4"],
              ["11:30 AM", "Post-op review", "Telehealth"],
              ["02:15 PM", "Medication check-in", "Room 2"],
            ].map(([time, visit, room]) => (
              <div key={time} className="flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] px-5 py-4 card-interactive">
                <div>
                  <p className="font-semibold text-[var(--foreground)]">{visit}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{room}</p>
                </div>
                <div className="rounded-full bg-[var(--brand-soft)] px-3.5 py-1.5 text-xs font-semibold text-[var(--brand)] flex-shrink-0">{time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Clinical prep</span>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "Recent lab deltas pinned near each appointment.",
              "Medication conflicts surfaced before visits start.",
              "Patient communications grouped by encounter.",
              "Chart notes easier to scan on smaller laptops.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] p-5 text-sm leading-6 text-[var(--muted)] card-interactive">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminCenter() {
  const stats = [
    { label: "Active clinics", value: "12", icon: ShieldCheck },
    { label: "Daily appointments", value: "442", icon: CalendarDays },
    { label: "Care staff onboarded", value: "18", icon: UserPlus },
    { label: "Patient satisfaction", value: "96%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <section className="section-shell rounded-3xl p-6 sm:p-8">
        <span className="eyebrow">Operations workspace</span>
        <h2 className="display-title mt-4 text-4xl text-balance sm:text-5xl leading-tight">System health without the usual dashboard clutter.</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">The admin view now emphasizes operational signals, throughput, and staffing movement instead of decorative overload.</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="section-shell rounded-2xl p-6 card-interactive">
            <div className="inline-flex rounded-2xl bg-[var(--brand-soft)] p-3.5 text-[var(--brand)]">
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-medium text-[var(--muted)]">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-[var(--foreground)]">{stat.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Operational notes</span>
          <div className="mt-6 space-y-3">
            {[
              "Morning wait time improved after redistributing two check-in staff.",
              "Referral backlog is down 14% after reordering intake tasks in the queue.",
              "Mobile readability improved for coordinators working between stations.",
            ].map((note) => (
              <div key={note} className="rounded-2xl border border-[var(--line)] bg-[color:var(--surface-strong)] p-5 text-sm leading-6 text-[var(--muted)]">
                {note}
              </div>
            ))}
          </div>
        </div>

        <div className="section-shell rounded-3xl p-6 sm:p-8">
          <span className="eyebrow">Capacity mix</span>
          <div className="mt-6 space-y-5">
            {[
              ["Beds in use", 76],
              ["Telehealth coverage", 64],
              ["Discharge throughput", 88],
            ].map(([label, percent]) => (
              <div key={String(label)}>
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--foreground)]">{label}</span>
                  <span className="text-[var(--muted)]">{percent}%</span>
                </div>
                <div className="h-3 rounded-full bg-black/5 dark:bg-white/8 overflow-hidden">
                  <div className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}