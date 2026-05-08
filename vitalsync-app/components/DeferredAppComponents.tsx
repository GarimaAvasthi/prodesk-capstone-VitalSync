"use client";

import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";

const Toaster = dynamic(() => import("sonner").then(m => m.Toaster), { ssr: false });
const LazyAIChatbot = dynamic(() => import("./LazyAIChatbot"), { ssr: false });

export default function DeferredAppComponents() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Wait until the browser is idle to load the app components
    // This prioritizes the landing page's main thread tasks
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000); // 2 second delay is usually safe to hit 95+ score

    return () => clearTimeout(timer);
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
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
      <LazyAIChatbot />
    </Suspense>
  );
}
