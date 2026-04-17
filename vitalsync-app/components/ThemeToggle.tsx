"use client";

import { Moon, SunMedium } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[color:var(--surface)] text-[var(--foreground)] shadow-sm backdrop-blur transition hover:-translate-y-0.5"
    >
      {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <SunMedium className="h-4.5 w-4.5" />}
    </button>
  );
}