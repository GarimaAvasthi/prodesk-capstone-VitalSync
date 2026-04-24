"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PatientRecord } from "./PatientCRUD";

export default function AnalyticsChart() {
  const [patients, setPatients] = useState<PatientRecord[]>([]);

  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setPatients(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PatientRecord)));
    });
    return () => unsub();
  }, []);

  // Group by day-of-month for the current month; fall back to appointment hour
  const { chartData, label } = useMemo(() => {
    if (patients.length === 0) return { chartData: [], label: "" };

    const now          = new Date();
    const currentMonth = now.getMonth();
    const currentYear  = now.getFullYear();

    const dayCounts: Record<number, number> = {};

    patients.forEach((p) => {
      if (!p.createdAt) return;
      const date: Date = p.createdAt.toDate
        ? p.createdAt.toDate()
        : new Date(p.createdAt);

      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        const day = date.getDate();
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      }
    });

    if (Object.keys(dayCounts).length > 0) {
      const monthName = now.toLocaleString("default", { month: "long" });
      return {
        label: `${monthName} ${currentYear}`,
        chartData: Object.entries(dayCounts)
          .map(([day, count]) => ({ label: `${day}`, count }))
          .sort((a, b) => Number(a.label) - Number(b.label)),
      };
    }

    // Fallback: group by appointment hour
    const hourCounts: Record<string, number> = {};
    patients.forEach((p) => {
      if (!p.time) return;
      const hour = p.time.split(":")[0] + ":00";
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return {
      label: "By appointment hour",
      chartData: Object.entries(hourCounts)
        .map(([h, count]) => ({ label: h, count }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    };
  }, [patients]);

  const thisMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <div className="section-shell rounded-3xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span className="eyebrow">Data intelligence</span>
          <h3 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Patient Admissions</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {label || thisMonth} &bull; {patients.length} total record{patients.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="flex-shrink-0 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          Live
        </span>
      </div>

      {/* Area Chart */}
      <div className="mt-8 h-64 w-full">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-strong)]">
            <p className="text-sm text-[var(--muted)]">Add patients to see admission trends</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="admissionsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--brand)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150,150,150,0.1)"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted)", fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ stroke: "var(--brand)", strokeWidth: 1, strokeDasharray: "4 4" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--surface-strong)",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
                labelFormatter={(v) => `Day ${v}`}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Admissions"
                stroke="var(--brand)"
                strokeWidth={3}
                fill="url(#admissionsGrad)"
                dot={{ r: 4, fill: "var(--brand)", strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "var(--brand)", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
