"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
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
import ChartShell from "./ChartShell";

interface TaskRecord {
  id: string;
  status: string;
  patientId?: string;
}

const STATUS_COLORS: Record<string, string> = {
  "To Do":       "#f59e0b",
  "In Progress": "#0f9f7a",
  "Done":        "#10b981",
};

export default function TaskStatsChart() {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<TaskRecord[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "tasks"),
      where("patientId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TaskRecord)));
    });

    return () => unsub();
  }, [user?.uid]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = { "To Do": 0, "In Progress": 0, "Done": 0 };
    tasks.forEach((t) => {
      if (t.status in counts) counts[t.status]++;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [tasks]);

  const total = tasks.length;
  const done  = tasks.filter((t) => t.status === "Done").length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <ChartShell
      title="Task Overview"
      eyebrow="Progress analytics"
      description={`${done} of ${total} tasks completed`}
      badge={total > 0 ? `${pct}% done` : "No tasks yet"}
      isEmpty={total === 0}
      emptyMessage="Add tasks to see your progress chart"
    >
      <div className="h-full flex flex-col">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/8">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(150,150,150,0.1)"
              />
              <XAxis
                dataKey="status"
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
                cursor={{ fill: "rgba(150,150,150,0.05)" }}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid var(--line)",
                  backgroundColor: "var(--surface-strong)",
                  color: "var(--foreground)",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
                }}
              />
              <Bar dataKey="count" name="Tasks" radius={[6, 6, 0, 0]} maxBarSize={70}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.status}
                    fill={STATUS_COLORS[entry.status] ?? "var(--brand)"}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartShell>
  );
}
