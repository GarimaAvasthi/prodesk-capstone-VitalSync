"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import AuthShell from "@/components/AuthShell";
import { auth } from "@/lib/firebase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!email.trim()) {
      setError("Please enter the email tied to your account.");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      const code = typeof err === "object" && err && "code" in err ? String(err.code) : "";

      if (code === "auth/user-not-found") {
        setError("We could not find an account with that email.");
      } else if (code === "auth/invalid-email") {
        setError("That email address does not look valid.");
      } else {
        setError("We could not send the reset link right now. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset your password"
      description="Enter the email address linked to your account and we'll send you a secure link to set a new password."
      eyebrow="Password recovery"
      sideTitle="Back in your workspace in less than a minute."
      sideDescription="We'll email you a one-time reset link. Open it, choose a new password, and you're back in — no support ticket needed."
      highlights={[
        "Secure reset link sent directly to your inbox.",
        "Link expires after 24 hours for your safety.",
        "No account info is exposed in the process.",
      ]}
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-(--brand) hover:underline">
            Return to sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleResetPassword} className="space-y-5">
        <label className="block space-y-2">
          <span className="text-sm font-semibold text-(--foreground)">Email address</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-(--muted)" />
            <input
              type="email"
              placeholder="name@vitalsync.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="app-input pl-11"
              disabled={loading || success}
            />
          </div>
        </label>

        <AnimatePresence>
          {success ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <p>Reset link sent. Check your inbox and spam folder for the email.</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

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

        <button type="submit" disabled={loading || success} className="app-button app-button-primary w-full py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60">
          {loading ? "Sending reset link..." : "Send reset link"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthShell>
  );
}