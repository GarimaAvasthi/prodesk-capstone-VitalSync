"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Lock, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import AuthShell from "@/components/AuthShell";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

type Role = "patient" | "doctor" | "admin";

const roles: { id: Role; label: string; icon: typeof UserRound; description: string }[] = [
  { id: "patient", label: "Patient", icon: UserRound, description: "Track care plans and records." },
  { id: "doctor", label: "Doctor", icon: Stethoscope, description: "Review visits and patient context." },
  { id: "admin", label: "Admin", icon: ShieldCheck, description: "Coordinate operations and staffing." },
];

export default function SignInPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("patient");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleCreateAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase not initialized");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        name,
        role,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code ?? "";

      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists. Try signing in instead.");
      } else if (code === "auth/invalid-email") {
        setError("That email address doesn't look valid. Please double-check it.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters long.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many attempts. Please wait a moment before trying again.");
      } else if (code === "auth/operation-not-allowed") {
        setError("Email/Password sign-in is not enabled in Firebase. Go to Firebase Console → Authentication → Sign-in method → Enable Email/Password.");
      } else if (code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
      } else {
        setError(`Account creation failed (${code || "unknown error"}). Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      description="Pick the role that fits your workflow and we'll drop you into the refreshed VitalSync experience."
      eyebrow="New workspace"
      footer={
        <>
          Already have access?{" "}
          <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">
            Sign in instead
          </Link>
        </>
      }
      showSidePanel={false}
    >
      <form onSubmit={handleCreateAccount} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRole(option.id)}
              className={`rounded-[1.25rem] border p-4 text-left transition ${
                role === option.id
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm"
                  : "border-[var(--line)] bg-[color:var(--surface-strong)] hover:border-[color:var(--brand)]/40"
              }`}
            >
              <option.icon className="mb-3 h-5 w-5 text-[var(--brand)]" />
              <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{option.description}</p>
            </button>
          ))}
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold text-[var(--foreground)]">Full name</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Jordan Lee"
            className="app-input"
            required
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Email address</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@vitalsync.com"
                className="app-input pl-11"
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="app-input pl-11"
                required
              />
            </div>
          </label>
        </div>

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
          {loading ? "Creating account..." : "Enter VitalSync"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}