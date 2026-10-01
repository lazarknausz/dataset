import Link from "next/link";
import { DIVISIONS } from "@/data/divisions";
import { SECTIONS } from "@/data/sections";
import { buildReport } from "@/lib/report";
import { formatCount, formatHuf } from "@/lib/format";
import { Card } from "@/components/ui/Card";

function totals() {
  const reports = DIVISIONS.map((d) => buildReport(d.code));
  const cur = (r: ReturnType<typeof buildReport>) => r.series.find((p) => p.year === 2026)!;
  const sum = (f: (p: ReturnType<typeof cur>) => number) => reports.reduce((a, r) => a + f(cur(r)), 0);
  const rev = sum((p) => p.revenueBn);
  return {
    rev, profit: sum((p) => p.profitBn), emp: sum((p) => p.employees), biz: sum((p) => p.businesses),
    top: reports.map((r) => ({ r, rev: cur(r).revenueBn })).sort((a, b) => b.rev - a.rev).slice(0, 6),
  };
}

export default function Home() {
  const t = totals();
  const count = (code: string) => DIVISIONS.filter((d) => d.section === code).length;
  return (
    <main>
      <section className="bg-brand text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-bold uppercase tracking-widest text-white/70">🇭🇺 Hungary-only industry research</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">Understand every Hungarian industry in depth.</h1>
          <p className="mt-5 max-w-2xl text-lg text-white/80">Revenue, profit, employment, competition and outlook for all 88 TEÁOR divisions — one report per industry.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/industries/" className="rounded-full bg-white px-6 py-3 font-bold text-brand hover:bg-white/90">Browse all industries</Link>
            <Link href="/industries/10/" className="rounded-full border border-white/40 px-6 py-3 font-bold hover:bg-white/10">See a sample report</Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-bold">Hungary at a glance <span className="ml-2 align-middle text-sm font-semibold text-muted">2026 estimate · sum of 88 divisions · placeholder data</span></h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[["Industry revenue", formatHuf(t.rev)], ["Industry profit", formatHuf(t.profit)], ["Employees", formatCount(t.emp)], ["Businesses", formatCount(t.biz)]].map(([k, v]) => (
            <Card key={k}><p className="text-sm font-semibold text-ink2">{k}</p><p className="mt-1 text-3xl font-bold tracking-tight">{v}</p></Card>
          ))}
        </div>

        <h2 className="mt-14 text-2xl font-bold">Largest industries by revenue</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {t.top.map(({ r, rev }) => (
            <li key={r.division.code}>
              <Link href={`/industries/${r.division.code}/`} className="block rounded-xl border border-line bg-surface p-4 hover:border-accent">
                <span className="text-xs font-bold text-muted">{r.division.code} · {r.section.nameEn}</span>
                <span className="mt-1 block font-bold">{r.title}</span>
                <span className="mt-1 block text-sm text-ink2">{formatHuf(rev)} revenue</span>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mt-14 text-2xl font-bold">Browse by sector</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => (
            <li key={s.code}>
              <Link href={`/sections/${s.code}/`} className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-4 hover:border-accent">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft font-bold text-accent">{s.code}</span>
                <span><span className="block font-bold">{s.nameEn}</span><span className="block text-sm text-ink2">{s.nameHu}</span><span className="mt-1 block text-xs text-muted">{count(s.code)} {count(s.code) === 1 ? "industry" : "industries"}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
