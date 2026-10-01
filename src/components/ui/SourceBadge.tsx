import type { Source } from "@/lib/types";

const LABEL: Record<Source, string> = {
  eurostat: "Eurostat SBS",
  ksh: "KSH",
  derived: "Eurostat-based estimate",
  placeholder: "Estimate",
};

export function SourceBadge({ source, year }: { source: Source; year?: number }) {
  const real = source !== "placeholder";
  return (
    <span
      title={real ? "Derived from published statistics" : "Placeholder value — not real market data"}
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${real ? "bg-pos-soft text-pos" : "bg-surface2 text-muted"}`}
    >
      <span aria-hidden>{real ? "●" : "○"}</span>
      {LABEL[source]}
      {real && year ? ` ${year}` : ""}
    </span>
  );
}
