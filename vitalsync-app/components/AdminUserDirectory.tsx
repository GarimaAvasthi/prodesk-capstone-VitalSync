"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ShieldCheck, Stethoscope, UserRound, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { SkeletonRow } from "./Skeleton";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUserDirectory() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as UserProfile));
      // Use microtask to avoid synchronous setState in effect warning
      Promise.resolve().then(() => {
        setUsers(data);
        setLoading(false);
      });
    });
    return () => unsub();
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <ShieldCheck className="h-4 w-4 text-sky-500" />;
      case "doctor": return <Stethoscope className="h-4 w-4 text-[var(--brand)]" />;
      case "patient":
      default: return <UserRound className="h-4 w-4 text-[var(--muted)]" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400 border-sky-500/20";
      case "doctor": return "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]/20";
      case "patient":
      default: return "bg-[var(--line)] text-[var(--foreground)] border-[var(--line)]";
    }
  };

  return (
    <div className="section-shell rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Platform Directory</span>
          <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)] sm:text-2xl">Registered Users</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--line)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]">
          <Users className="h-4 w-4" />
          {users.length} Total
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] py-10 text-center">
            <Users className="mb-3 h-8 w-8 text-[var(--muted)]" />
            <p className="text-sm font-medium text-[var(--muted)]">No users registered yet.</p>
          </div>
        ) : (
          users.map((u) => (
            <div
              key={u.id}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between card-interactive"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--surface-strong)] shadow-inner">
                  {getRoleIcon(u.role)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-[var(--foreground)]">{u.name}</p>
                  <p className="truncate text-sm text-[var(--muted)]">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                  {u.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
