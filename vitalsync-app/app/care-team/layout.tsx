import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VitalSync - Care Team",
};

export const dynamic = "force-dynamic";

export default function CareTeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
