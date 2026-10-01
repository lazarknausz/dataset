import type { Driver } from "@/lib/types";

const P = "Positive" as const;
const N = "Negative" as const;
const d = (name: string, impact: Driver["impact"]): Driver => ({ name, impact });

/** Key external drivers per TEÁOR section (placeholder assessments). */
export const DRIVERS: Record<string, Driver[]> = {
  A: [d("Single Area Payment and EU agricultural subsidies", P), d("World price of grain and oilseeds", P), d("Weather and drought index", N), d("Fertiliser and energy prices", N)],
  B: [d("Domestic demand for construction aggregates", P), d("World commodity prices", P), d("Environmental regulation", N)],
  C: [d("EUR/HUF exchange rate", P), d("German industrial production", P), d("Foreign direct investment inflows", P), d("Industrial energy prices", N), d("Minimum wage and labour costs", N)],
  D: [d("Government renewable energy support (METÁR)", P), d("Wholesale gas price (TTF)", N), d("Household electricity demand", P)],
  E: [d("EU cohesion funds for water infrastructure", P), d("Regulated utility pricing", N), d("Landfill tax and recycling targets", P)],
  F: [d("EU Recovery and Resilience Facility funding", P), d("Mortgage interest rates", N), d("Construction materials prices", N), d("Public investment budget", P)],
  G: [d("Household disposable income", P), d("Consumer price inflation", N), d("Retail margin caps", N), d("Online shopping adoption", P)],
  H: [d("EUR/HUF exchange rate", P), d("Diesel fuel prices", N), d("Domestic goods trade volumes", P), d("Road toll and regulation costs", N)],
  I: [d("International tourist arrivals", P), d("SZÉP Card spending", P), d("Consumer price inflation", N), d("Labour shortage in hospitality", N)],
  J: [d("Business investment in digital transformation", P), d("Nearshoring demand for Hungarian IT talent", P), d("Competition from international platforms", N)],
  K: [d("MNB base rate", P), d("Household credit demand", P), d("Bank special taxes", N), d("Regulatory capital requirements", N)],
  L: [d("Housing subsidy programmes", P), d("Mortgage interest rates", N), d("Foreign investment in Budapest offices", P)],
  M: [d("Corporate demand for consulting and engineering", P), d("EU-funded project pipeline", P), d("Shortage of skilled professionals", N)],
  N: [d("Employment rate and labour shortage", P), d("Minimum wage increases", N), d("Corporate outsourcing trends", P)],
  O: [d("Central government budget balance", N), d("Public sector wage settlements", P), d("EU funds absorption", P)],
  P: [d("Demographic trend (school-age population)", N), d("Government education budget", P), d("Demand for vocational skills", P)],
  Q: [d("Ageing population", P), d("Public healthcare budget", P), d("Healthcare workforce emigration", N)],
  R: [d("Household discretionary spending", P), d("State sports and culture funding", P), d("Gambling regulation", N)],
  S: [d("Household disposable income", P), d("Small-business tax regime changes", N), d("Consumer demand for personal services", P)],
  T: [d("Household income growth", P), d("Undeclared work enforcement", N)],
  U: [d("International diplomatic activity in Budapest", P), d("Host-country agreements", P)],
};
