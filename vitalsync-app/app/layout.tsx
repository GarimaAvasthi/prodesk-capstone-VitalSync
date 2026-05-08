import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import DeferredAppComponents from "@/components/DeferredAppComponents";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "optional",
});

export const viewport = {
  themeColor: "#0f9f7a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "VitalSync - Care operations that feel calm and clear",
  description:
    "VitalSync is a modern healthcare workspace for patients, clinicians, and operations teams to manage appointments, records, and day-to-day care with confidence.",
  keywords: ["healthcare", "patient dashboard", "hospital management", "appointments"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('vitalsync-theme');
                  const supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  let themeToApply = theme;
                  if (!themeToApply && supportDarkMode) themeToApply = '{"state":{"theme":"dark"}}';
                  if (themeToApply) {
                    const parsed = JSON.parse(themeToApply);
                    if (parsed.state.theme === 'dark') {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-screen text-[15px] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          {children}
          <DeferredAppComponents />
        </ThemeProvider>
      </body>
    </html>
  );
}