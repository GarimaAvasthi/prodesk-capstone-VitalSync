"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { Activity, ClipboardList, Home, LayoutDashboard, LogOut, Users } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

const allItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Patient details", href: "/patient-details", icon: ClipboardList, role: "patient" as const },
  { label: "Operations", href: "/dashboard", icon: LayoutDashboard, role: "admin" as const },
  { label: "Care team", href: "/dashboard", icon: Users, role: "doctor" as const },
];

export default function DashboardSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();

  const navItems = allItems.filter((item) => !item.role || item.role === user?.role);

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    router.push("/login");
  };

  return (
    <aside className="section-shell sticky top-4 hidden h-[calc(100vh-2rem)] w-full max-w-[280px] shrink-0 rounded-3xl p-6 md:flex md:flex-col">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-all hover:bg-[var(--line)] group">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-lg shadow-[var(--brand)]/30 group-hover:scale-105 transition-transform">
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="display-title text-lg font-semibold text-[var(--foreground)]">VitalSync</p>
          <p className="text-xs text-[var(--muted)]">Unified care workspace</p>
        </div>
      </Link>

      {/* User Card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/10 border border-[var(--brand)]/30 p-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">Signed in as</p>
        <p className="text-lg font-bold text-[var(--foreground)]">{user?.name || "Guest user"}</p>
        <div className="inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
          {user?.role || "viewer"}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-8 flex flex-1 flex-col gap-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-[var(--brand-soft)] text-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                  : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]/60 dark:hover:bg-white/5"
              }`}
            >
              <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform ${isActive ? "text-[var(--brand)]" : ""}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        type="button"
        onClick={handleLogout}
        className="mt-6 flex items-center justify-center gap-2 rounded-xl border-1.5 border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}