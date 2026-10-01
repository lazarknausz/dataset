import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Data & Methodology" };

const ROWS = [
  ["Revenue (net turnover)", "Eurostat SBS (sbs_ovw_act, sbs_na_sca_r2)", "Sections B–N, parts of P–S", "Estimate"],
  ["Employees (persons employed)", "Eurostat SBS", "Sections B–N, parts of P–S", "Estimate"],
  ["Businesses (enterprises)", "Eurostat SBS", "Sections B–N, parts of P–S", "Estimate"],
  ["Wages (personnel costs)", "Eurostat SBS", "Sections B–N, parts of P–S", "Estimate"],
  ["Profit", "Derived: value added − personnel costs", "Sections B–N, parts of P–S", "Estimate"],
  ["Regional split", "KSH STADAT (planned)", "—", "Estimate"],
  ["Companies, SWOT, drivers, forecasts", "DepthAnalysis editorial placeholders", "—", "Estimate"],
];

export default function DataPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Data &amp; methodology</h1>
      <p className="mt-3 text-ink2">DepthAnalysis covers the Hungarian economy only, using the TEÁOR&apos;08 classification — the Hungarian edition of NACE Rev.2 — at 2-digit division level (88 divisions in 21 sections).</p>

      <Card title="Current status" className="mt-8">
        <p className="text-ink2">This build ships with <strong>placeholder values</strong>. They are generated deterministically for each division and scaled by a per-section profile, so figures look plausible but are not real market data. Company names are fictional.</p>
        <p className="mt-3 text-ink2">Every number carries a source badge. When real statistics are loaded, the badge changes from <em>Estimate</em> to <em>Eurostat SBS</em> and the 2026 estimate and forecasts are re-anchored on the latest actual year.</p>
      </Card>

      <Card title="Metric coverage" className="mt-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead><tr className="bg-surface2"><th className="rounded-l-lg px-3 py-2">Metric</th><th className="px-3 py-2">Real source</th><th className="px-3 py-2">Coverage</th><th className="rounded-r-lg px-3 py-2">Now</th></tr></thead>
            <tbody>{ROWS.map((r) => <tr key={r[0]} className="border-b border-line last:border-0">{r.map((c, i) => <td key={i} className="px-3 py-3">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </Card>

      <Card title="Refreshing with real data" className="mt-5">
        <p className="text-ink2">Run <code className="rounded bg-surface2 px-1.5 py-0.5">npm run data:fetch</code> to pull Hungarian structural business statistics from Eurostat into <code className="rounded bg-surface2 px-1.5 py-0.5">src/data/generated/eurostat-hu.json</code>, then rebuild. The host <code>ec.europa.eu</code> must be reachable.</p>
      </Card>
    </main>
  );
}
