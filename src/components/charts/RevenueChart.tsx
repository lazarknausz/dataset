"use client";

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/lib/types";
import { axisProps, tooltipStyle } from "./theme";

export function RevenueChart({ series, height = 300 }: { series: SeriesPoint[]; height?: number }) {
  // Two series so the forecast can be dashed; 2026 appears in both so the line is continuous.
  const data = series.map((p) => ({
    year: p.year,
    Revenue: p.year <= 2026 ? p.revenueBn : null,
    Forecast: p.year >= 2026 ? p.revenueBn : null,
  }));
  return (
    <div role="img" aria-label="Revenue 2016 to 2031 in HUF billions, with forecast from 2027" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="year" {...axisProps} />
          <YAxis {...axisProps} axisLine={false} width={56} tickFormatter={(v) => `${Math.round(v)}`} label={{ value: "HUF bn", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 12, dx: 10 }} />
          <Tooltip {...tooltipStyle} formatter={(v) => [`HUF ${Number(v).toFixed(1)}bn`, ""]} separator="" />
          <ReferenceLine x={2026} stroke="var(--line)" strokeDasharray="3 3" label={{ value: "Forecast →", position: "insideTopRight", fill: "var(--muted)", fontSize: 11 }} />
          <Line dataKey="Revenue" stroke="var(--series-1)" strokeWidth={2} dot={{ r: 3, fill: "var(--series-1)", stroke: "var(--surface)", strokeWidth: 2 }} activeDot={{ r: 5 }} connectNulls isAnimationActive={false} />
          <Line dataKey="Forecast" stroke="var(--series-1)" strokeWidth={2} strokeDasharray="6 4" dot={false} activeDot={{ r: 5 }} connectNulls isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
