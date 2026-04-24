"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { StaffRecord } from "./StaffCRUD";

const PALETTE = [
  "var(--brand)",
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ec4899",
];

export default function StaffDeptChart() {
  const { user } = useAuthStore();
  const [staff, setStaff] = useState<StaffRecord[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "staff"),
      where("createdBy", "==", user.uid),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() } as StaffRecord)));
    });
    return () => unsub();
  }, [user?.uid]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    staff.forEach((s) => {
      const dept = s.department?.trim() || "Unassigned";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [staff]);

  const topDept   = chartData[0]?.dept ?? "—";
  const totalStaff = staff.length;

  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="eyebrow">Workforce analytics</span>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Staff by Department</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {totalStaff} member{totalStaff !== 1 ? "s" : ""} &bull; largest: {topDept}
          </p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Live
        </span>
      </div>

      {/* Bar Chart */}
      <div className="mt-8 h-64 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-strong)]">
            <p className="text-sm text-[var(--muted)]">Onboard staff to see department distribution</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150,150,150,0.1)"
              />
              <XAxis
                dataKey="dept"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                interval={0}
                angle={chartData.length > 4 ? -30 : 0}
                textAnchor={chartData.length > 4 ? "end" : "middle"}
                height={chartData.length > 4 ? 48 : 24}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(150,150,150,0.05)" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--surface-strong)",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
              />
              <Bar dataKey="count" name="Staff" radius={[6, 6, 0, 0]} maxBarSize={64}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend pills */}
      {chartData.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {chartData.map((d, i) => (
            <span
              key={d.dept}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--foreground)]"
            >
              <span
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ background: PALETTE[i % PALETTE.length] }}
              />
              {d.dept} ({d.count})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
