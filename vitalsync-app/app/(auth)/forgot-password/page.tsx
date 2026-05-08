"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldAlert } from "lucide-react";
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
      showSidePanel={false}
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">
            Return to sign in
          </Link>
        </>
      }
    >
      <AnimatePresence mode="wait">
        {!success ? (
          <motion.form
            key="reset-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            onSubmit={handleResetPassword}
            className="space-y-6"
          >
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[var(--foreground)]">Email address</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)] transition-colors peer-focus:text-[var(--brand)]" />
                <input
                  type="email"
                  placeholder="name@vitalsync.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="peer app-input pl-12 text-base transition-all hover:border-[var(--brand)]/50 focus:border-[var(--brand)] focus:ring-4 focus:ring-[var(--brand)]/10"
                  disabled={loading}
                />
              </div>
            </label>

            <AnimatePresence>
              {error ? (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="font-medium">{error}</p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="app-button app-button-primary flex w-full items-center justify-center py-4 text-base shadow-lg shadow-[var(--brand)]/20 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--brand)]/30 disabled:pointer-events-none disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <>
                  Send reset link
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex flex-col items-center space-y-6 rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-10 text-center shadow-2xl shadow-[var(--brand)]/10"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 shadow-inner dark:from-emerald-500/20 dark:to-emerald-500/5 dark:text-emerald-400">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-[var(--foreground)]">Check your inbox</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">
                We&apos;ve sent a secure password reset link to <br />
                <span className="font-bold text-[var(--foreground)]">{email}</span>
              </p>
            </div>

            <div className="w-full pt-4">
              <Link
                href="/login"
                className="app-button flex w-full items-center justify-center rounded-xl border-2 border-[var(--line)] bg-transparent py-4 text-base font-semibold text-[var(--foreground)] transition-all hover:border-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}