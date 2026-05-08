"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const AIChatbot = dynamic(() => import("@/components/AIChatbot"), {
  ssr: false,
});

export default function LazyAIChatbot() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  
  const isPublicPage = ["/", "/login", "/signin", "/register", "/forgot-password"].includes(pathname);
  
  if (isPublicPage || !isAuthenticated) return null;

  return <AIChatbot />;
}
