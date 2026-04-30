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
import ChartShell from "./ChartShell";

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
    <ChartShell
      title="Staff by Department"
      eyebrow="Workforce analytics"
      description={`${totalStaff} members • largest: ${topDept}`}
      isEmpty={chartData.length === 0}
      emptyMessage="Onboard staff to see department distribution"
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
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
    </ChartShell>
  );
}
