export type Source = "eurostat" | "ksh" | "derived" | "placeholder";

export interface Metric<T = number> {
  value: T;
  source: Source;
  year?: number;
}

export interface SectionProfile {
  /** typical annual revenue of a division in the section, HUF bn */
  revenueBn: [number, number];
  /** profit margin range, % of revenue */
  margin: [number, number];
  /** wages as % of revenue */
  wageShare: [number, number];
  /** average revenue per employee, HUF m */
  revenuePerEmployeeM: [number, number];
  /** average revenue per business, HUF m */
  revenuePerBusinessM: [number, number];
  /** annual growth range, % */
  growth: [number, number];
}

export interface Section {
  code: string;
  nameEn: string;
  nameHu: string;
  profile: SectionProfile;
}

export interface Division {
  code: string; // "10", "01" ... (NACE Rev.2 / TEÁOR'08 division)
  section: string;
  nameEn: string;
  nameHu: string;
  /** Short title used in headings, e.g. "Food Manufacturing" */
  shortEn: string;
  competitors: string[];
  complementors: string[];
}

export interface SeriesPoint {
  year: number;
  revenueBn: number;
  profitBn: number;
  employees: number;
  businesses: number;
  wagesBn: number;
  forecast: boolean;
  source: Source;
}

export interface Kpi {
  key: "revenue" | "employees" | "businesses" | "profit" | "margin" | "wages";
  label: string;
  value: number;
  unit: "HUF bn" | "persons" | "count" | "%" | "HUF m";
  cagrHistoric: number; // '21-'26, % (pp for margin)
  cagrForecast?: number; // '26-'31
  source: Source;
  year: number;
}

export interface Segment {
  name: string;
  share: number; // %
  valueBn: number;
}

export interface Region {
  name: string;
  nuts: string;
  share: number; // % of industry revenue
  businessShare: number;
}

export type Level = "Low" | "Moderate" | "High" | "Growth" | "Mature" | "Decline";
export type Trend = "Steady" | "Increasing" | "Decreasing" | null;

export interface Characteristic {
  name: string;
  level: Level;
  trend: Trend;
}

export interface Driver {
  name: string;
  impact: "Positive" | "Negative";
}

export interface Company {
  name: string;
  share: number; // % of industry revenue
  revenueBn: number;
  employees: number;
}

export interface CostLine {
  name: string;
  industry: number; // % of revenue
  sectorAvg: number;
}

export interface IndustryReport {
  division: Division;
  section: Section;
  title: string;
  analyst: string;
  location: string;
  published: string;
  takeaways: { performance: string[]; markets: string[] };
  definition: string;
  included: string[];
  codes: { year: number; code: string; name: string }[];
  terms: { term: string; description: string }[];
  kpis: Kpi[];
  series: SeriesPoint[];
  products: Segment[];
  markets: Segment[];
  regions: Region[];
  structure: Characteristic[];
  drivers: Driver[];
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] };
  companies: Company[];
  costs: CostLine[];
  international: { country: string; name: string }[];
  /** true when any headline number came from a real dataset */
  hasRealData: boolean;
}

export type EurostatSnapshot = Record<
  string, // division code
  Partial<
    Record<
      "enterprises" | "turnoverBn" | "employees" | "personnelCostsBn" | "valueAddedBn",
      Record<string, number> // year -> value
    >
  >
>;
