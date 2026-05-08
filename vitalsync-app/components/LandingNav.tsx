"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { label: "Platform", href: "#platform" },
  { label: "Experience", href: "#experience" },
];

export default function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-4 z-40 mx-auto flex max-w-7xl items-center justify-between rounded-full border px-5 py-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "glass-panel border-[var(--line)]"
            : "border-transparent bg-white/55 backdrop-blur dark:bg-slate-950/30"
        }`}
      >
        <Link href="/" className="inline-flex items-center gap-3 text-[var(--foreground)] hover:opacity-80 transition-opacity">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-lg shadow-[var(--brand)]/30">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
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
          <Link prefetch={false} href="/login" className="app-button app-button-secondary px-5 py-2.5 text-sm">
            Sign in
          </Link>
          <Link prefetch={false} href="/signin" className="app-button app-button-primary px-5 py-2.5 text-sm">
            Start workspace
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--line)] md:hidden"
          onClick={() => setIsMenuOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
      </header>

      {isMenuOpen && (
        <div className="glass-panel mx-auto mt-4 flex max-w-7xl flex-col gap-3 rounded-3xl p-5 md:hidden">
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
    </>
  );
}
