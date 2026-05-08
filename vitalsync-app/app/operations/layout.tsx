import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VitalSync - Operations",
};

export const dynamic = "force-dynamic";

export default function OperationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
