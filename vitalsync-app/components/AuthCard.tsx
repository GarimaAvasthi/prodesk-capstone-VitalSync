"use client";

import React from "react";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText?: string;
  footerLinkHref?: string;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthCardProps) {
  return (
    <div className="relative w-full max-w-md mx-auto animate-fade-scale">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--brand)] rounded-3xl blur-xl opacity-15 transition duration-1000" />

      <div className="relative glass-panel rounded-2xl p-8 md:p-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--brand)]/30 transition-transform hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <div>
            <span className="display-title text-lg font-bold text-[var(--foreground)] tracking-tight">
              Vital<span className="text-[var(--brand)]">Sync</span>
            </span>
            <p className="text-xs text-[var(--muted)]">Unified care workspace</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[var(--line)] via-[var(--brand)]/20 to-[var(--line)] mb-8" />

        {/* Header */}
        <div className="mb-8">
          <h1 className="display-title text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-2 leading-tight">{title}</h1>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{subtitle}</p>
        </div>

        {/* Form content */}
        <div className="space-y-5">
          {children}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-[var(--line)] via-[var(--brand)]/20 to-[var(--line)] my-8" />

        {/* Footer */}
        <p className="text-center text-sm text-[var(--muted)]">
          {footerText}{" "}
          {footerLinkText && footerLinkHref && (
            <Link
              href={footerLinkHref}
              className="text-[var(--brand)] hover:text-[var(--brand-strong)] font-semibold transition-colors duration-200"
            >
              {footerLinkText}
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
