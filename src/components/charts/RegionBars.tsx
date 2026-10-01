"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { Region } from "@/lib/types";
import { axisProps, tooltipStyle } from "./theme";

export function RegionBars({ regions }: { regions: Region[] }) {
  const real = regions[0]?.source === "eurostat";
  const [a, b] = real ? ["Share of employment", "Share of local units"] : ["Share of revenue", "Share of businesses"];
  const data = regions.map((r) => ({ name: r.name, [a]: r.share, [b]: r.businessShare }));
  return (
    <div role="img" aria-label={`${a} and ${b.toLowerCase()} by Hungarian NUTS-2 region`} style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--grid)" horizontal={false} />
          <XAxis type="number" {...axisProps} unit="%" />
          <YAxis type="category" dataKey="name" {...axisProps} axisLine={false} width={140} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "var(--surface-2)" }} formatter={(v) => `${Number(v).toFixed(1)}%`} />
          <Legend wrapperStyle={{ fontSize: 13, color: "var(--ink-2)" }} />
          <Bar dataKey={a} fill="var(--series-1)" radius={[0, 4, 4, 0]} maxBarSize={12} isAnimationActive={false} />
          <Bar dataKey={b} fill="var(--series-2)" radius={[0, 4, 4, 0]} maxBarSize={12} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
