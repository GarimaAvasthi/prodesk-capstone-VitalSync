import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VitalSync - Care operations that feel calm and clear",
  description:
    "VitalSync is a modern healthcare workspace for patients, clinicians, and operations teams to manage appointments, records, and day-to-day care with confidence.",
  keywords: ["healthcare", "patient dashboard", "hospital management", "appointments"],
};

import AIChatbot from "@/components/AIChatbot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="min-h-screen text-[15px] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          {children}
          <AIChatbot />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                fontFamily: "var(--font-manrope), sans-serif",
                fontSize: "14px",
                borderRadius: "16px",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}