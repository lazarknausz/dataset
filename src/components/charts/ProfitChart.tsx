"use client";

import { Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SeriesPoint } from "@/lib/types";
import { axisProps, tooltipStyle } from "./theme";

export function ProfitChart({ series, height = 260 }: { series: SeriesPoint[]; height?: number }) {
  const data = series.map((p) => ({ year: p.year, Profit: p.profitBn, margin: (p.profitBn / p.revenueBn) * 100 }));
  return (
    <div role="img" aria-label="Profit 2016 to 2031 in HUF billions" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="year" {...axisProps} />
          <YAxis {...axisProps} axisLine={false} width={56} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "var(--surface-2)" }} formatter={(v, n, item) => n === "Profit" ? [`HUF ${Number(v).toFixed(1)}bn (${(item.payload as { margin: number }).margin.toFixed(1)}% margin)`, ""] : [v, n]} separator="" />
          <Bar dataKey="Profit" fill="var(--series-3)" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
