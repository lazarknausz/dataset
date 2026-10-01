/** Categorical slots, assigned in fixed order (see CSS tokens --series-1..5). */
export const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)", "var(--series-5)"];

export const axisProps = {
  tick: { fill: "var(--muted)", fontSize: 12 },
  axisLine: { stroke: "var(--line)" },
  tickLine: false as const,
};

export const tooltipStyle = {
  contentStyle: {
    background: "var(--surface)",
    border: "1px solid var(--line)",
    borderRadius: 8,
    color: "var(--ink)",
    fontSize: 13,
    boxShadow: "0 4px 14px rgba(0,0,0,.12)",
  },
  labelStyle: { color: "var(--ink)", fontWeight: 700 },
  itemStyle: { color: "var(--ink-2)" },
};
