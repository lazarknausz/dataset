import type { Level, Trend } from "@/lib/types";

const TONES = {
  green: "bg-pos-soft text-pos",
  red: "bg-neg-soft text-neg",
  amber: "bg-warn-soft text-warn",
  blue: "bg-info-soft text-info",
  gray: "bg-surface2 text-ink2",
};

export function Pill({ tone = "gray", children }: { tone?: keyof typeof TONES; children: React.ReactNode }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${TONES[tone]}`}>{children}</span>;
}

/** Tone for a characteristic level — mirrors how the level reads for an operator. */
export function levelTone(name: string, level: Level): keyof typeof TONES {
  if (level === "Growth") return "green";
  if (level === "Decline") return "red";
  if (level === "Mature") return "amber";
  const goodWhenHigh = ["Barriers to Entry", "Assistance"];
  const badWhenHigh = ["Revenue Volatility", "Regulation and Policy", "Competition"];
  if (level === "Moderate") return "amber";
  if (goodWhenHigh.includes(name)) return level === "High" ? "green" : "red";
  if (badWhenHigh.includes(name)) return level === "High" ? "red" : "green";
  return level === "High" ? "green" : "red";
}

export function trendTone(t: Exclude<Trend, null>): keyof typeof TONES {
  return t === "Steady" ? "green" : t === "Increasing" ? "red" : "amber";
}

export function ChangePill({ value, unit = "%", goodWhenUp = true }: { value: number; unit?: string; goodWhenUp?: boolean }) {
  const up = value >= 0;
  const good = up === goodWhenUp;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold ${good ? "bg-pos-soft text-pos" : "bg-neg-soft text-neg"}`}>
      <span aria-hidden>{up ? "↑" : "↓"}</span>
      {Math.abs(value).toFixed(1)} {unit}
    </span>
  );
}
