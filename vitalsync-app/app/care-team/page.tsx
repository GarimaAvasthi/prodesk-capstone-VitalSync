"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import DashboardSidebar from "@/components/DashboardSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";
import MobileNav from "@/components/MobileNav";
import PageLoader from "@/components/PageLoader";

const StaffCRUD = dynamic(() => import("@/components/StaffCRUD"), { ssr: false });
const StaffDeptChart = dynamic(() => import("@/components/StaffDeptChart"), { ssr: false });

export default function CareTeamPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== "doctor")) {
      router.push("/dashboard");
    }
  }, [mounted, isAuthenticated, router, user]);

  if (!mounted || !user || user.role !== "doctor") return <PageLoader />;

  return (
    <>
      <MobileNav />
      <div className="mx-auto flex max-w-[1600px] gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <DashboardSidebar />

        <main className="min-w-0 flex-1 space-y-6 animate-fade-up">
          <section className="section-shell rounded-[2rem] p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="eyebrow">Doctor Workspace</span>
                <h1 className="display-title mt-3 text-3xl sm:text-4xl text-balance">Care Team Management</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                  Coordinate with your fellow clinicians, manage staff shifts, and review department distributions.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <StaffCRUD />
            <StaffDeptChart />
          </section>
        </main>
      </div>
    </>
  );
}
