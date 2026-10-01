/**
 * Pull Hungarian structural business statistics from Eurostat and write
 * src/data/generated/eurostat-hu.json (division code -> metric -> year -> value).
 *
 * Usage:   npm run data:fetch
 * Needs:   outbound HTTPS to ec.europa.eu. Behind an HTTP proxy run with NODE_USE_ENV_PROXY=1.
 * On any network/parse failure the script exits non-zero and leaves the existing snapshot untouched.
 * Coverage: SBS covers sections B–N (and parts of P–S). Divisions Eurostat only publishes in
 *           combined groups (e.g. J62_J63) are skipped and keep their placeholders.
 */
import { writeFileSync } from "node:fs";
import { DIVISIONS } from "../src/data/divisions";
import type { EurostatSnapshot } from "../src/lib/types";
import { collect, eurostatNace, findIndicators, rates, type JsonStat } from "./eurostat-parse";

const BASE = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data";
const OUT = new URL("../src/data/generated/eurostat-hu.json", import.meta.url);
const DATASETS = ["sbs_ovw_act", "sbs_na_sca_r2"]; // 2021+ and 2008–2020

async function get(dataset: string, query: string): Promise<JsonStat> {
  const url = `${BASE}/${dataset}?format=JSON&lang=EN&${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return (await res.json()) as JsonStat;
}

async function main() {
  const snapshot: EurostatSnapshot = {};
  const fx = (await get("ert_bil_eur_a", "currency=HUF&statinfo=AVG")) as JsonStat;
  const eurHuf = rates(fx);
  if (!Object.keys(eurHuf).length) throw new Error("No EUR/HUF rates returned");

  for (const dataset of DATASETS) {
    const probe = await get(dataset, "geo=HU&nace_r2=C10&time=2021");
    const ind = findIndicators(probe);
    console.log(`${dataset}: indicators`, ind);

    const pull = async (code: string | undefined, unit: string[]) =>
      code ? collect(await get(dataset, `geo=HU&indic_sb=${code}`), { unit }) : {};
    const [ent, turn, emp, pers, va] = await Promise.all([
      pull(ind.enterprises, ["NR"]), pull(ind.turnover, ["MIO_EUR"]), pull(ind.employees, ["NR"]),
      pull(ind.personnelCosts, ["MIO_EUR"]), pull(ind.valueAdded, ["MIO_EUR"]),
    ]);

    const toBn = (series: Record<string, number> | undefined) =>
      series && Object.fromEntries(Object.entries(series).filter(([y]) => eurHuf[y]).map(([y, v]) => [y, Math.round(v * eurHuf[y]) / 1000]));

    for (const d of DIVISIONS) {
      const nace = eurostatNace(d.code, d.section);
      const entry = (snapshot[d.code] ??= {});
      const merge = (key: keyof typeof entry, data?: Record<string, number>) => {
        if (data && Object.keys(data).length) entry[key] = { ...(entry[key] ?? {}), ...data };
      };
      merge("enterprises", ent[nace]);
      merge("employees", emp[nace]);
      merge("turnoverBn", toBn(turn[nace])); // MIO_EUR × HUF/EUR = HUF m → /1000 = HUF bn
      merge("personnelCostsBn", toBn(pers[nace]));
      merge("valueAddedBn", toBn(va[nace]));
    }
  }

  for (const k of Object.keys(snapshot)) if (!Object.keys(snapshot[k]).length) delete snapshot[k];
  writeFileSync(OUT, JSON.stringify(snapshot, null, 1) + "\n");
  console.log(`Wrote ${Object.keys(snapshot).length} divisions to ${OUT.pathname}`);
}

main().catch((err) => {
  console.error("\nEurostat fetch failed — existing snapshot left untouched.\n", err.message ?? err);
  console.error("If the host is blocked, allow ec.europa.eu in the environment's network settings.");
  process.exit(1);
});
