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

/** Find the indicator codes (dimension `indic_sb`) by label, since Eurostat has renamed them across SBS revisions. */
export function findIndicators(js: JsonStat): Partial<Record<"enterprises" | "turnover" | "employees" | "personnelCosts" | "valueAdded", string>> {
  const labels = js.dimension.indic_sb?.category.label ?? {};
  const find = (re: RegExp) => Object.entries(labels).find(([, l]) => re.test(l))?.[0];
  return {
    enterprises: find(/^number of enterprises/i),
    turnover: find(/^turnover/i),
    employees: find(/^number of persons employed/i),
    personnelCosts: find(/^personnel costs/i),
    valueAdded: find(/^value added at factor cost/i),
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
    const extra = Object.entries(c.coords).filter(([k]) => !["freq", "indic_sb", "nace_r2", "geo", "time", "unit"].includes(k));
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
