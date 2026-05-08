import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VitalSync - Patient Details",
};

export const dynamic = "force-dynamic";

export default function PatientDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
