"use client";

import React from "react";

interface ChartShellProps {
  title: string;
  eyebrow: string;
  description?: string;
  children: React.ReactNode;
  badge?: string;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export default function ChartShell({
  title,
  eyebrow,
  description,
  children,
  badge = "Live",
  isEmpty = false,
  emptyMessage = "No data available yet.",
}: ChartShellProps) {
  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="eyebrow">{eyebrow}</span>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
          )}
        </div>
        {badge && (
          <span className="flex-shrink-0 rounded-full bg-[var(--brand-soft)] px-4 py-1.5 text-xs font-semibold text-[var(--brand)]">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-8 h-64 w-full">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-strong)]">
            <p className="text-sm text-[var(--muted)]">{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
