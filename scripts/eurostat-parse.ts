/** Pure helpers for decoding Eurostat JSON-stat 2.0 responses (no network access). */

export interface JsonStat {
  id: string[];
  size: number[];
  value: Record<string, number> | (number | null)[];
  dimension: Record<string, { category: { index: Record<string, number> | string[]; label?: Record<string, string> } }>;
}

export interface Cell {
  coords: Record<string, string>; // dimension id -> category code
  value: number;
}

function codesOf(dim: JsonStat["dimension"][string]): string[] {
  const idx = dim.category.index;
  if (Array.isArray(idx)) return idx;
  const out: string[] = [];
  for (const [code, pos] of Object.entries(idx)) out[pos] = code;
  return out;
}

export function decode(js: JsonStat): Cell[] {
  const codes = js.id.map((id) => codesOf(js.dimension[id]));
  const cells: Cell[] = [];
  const entries: [number, number][] = Array.isArray(js.value)
    ? js.value.flatMap((v, i) => (v === null ? [] : [[i, v] as [number, number]]))
    : Object.entries(js.value).map(([k, v]) => [Number(k), v]);
  for (const [flat, value] of entries) {
    let rest = flat;
    const coords: Record<string, string> = {};
    for (let d = js.id.length - 1; d >= 0; d--) {
      coords[js.id[d]] = codes[d][rest % js.size[d]];
      rest = Math.floor(rest / js.size[d]);
    }
    cells.push({ coords, value });
  }
  return cells;
}

/** Name of the indicator dimension: `indic_sb` (sbs_na_sca_r2, 2008–2020) or `indic_sbs` (sbs_ovw_act, 2021+). */
export function indicatorDim(js: JsonStat): string {
  return js.id.find((id) => id === "indic_sb" || id === "indic_sbs") ?? "indic_sb";
}

/**
 * Find the indicator codes by label, since Eurostat renamed them between SBS revisions
 * (e.g. "Turnover or gross premiums written" -> "Net turnover", "Personnel costs" -> "Employee benefits expense").
 * Only absolute levels count (" - number" / " - million euro"), never ratios, shares or per-head figures.
 */
export function findIndicators(js: JsonStat): Partial<Record<"enterprises" | "turnover" | "employees" | "personnelCosts" | "valueAdded", string>> {
  const labels = js.dimension[indicatorDim(js)]?.category.label ?? {};
  const find = (re: RegExp) => Object.entries(labels).find(([, l]) => re.test(l))?.[0];
  return {
    enterprises: find(/^enterprises - number$/i),
    turnover: find(/^(net turnover|turnover or gross premiums written) - million euro$/i),
    employees: find(/^persons employed - number$/i),
    personnelCosts: find(/^(personnel costs|employee benefits expense) - million euro$/i),
    valueAdded: find(/^value added( at factor cost)? - million euro$/i),
  };
}

/** Map a TEÁOR/NACE division code to Eurostat's nace_r2 code, e.g. "10" -> "C10". */
export function eurostatNace(division: string, section: string): string {
  return `${section}${division}`;
}

/** Collect annual values for one dimension selection: nace code -> year -> value. */
export function collect(js: JsonStat, opts: { unit?: string[] }): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const c of decode(js)) {
    if (opts.unit && c.coords.unit && !opts.unit.includes(c.coords.unit)) continue;
    // skip breakdowns other than the total (e.g. size class) when present
    const extra = Object.entries(c.coords).filter(([k]) => !["freq", "indic_sb", "indic_sbs", "nace_r2", "geo", "time", "unit"].includes(k));
    if (extra.some(([, v]) => v !== "TOTAL")) continue;
    const nace = c.coords.nace_r2;
    (out[nace] ??= {})[c.coords.time] = c.value;
  }
  return out;
}

/** EUR→HUF annual average rates from ert_bil_eur_a. */
export function rates(js: JsonStat): Record<string, number> {
  const out: Record<string, number> = {};
  for (const c of decode(js)) if (c.coords.currency === "HUF") out[c.coords.time] = c.value;
  return out;
}
