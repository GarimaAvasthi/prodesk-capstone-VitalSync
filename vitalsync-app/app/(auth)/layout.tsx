import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VitalSync - Account access",
  description: "Sign in, register, or recover access to your VitalSync healthcare workspace.",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}