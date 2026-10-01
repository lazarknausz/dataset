"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CostLine } from "@/lib/types";
import { axisProps, tooltipStyle } from "./theme";

export function CostBars({ costs, sectionName }: { costs: CostLine[]; sectionName: string }) {
  const data = costs.map((c) => ({ name: c.name, "This industry": c.industry, [`Sector average`]: c.sectorAvg }));
  return (
    <div role="img" aria-label={`Cost structure as share of revenue, versus the ${sectionName} average`} style={{ height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }} barGap={2}>
          <CartesianGrid stroke="var(--grid)" vertical={false} />
          <XAxis dataKey="name" {...axisProps} interval={0} tick={{ fill: "var(--muted)", fontSize: 11 }} />
          <YAxis {...axisProps} axisLine={false} unit="%" width={44} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "var(--surface-2)" }} formatter={(v) => `${Number(v).toFixed(1)}% of revenue`} />
          <Legend wrapperStyle={{ fontSize: 13, color: "var(--ink-2)" }} />
          <Bar dataKey="This industry" fill="var(--series-1)" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
          <Bar dataKey="Sector average" fill="var(--series-4)" radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
