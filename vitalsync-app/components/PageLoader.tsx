"use client";

import { Activity } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)]">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-[var(--brand)]/20" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] text-white shadow-xl shadow-[var(--brand)]/30">
          <Activity className="h-8 w-8 animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-sm font-semibold tracking-wide text-[var(--muted)] animate-pulse">
        Loading workspace...
      </p>
    </div>
  );
}
