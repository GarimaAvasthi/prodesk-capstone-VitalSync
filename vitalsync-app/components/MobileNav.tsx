"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  Activity,
  ClipboardList,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";

const allItems = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Patient details", href: "/patient-details", icon: ClipboardList, role: "patient" as const },
  { label: "Operations", href: "/dashboard", icon: LayoutDashboard, role: "admin" as const },
  { label: "Care team", href: "/dashboard", icon: Users, role: "doctor" as const },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useAuthStore();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const [isOpen, setIsOpen] = useState(false);

  const navItems = allItems.filter((item) => !item.role || item.role === user?.role);

  const handleLogout = async () => {
    await signOut(auth);
    clearUser();
    router.push("/login");
  };

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile header bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-strong)]/90 px-4 py-3 backdrop-blur-xl md:hidden">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-md shadow-[var(--brand)]/30 group-hover:scale-105 transition-transform">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-base font-bold text-[var(--foreground)] tracking-tight">VitalSync</span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-all hover:bg-[var(--line)]"
          >
            {theme === "light" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] transition-all hover:bg-[var(--line)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-[var(--surface-strong)] p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-md">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-[var(--foreground)]">VitalSync</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] text-[var(--muted)] hover:bg-[var(--line)] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User card */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--accent)]/10 border border-[var(--brand)]/30 p-4 space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand)]">Signed in as</p>
          <p className="text-base font-bold text-[var(--foreground)]">{user?.name || "Guest user"}</p>
          <div className="inline-flex rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[var(--brand)]">
            {user?.role || "viewer"}
          </div>
        </div>

        {/* Nav items */}
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => navigate(item.href)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--brand-soft)] text-[var(--brand)] shadow-md shadow-[var(--brand)]/20"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--line)]/60"
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--muted)] transition-all duration-200 hover:border-[var(--danger)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );
}
