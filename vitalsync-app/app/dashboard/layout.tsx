import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VitalSync - Dashboard",
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
