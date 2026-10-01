import { createRng, type Rng } from "./rng";
import type {
  Characteristic, Company, CostLine, Division, Level, Region, Section, Segment, SeriesPoint, Trend,
} from "./types";

export const FIRST_YEAR = 2016;
export const BASE_YEAR = 2026; // current-year estimate
export const LAST_YEAR = 2031;

const round = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/** Revenue, profit, employment, business count and wages for 2016–2031. */
export function placeholderSeries(div: Division, sec: Section): SeriesPoint[] {
  const rng = createRng(`series:${div.code}`);
  const pr = sec.profile;
  const revenue26 = rng.range(...pr.revenueBn);
  const gHist = rng.range(...pr.growth) - rng.range(0, 1.5);
  const gFcst = rng.range(...pr.growth) - rng.range(0, 1);
  const margin26 = rng.range(...pr.margin);
  const wageShare = rng.range(...pr.wageShare);
  // ×1.3 keeps the national employment total near Hungary's real ~4.5m
  const revPerEmp26 = rng.range(...pr.revenuePerEmployeeM) * 1.3;
  const revPerBiz26 = rng.range(...pr.revenuePerBusinessM);
  const empTrend = rng.range(-2.2, 0.8); // % p.a. (productivity-led)
  const bizTrend = rng.range(-3, 0.5);
  const marginDrift = rng.range(-0.3, 0.25); // pp p.a.

  const points: SeriesPoint[] = [];
  for (let year = FIRST_YEAR; year <= LAST_YEAR; year++) {
    const dt = year - BASE_YEAR;
    const g = dt <= 0 ? gHist : gFcst;
    const noise = year <= BASE_YEAR ? rng.range(-3.5, 3.5) : rng.range(-0.8, 0.8);
    const revenueBn = revenue26 * Math.pow(1 + g / 100, dt) * (1 + noise / 100);
    const margin = Math.max(0.2, margin26 + marginDrift * dt + (year <= BASE_YEAR ? rng.range(-0.8, 0.8) : 0));
    const employees = (revenueBn * 1000) / (revPerEmp26 * Math.pow(1 + (g - empTrend) / 100, dt));
    const businesses = (revenueBn * 1000) / (revPerBiz26 * Math.pow(1 + (g - bizTrend) / 100, dt));
    points.push({
      year,
      revenueBn: round(revenueBn, 2),
      profitBn: round((revenueBn * margin) / 100, 2),
      employees: Math.round(employees),
      businesses: Math.round(businesses),
      wagesBn: round((revenueBn * wageShare) / 100, 2),
      forecast: year > BASE_YEAR,
      source: "placeholder",
    });
  }
  return points;
}

/** Normalise raw weights so they sum to `total`, rounded to 1 dp. */
function normalise(weights: number[], total = 100): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const out = weights.map((w) => round((w / sum) * total, 1));
  out[0] = round(out[0] + (total - out.reduce((a, b) => a + b, 0)), 1);
  return out;
}

const PRODUCT_SEGMENTS: Record<string, string[]> = {
  A: ["Crops", "Livestock & animal products", "Support services", "Other"],
  B: ["Aggregates & construction minerals", "Energy minerals", "Industrial minerals", "Support services"],
  C: ["Core products", "Intermediate goods", "Contract manufacturing", "Spare parts & services"],
  D: ["Electricity generation", "Distribution & supply", "Gas & heat", "Other"],
  E: ["Water supply", "Wastewater", "Waste collection", "Recycling & recovery"],
  F: ["Residential", "Commercial", "Infrastructure", "Renovation & fit-out"],
  G: ["Food & everyday goods", "Durables", "Fuel & automotive", "Other"],
  H: ["Freight", "Passenger", "Logistics & storage", "Courier & parcel"],
  I: ["Accommodation", "Food service", "Events & catering", "Other"],
  J: ["Software & services", "Connectivity", "Content & media", "Data & hosting"],
  K: ["Lending", "Deposits & payments", "Insurance", "Asset management"],
  L: ["Residential", "Commercial", "Brokerage & management", "Land"],
  M: ["Consulting", "Engineering & design", "Research & testing", "Other services"],
  N: ["Staffing", "Facility services", "Business support", "Travel & other"],
  O: ["Administration", "Defence & security", "Social security", "Other"],
  P: ["Primary & secondary", "Vocational", "Higher education", "Adult & other"],
  Q: ["Hospital care", "Outpatient care", "Residential care", "Social services"],
  R: ["Arts & culture", "Sports", "Gaming & betting", "Recreation"],
  S: ["Personal services", "Repair services", "Membership", "Other"],
  T: ["Domestic services", "Own-use production", "Other", "Care"],
  U: ["Diplomatic", "International bodies", "Other", "Support"],
};

const MARKET_SEGMENTS = ["Domestic businesses", "Households", "Exports to EU", "Exports outside EU", "Government"];

export function placeholderProducts(div: Division, sec: Section, revenueBn: number): Segment[] {
  const rng = createRng(`products:${div.code}`);
  const names = PRODUCT_SEGMENTS[sec.code] ?? PRODUCT_SEGMENTS.C;
  const shares = normalise(names.map((_, i) => rng.range(0.3, 1) * (i === 0 ? 2.4 : i === 1 ? 1.5 : 0.7)))
    .sort((a, b) => b - a);
  return names.map((name, i) => ({ name, share: shares[i], valueBn: round((revenueBn * shares[i]) / 100, 2) }));
}

export function placeholderMarkets(div: Division, sec: Section, revenueBn: number): Segment[] {
  const rng = createRng(`markets:${div.code}`);
  const exportHeavy = sec.code === "C" || sec.code === "B";
  const w = MARKET_SEGMENTS.map((_, i) => {
    const base = [1.4, 1, exportHeavy ? 1.8 : 0.35, exportHeavy ? 0.9 : 0.15, 0.4][i];
    return base * rng.range(0.6, 1.4);
  });
  const shares = normalise(w);
  return MARKET_SEGMENTS.map((name, i) => ({ name, share: shares[i], valueBn: round((revenueBn * shares[i]) / 100, 2) }));
}

const NUTS2: [string, string, number][] = [
  ["Budapest", "HU11", 34],
  ["Pest", "HU12", 12],
  ["Central Transdanubia", "HU21", 10],
  ["Western Transdanubia", "HU22", 9],
  ["Southern Transdanubia", "HU23", 6],
  ["Northern Hungary", "HU31", 8],
  ["Northern Great Plain", "HU32", 10],
  ["Southern Great Plain", "HU33", 11],
];

export function placeholderRegions(div: Division, sec: Section): Region[] {
  const rng = createRng(`regions:${div.code}`);
  const rural = sec.code === "A" || sec.code === "B" || sec.code === "C";
  const w = NUTS2.map(([, nuts, base]) => {
    const tilt = rural && nuts !== "HU11" ? 1.25 : !rural && nuts === "HU11" ? 1.4 : 1;
    return base * tilt * rng.range(0.65, 1.35);
  });
  const rev = normalise(w);
  const biz = normalise(w.map((x) => x * rng.range(0.85, 1.15)));
  return NUTS2.map(([name, nuts], i) => ({ name, nuts, share: rev[i], businessShare: biz[i] }));
}

const LEVELS: Level[] = ["Low", "Moderate", "High"];
const TRENDS: Exclude<Trend, null>[] = ["Steady", "Increasing", "Decreasing"];

export function placeholderStructure(div: Division): Characteristic[] {
  const rng = createRng(`structure:${div.code}`);
  const lvl = () => rng.pick(LEVELS);
  const trend = (): Trend => (rng.next() < 0.75 ? rng.pick(TRENDS) : null);
  const lifeCycle: Level = rng.pick<Level>(["Growth", "Mature", "Mature", "Decline"]);
  return [
    { name: "Concentration", level: lvl(), trend: null },
    { name: "Barriers to Entry", level: lvl(), trend: trend() },
    { name: "Regulation and Policy", level: lvl(), trend: trend() },
    { name: "Life Cycle", level: lifeCycle, trend: null },
    { name: "Revenue Volatility", level: lvl(), trend: null },
    { name: "Assistance", level: lvl(), trend: trend() },
    { name: "Competition", level: lvl(), trend: trend() },
    { name: "Innovation", level: lvl(), trend: null },
  ];
}

const NAME_PREFIX = ["Alföld", "Duna", "Tisza", "Balaton", "Mátra", "Bakony", "Pannon", "Kárpát", "Hajdú", "Zemplén", "Dráva", "Szigetköz", "Tokaj", "Börzsöny"];
const NAME_WORD = ["Holding", "Group", "Invest", "Partners", "Systems", "Works", "Solutions", "Trade"];
const LEGAL = ["Zrt.", "Kft.", "Nyrt."];

export function placeholderCompanies(div: Division, sec: Section, revenueBn: number, employees: number, concentration: Level): Company[] {
  const rng = createRng(`companies:${div.code}`);
  const total = concentration === "High" ? rng.range(55, 75) : concentration === "Moderate" ? rng.range(32, 50) : rng.range(12, 26);
  const n = 6;
  const weights = Array.from({ length: n }, (_, i) => Math.pow(0.68, i) * rng.range(0.8, 1.2));
  const shares = normalise(weights, total);
  const used = new Set<string>();
  return shares.map((share) => {
    let name = "";
    do {
      name = `${rng.pick(NAME_PREFIX)} ${rng.pick(NAME_WORD)} ${rng.pick(LEGAL)}`;
    } while (used.has(name));
    used.add(name);
    return {
      name,
      share,
      revenueBn: round((revenueBn * share) / 100, 1),
      employees: Math.round((employees * share * rng.range(0.5, 1.1)) / 100),
    };
  });
}

export function placeholderCosts(div: Division, sec: Section, wageShare: number, margin: number): CostLine[] {
  const rng = createRng(`costs:${div.code}`);
  const [wMin, wMax] = sec.profile.wageShare;
  const [mMin, mMax] = sec.profile.margin;
  const avgWage = (wMin + wMax) / 2;
  const avgMargin = (mMin + mMax) / 2;
  const build = (wage: number, profit: number) => {
    const rest = 100 - wage - profit;
    const w = [rng.range(0.9, 1.4) * 3.2, rng.range(0.8, 1.2) * 0.45, rng.range(0.6, 1.2) * 0.35, rng.range(0.6, 1.4) * 0.5, rng.range(0.6, 1.6) * 0.8];
    const sh = normalise(w, rest);
    return [wage, sh[0], sh[1], sh[2], sh[3], sh[4], profit].map((v) => round(v, 1));
  };
  const names = ["Wages", "Purchases", "Depreciation", "Marketing", "Rent & utilities", "Other", "Profit"];
  const ind = build(wageShare, margin);
  const avg = build(avgWage, avgMargin);
  return names.map((name, i) => ({ name, industry: ind[i], sectorAvg: avg[i] }));
}

const COUNTRIES = ["Austria", "Slovakia", "Czechia", "Poland", "Romania"];
export function internationalIndustries(div: Division) {
  return COUNTRIES.map((country) => ({ country, name: `${div.shortEn} in ${country}` }));
}

export function pickAnalystLocation(rng: Rng): string {
  return rng.pick(["Budapest", "Debrecen", "Szeged", "Győr"]);
}
