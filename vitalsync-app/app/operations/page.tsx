"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Server, ShieldCheck, Zap } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import MobileNav from "@/components/MobileNav";
import PageLoader from "@/components/PageLoader";

const systemLogs = [
  { id: 1, message: "Nightly database backup completed successfully.", time: "02:00 AM", status: "success" },
  { id: 2, message: "High latency detected on patient API.", time: "08:45 AM", status: "warning" },
  { id: 3, message: "New doctor account provisioned.", time: "09:15 AM", status: "success" },
  { id: 4, message: "Security patch applied to all active nodes.", time: "11:30 AM", status: "success" },
];

export default function OperationsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== "admin")) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router, user]);

  if (!mounted || !user || user.role !== "admin") return <PageLoader />;

  return (
    <>
      <MobileNav />
      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 space-y-6 animate-fade-up">
          <section className="section-shell rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="eyebrow">Admin Operations</span>
                <h1 className="display-title mt-3 text-3xl sm:text-4xl text-balance">System Health & Infrastructure</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  Monitor active servers, api latency, and security patches across your network. 
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Server, title: "Server Status", value: "99.9%", subtitle: "Uptime across 12 nodes", color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { icon: Zap, title: "API Latency", value: "45ms", subtitle: "Average response time", color: "text-[var(--brand)]", bg: "bg-[var(--brand-soft)]" },
              { icon: ShieldCheck, title: "Security", value: "Optimal", subtitle: "All systems patched", color: "text-sky-500", bg: "bg-sky-500/10" },
            ].map((stat) => (
              <div key={stat.title} className="section-shell rounded-3xl p-6">
                <div className={`inline-flex rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[var(--muted)]">{stat.title}</h3>
                <p className="mt-1 text-3xl font-extrabold text-[var(--foreground)]">{stat.value}</p>
                <p className="mt-2 text-xs font-medium text-[var(--muted)]">{stat.subtitle}</p>
              </div>
            ))}
          </section>

          <section className="section-shell rounded-3xl p-6 sm:p-8">
            <span className="eyebrow">Audit Log</span>
            <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)]">Recent System Activity</h3>
            
            <div className="mt-6 divide-y divide-[var(--line)]">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 py-4">
                  {log.status === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--foreground)]">{log.message}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
