"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface VitalAreaChartProps {
  data: { time: string; heart: number }[];
}

export default function VitalAreaChart({ data }: VitalAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#0f9f7a" stopOpacity={0.32} />
            <stop offset="95%" stopColor="#0f9f7a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(93,115,104,0.18)" />
        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#7b8c84", fontSize: 11 }} />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            borderRadius: 16,
            border: "1px solid rgba(16,35,28,0.08)",
            boxShadow: "0 18px 45px -28px rgba(12,46,33,0.45)",
            fontSize: 13,
          }}
        />
        <Area type="monotone" dataKey="heart" stroke="#0f9f7a" strokeWidth={3} fill="url(#heartGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
