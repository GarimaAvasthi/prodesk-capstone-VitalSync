"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthShell from "@/components/AuthShell";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!auth) throw new Error("Firebase not initialized");
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch role and profile from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      let role: "patient" | "doctor" | "admin" = "patient";
      let name = userCredential.user.displayName || email.split("@")[0];

      if (userDoc.exists()) {
        const data = userDoc.data();
        role = (data.role as "patient" | "doctor" | "admin") || "patient";
        name = data.name || name;
      } else {
        // Fallback for legacy users without a Firestore doc
        const inferredRole = email.includes("admin") ? "admin" : email.includes("doctor") ? "doctor" : "patient";
        role = inferredRole as "patient" | "doctor" | "admin";
      }

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        name,
        role,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";

      if (code === "auth/user-not-found" || code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setError("No account found with those credentials. Check your email and password, or create a new account.");
      } else if (code === "auth/invalid-email") {
        setError("That email address doesn't look valid. Please double-check it.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait a few minutes before trying again.");
      } else if (code === "auth/user-disabled") {
        setError("This account has been disabled. Please contact support.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/Password sign-in is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError(`Sign-in failed (${code || "unknown error"}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to review schedules, patient context, and the latest care updates from one focused workspace."
      eyebrow="Account access"
      showSidePanel={false}
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signin" className="font-semibold text-[var(--brand)] hover:underline">
            Create new account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--foreground)]">Email address</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@vitalsync.com"
              className="app-input pl-11"
              required
              autoComplete="off"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[var(--foreground)]">Password</span>
            <Link href="/forgot-password" className="text-sm font-semibold text-[var(--brand)] hover:underline">
              Forgot it?
            </Link>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="app-input pl-11"
              required
            />
          </div>
        </label>

        <AnimatePresence>
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200"
            >
              {error}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <button type="submit" disabled={loading} className="app-button app-button-primary w-full py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Signing you in..." : "Open workspace"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}