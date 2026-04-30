"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AuthShell from "@/components/AuthShell";
import { auth, db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

type Role = "patient" | "doctor" | "admin";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

const roleOptions: { id: Role; label: string; icon: typeof UserRound }[] = [
  { id: "patient", label: "Patient", icon: UserRound },
  { id: "doctor", label: "Doctor", icon: Stethoscope },
  { id: "admin", label: "Admin", icon: ShieldCheck },
];

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!formData.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = "Enter a valid email address.";
    if (!formData.password) nextErrors.password = "Password is required.";
    else if (formData.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (!formData.confirmPassword) nextErrors.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalError("");
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      await updateProfile(userCredential.user, { displayName: formData.fullName });

      // Save user profile to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.fullName,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
        bp: "120/80", // Default health metrics
        bloodSugar: "90",
        heartRate: "72",
        weight: "70",
      });

      setUser({
        uid: userCredential.user.uid,
        name: formData.fullName,
        email: userCredential.user.email || formData.email,
        role: formData.role,
      });

      localStorage.setItem("userRole", formData.role);
      router.push("/dashboard");
    } catch (error: unknown) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
      const message = error instanceof Error ? error.message : "Registration failed.";

      if (code === "auth/email-already-in-use") {
        setGlobalError("That email is already in use. Try signing in instead.");
      } else if (code === "auth/weak-password") {
        setGlobalError("That password is too weak. Add a few more characters.");
      } else if (code === "auth/invalid-email") {
        setGlobalError("That email address does not look valid.");
      } else {
        setGlobalError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  return (
    <AuthShell
      title="Complete your registration"
      description="This version keeps the longer sign-up flow, but it now feels consistent, readable, and much easier to finish on mobile."
      eyebrow="Full registration"
      sideTitle="Detailed onboarding, now without the clunky detour."
      sideDescription="If your team still wants a fuller create-account path, this screen now shares the same visual rhythm and friendlier validation patterns as the rest of the app."
      highlights={[
        "Validation feedback sits closer to each field.",
        "Role selection is clearer and more tappable.",
        "The dark/light theme stays consistent with the rest of the product.",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3">
          {roleOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => updateField("role", option.id)}
              className={`rounded-[1.25rem] border p-4 text-left transition ${
                formData.role === option.id
                  ? "border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm"
                  : "border-[var(--line)] bg-[color:var(--surface-strong)] hover:border-[color:var(--brand)]/40"
              }`}
            >
              <option.icon className="mb-3 h-5 w-5 text-[var(--brand)]" />
              <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Full name</span>
            <input
              type="text"
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Jordan Lee"
              className="app-input"
            />
            {errors.fullName ? <span className="text-xs text-[var(--danger)]">{errors.fullName}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Email address</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="you@vitalsync.com"
                className="app-input pl-11"
              />
            </div>
            {errors.email ? <span className="text-xs text-[var(--danger)]">{errors.email}</span> : null}
          </label>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Password</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="password"
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="At least 6 characters"
                className="app-input pl-11"
              />
            </div>
            {errors.password ? <span className="text-xs text-[var(--danger)]">{errors.password}</span> : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[var(--foreground)]">Confirm password</span>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              placeholder="Re-enter password"
              className="app-input"
            />
            {errors.confirmPassword ? <span className="text-xs text-[var(--danger)]">{errors.confirmPassword}</span> : null}
          </label>
        </div>

        {globalError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {globalError}
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-[var(--line)] bg-[color:var(--surface-strong)] p-4 text-sm text-[var(--muted)]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--brand)]" />
            <p>Once you finish, we save the selected role so the dashboard opens in the right context right away.</p>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="app-button app-button-primary w-full py-4 text-sm disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading ? "Creating account..." : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <>
        Already registered?{" "}
        <Link href="/login" className="font-semibold text-[var(--brand)] hover:underline">
          Sign in
        </Link>
      </>
    </AuthShell>
  );
}