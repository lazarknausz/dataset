"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Segment } from "@/lib/types";
import { formatHuf } from "@/lib/format";
import { SERIES, tooltipStyle } from "./theme";

export function Donut({ segments, label }: { segments: Segment[]; label: string }) {
  return (
    <div>
      <div role="img" aria-label={label} className="mx-auto h-56 w-56 sm:h-64 sm:w-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip {...tooltipStyle} formatter={(v, n) => [`${Number(v).toFixed(1)}%`, n]} />
            <Pie data={segments} dataKey="share" nameKey="name" innerRadius="62%" outerRadius="100%" stroke="var(--surface)" strokeWidth={2} startAngle={90} endAngle={-270} isAnimationActive={false}>
              {segments.map((s, i) => <Cell key={s.name} fill={SERIES[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {segments.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2">
            <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: SERIES[i] }} />
            <span className="text-ink">{s.name}</span>
            <span className="ml-auto text-ink2">{formatHuf(s.valueBn)}</span>
            <span className="w-14 rounded bg-surface2 px-1.5 py-0.5 text-right text-xs font-bold text-ink">{s.share.toFixed(1)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
