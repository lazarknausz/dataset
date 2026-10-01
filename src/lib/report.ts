import { DIVISION_BY_CODE } from "@/data/divisions";
import { SECTION_BY_CODE } from "@/data/sections";
import { GLOSSARY } from "@/data/glossary";
import { DRIVERS } from "@/data/drivers";
import eurostat from "@/data/generated/eurostat-hu.json";
import eurostatRegions from "@/data/generated/eurostat-hu-regions.json";
import { cagr } from "./format";
import { createRng } from "./rng";
import {
  BASE_YEAR, FIRST_YEAR, LAST_YEAR, internationalIndustries, pickAnalystLocation, placeholderCompanies,
  placeholderCosts, placeholderMarkets, placeholderProducts, placeholderRegions, placeholderSeries,
  placeholderStructure,
} from "./placeholder";
import type { EurostatSnapshot, Region, RegionSnapshot, IndustryReport, Kpi, SeriesPoint, Source } from "./types";

type Field = "revenueBn" | "employees" | "businesses" | "wagesBn" | "profitBn";
const FIELD_TO_SNAPSHOT: Record<Field, keyof EurostatSnapshot[string]> = {
  revenueBn: "turnoverBn",
  employees: "employees",
  businesses: "enterprises",
  wagesBn: "personnelCostsBn",
  profitBn: "valueAddedBn", // profit derived below from value added − personnel costs
};

/** Merge real (Eurostat) annual values over the placeholder series.
 *  The placeholder path is rescaled so it continues smoothly from the latest real year. */
export function mergeRealData(series: SeriesPoint[], snap: EurostatSnapshot[string] | undefined): { series: SeriesPoint[]; realYear?: number } {
  if (!snap) return { series };
  const real: Partial<Record<Field, Record<number, number>>> = {};
  for (const field of Object.keys(FIELD_TO_SNAPSHOT) as Field[]) {
    if (field === "profitBn") {
      const va = snap.valueAddedBn, pc = snap.personnelCostsBn;
      if (!va || !pc) continue;
      const out: Record<number, number> = {};
      for (const y of Object.keys(va)) if (pc[y] !== undefined) out[+y] = Math.max(0, va[y] - pc[y]);
      if (Object.keys(out).length) real[field] = out;
      continue;
    }
    const data = snap[FIELD_TO_SNAPSHOT[field]];
    // Eurostat reports 0 for tiny or suppressed cells (e.g. division 07); treat as missing rather than a real zero.
    const positive = data ? Object.entries(data).filter(([, v]) => v > 0).map(([y, v]) => [+y, v] as const) : [];
    if (positive.length) real[field] = Object.fromEntries(positive);
  }
  const fields = Object.keys(real) as Field[];
  if (!fields.length) return { series };

  const merged = series.map((p) => ({ ...p }));
  let realYear: number | undefined;
  for (const field of fields) {
    const data = real[field]!;
    const years = Object.keys(data).map(Number).filter((y) => y >= FIRST_YEAR && y <= LAST_YEAR);
    if (!years.length) continue;
    const anchor = Math.max(...years);
    const base = merged.find((p) => p.year === anchor)![field];
    const ratio = base > 0 ? data[anchor] / base : 1;
    for (const p of merged) {
      if (data[p.year] !== undefined) {
        p[field] = data[p.year];
        if (field === "revenueBn") p.source = "eurostat";
      } else if (p.year > anchor) {
        p[field] = p[field] * ratio; // continue from the real anchor
      } else if (p.year < Math.min(...years)) {
        p[field] = p[field] * ratio;
      }
      if (field === "employees" || field === "businesses") p[field] = Math.round(p[field]);
    }
    if (field === "revenueBn") realYear = anchor;
  }
  return { series: merged, realYear };
}

function kpi(key: Kpi["key"], label: string, unit: Kpi["unit"], series: SeriesPoint[], get: (p: SeriesPoint) => number, source: Source, year: number, withForecast = true): Kpi {
  const at = (y: number) => get(series.find((p) => p.year === y)!);
  const isMargin = key === "margin";
  const hist = isMargin ? at(BASE_YEAR) - at(2021) : cagr(at(2021), at(BASE_YEAR), 5);
  const fcst = isMargin ? undefined : cagr(at(BASE_YEAR), at(LAST_YEAR), 5);
  return { key, label, unit, value: at(BASE_YEAR), cagrHistoric: hist, cagrForecast: withForecast ? fcst : undefined, source, year };
}

/** Real NUTS-2 split (employment and local-unit shares) when Eurostat has one, else the placeholder split. */
export function realRegions(code: string, fallback: Region[], snap: RegionSnapshot): Region[] {
  const entry = snap[code];
  if (!entry) return fallback;
  const empTotal = fallback.reduce((a, r) => a + (entry.regions[r.nuts]?.employees ?? 0), 0);
  const unitTotal = fallback.reduce((a, r) => a + (entry.regions[r.nuts]?.localUnits ?? 0), 0);
  if (!(empTotal > 0 && unitTotal > 0)) return fallback;
  return fallback.map((r) => ({
    ...r,
    share: ((entry.regions[r.nuts]?.employees ?? 0) / empTotal) * 100,
    businessShare: ((entry.regions[r.nuts]?.localUnits ?? 0) / unitTotal) * 100,
    source: "eurostat" as const,
    year: entry.year,
  }));
}

export function buildReport(code: string, snapshot: EurostatSnapshot = eurostat as EurostatSnapshot, regionSnapshot: RegionSnapshot = eurostatRegions as RegionSnapshot): IndustryReport {
  const division = DIVISION_BY_CODE[code];
  if (!division) throw new Error(`Unknown TEÁOR division: ${code}`);
  const section = SECTION_BY_CODE[division.section];
  const rng = createRng(`meta:${code}`);

  const { series, realYear } = mergeRealData(placeholderSeries(division, section), snapshot[code]);
  const hasRealData = realYear !== undefined;
  const src: Source = hasRealData ? "derived" : "placeholder";
  const kYear = realYear ?? BASE_YEAR;
  const cur = series.find((p) => p.year === BASE_YEAR)!;
  const margin = (p: SeriesPoint) => (p.profitBn / p.revenueBn) * 100;
  const wageShare = (cur.wagesBn / cur.revenueBn) * 100;

  const kpis: Kpi[] = [
    kpi("revenue", "Revenue", "HUF bn", series, (p) => p.revenueBn, src, kYear),
    kpi("employees", "Employees", "persons", series, (p) => p.employees, src, kYear),
    kpi("businesses", "Businesses", "count", series, (p) => p.businesses, src, kYear),
    kpi("profit", "Profit", "HUF bn", series, (p) => p.profitBn, src, kYear, false),
    kpi("margin", "Profit Margin", "%", series, margin, src, kYear, false),
    kpi("wages", "Wages", "HUF bn", series, (p) => p.wagesBn, src, kYear),
  ];

  const structure = placeholderStructure(division);
  const concentration = structure[0].level;
  const rev = kpis[0], emp = kpis[1];
  const grows = rev.cagrForecast! > 0;
  const name = division.shortEn;
  const lower = name.toLowerCase();

  return {
    division,
    section,
    title: `${name} in Hungary`,
    analyst: "DepthAnalysis Research Desk",
    location: pickAnalystLocation(rng),
    published: "Oct 2026",
    takeaways: {
      performance: [
        `Revenue for ${lower} in Hungary is estimated at ${cur.revenueBn.toFixed(1)} billion forints in 2026, ${rev.cagrHistoric >= 0 ? "growing" : "contracting"} at an annualised ${Math.abs(rev.cagrHistoric).toFixed(1)}% over the past five years. Domestic demand, the forint exchange rate and energy costs have been the main swing factors.`,
        `Over the next five years, revenue is forecast to ${grows ? "expand" : "ease"} at ${Math.abs(rev.cagrForecast!).toFixed(1)}% a year. Employment is expected to ${emp.cagrForecast! >= 0 ? "rise" : "fall"} as operators ${emp.cagrForecast! >= 0 ? "add capacity" : "invest in productivity"} amid a tight Hungarian labour market.`,
        `EU funding, wage growth and Hungary's position within central European supply chains will shape profit margins, which currently stand at ${margin(cur).toFixed(1)}% of revenue.`,
      ],
      markets: [
        `The largest product segment is ${placeholderProducts(division, section, cur.revenueBn)[0].name.toLowerCase()}, followed by smaller specialised lines. Buyers are increasingly price-sensitive as consumer price inflation eases only slowly.`,
        `Exports to the EU, mainly Germany and neighbouring countries, remain an important outlet, while domestic households and businesses account for the rest of demand.`,
      ],
    },
    definition: `Businesses in this industry are classified under TEÁOR'08 division ${division.code}: ${division.nameEn.toLowerCase()}. The industry covers establishments registered in Hungary whose main activity falls within this division, from large multinational subsidiaries to small domestic firms.`,
    included: [
      `Core ${lower} activities`,
      `Related services provided to customers in Hungary`,
      `Establishments of all sizes, from sole traders to large enterprises`,
    ],
    codes: [
      { year: 2008, code: division.code, name: division.nameEn },
      { year: 2008, code: `${division.code} (HU)`, name: division.nameHu },
    ],
    terms: GLOSSARY[section.code] ?? [],
    kpis,
    series,
    products: placeholderProducts(division, section, cur.revenueBn),
    markets: placeholderMarkets(division, section, cur.revenueBn),
    regions: realRegions(code, placeholderRegions(division, section), regionSnapshot),
    structure,
    drivers: DRIVERS[section.code] ?? [],
    swot: {
      strengths: [
        margin(cur) > (section.profile.margin[0] + section.profile.margin[1]) / 2 ? "High profit vs. sector average" : "Stable demand base",
        concentration === "Low" ? "Low customer concentration" : "Established market leaders",
        "Skilled workforce and central European location",
        "Access to EU funding",
      ],
      weaknesses: ["Rising labour costs", "Dependence on imported inputs", "Fragmented small-business base"],
      opportunities: ["Nearshoring by Western European companies", "Digitalisation and automation", "Export growth within the EU single market"],
      threats: ["Forint volatility", "Energy price spikes", "Skilled labour shortages and emigration"],
    },
    companies: placeholderCompanies(division, section, cur.revenueBn, cur.employees, concentration),
    costs: placeholderCosts(division, section, wageShare, margin(cur)),
    international: internationalIndustries(division),
    hasRealData,
  };
}
