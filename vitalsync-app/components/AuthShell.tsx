"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import ThemeToggle from "@/components/ThemeToggle";

interface AuthShellProps {
  title: string;
  description: string;
  eyebrow: string;
  children: ReactNode;
  footer?: ReactNode;
  sideTitle?: string;
  sideDescription?: string;
  highlights?: string[];
  accent?: "mint" | "navy";
  showSidePanel?: boolean;
}

export default function AuthShell({
  title,
  description,
  eyebrow,
  children,
  footer,
  sideTitle,
  sideDescription,
  highlights,
  accent = "mint",
  showSidePanel = true,
}: AuthShellProps) {
  const isMint = accent === "mint";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6rem] top-[-5rem] h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl dark:bg-emerald-500/15" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-80 w-80 rounded-full bg-sky-300/25 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between pb-5">
        <Link href="/" className="inline-flex items-center gap-3 rounded-full px-1 py-1 text-sm font-semibold text-[var(--foreground)]">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-lg shadow-[var(--brand)]/30">
            <Activity className="h-5 w-5" />
          </span>
          <span>
            <span className="display-title block text-lg font-semibold">VitalSync</span>
            <span className="block text-xs text-[var(--muted)]">Care operations hub</span>
          </span>
        </Link>
        <ThemeToggle />
      </div>

      <div className={clsx(
        "relative mx-auto min-h-[calc(100vh-5.5rem)] max-w-7xl gap-6",
        showSidePanel ? "grid lg:grid-cols-[1.08fr_0.92fr]" : "flex items-center justify-center"
      )}>
        {showSidePanel && (
          <section
            className={clsx(
              "section-shell relative overflow-hidden rounded-3xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10",
              isMint ? "bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 text-white" : "bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white",
            )}
          >
            <div className="absolute inset-0 opacity-80">
              <div className="absolute right-[-3rem] top-[-2rem] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-[-4rem] left-[-2rem] h-72 w-72 rounded-full bg-emerald-300/10 blur-3xl" />
            </div>

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div className="space-y-8">
                <span className="eyebrow text-emerald-200">{eyebrow}</span>
                <div className="max-w-xl space-y-5">
                  <h1 className="display-title text-4xl leading-tight text-balance sm:text-5xl lg:text-6xl">{sideTitle}</h1>
                  <p className="max-w-lg text-base leading-7 text-white/72 sm:text-lg">{sideDescription}</p>
                </div>

                {highlights && highlights.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((highlight) => (
                      <div key={highlight} className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-sm">
                        <CheckCircle2 className="mb-3 h-5 w-5 text-emerald-300" />
                        <p className="text-sm font-medium text-white/86">{highlight}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-5 backdrop-blur-sm">
                <p className="text-sm text-white/70">Need a faster sandbox path while exploring?</p>
                <Link href="/dashboard" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-emerald-200">
                  Open the demo dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className={clsx(
          "section-shell flex rounded-3xl px-6 py-8 sm:px-8 lg:px-10 lg:py-10",
          !showSidePanel && "w-full max-w-lg"
        )}>
          <div className="m-auto w-full max-w-lg space-y-8">
            <div className="space-y-3">
              <span className="eyebrow">{eyebrow}</span>
              <h2 className="display-title text-3xl text-balance sm:text-4xl">{title}</h2>
              <p className="max-w-md text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p>
            </div>

            {children}

            {footer && (
              <div className="border-t border-[var(--line)] pt-5 text-sm text-[var(--muted)]">{footer}</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}