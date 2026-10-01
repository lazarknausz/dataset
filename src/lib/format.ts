export function formatHuf(bn: number): string {
  const abs = Math.abs(bn);
  if (abs >= 1000) return `HUF ${(bn / 1000).toFixed(1)}tn`;
  if (abs >= 1) return `HUF ${bn.toFixed(1)}bn`;
  return `HUF ${(bn * 1000).toFixed(1)}m`;
}

export function formatCount(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export function formatPercent(n: number, digits = 1): string {
  return `${n.toFixed(digits)}%`;
}

export function formatSigned(n: number, digits = 1): string {
  return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}`;
}

/** Compound annual growth rate in %, between two values `years` apart. */
export function cagr(start: number, end: number, years: number): number {
  if (start <= 0 || end <= 0 || years <= 0) return 0;
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}
