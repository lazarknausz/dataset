import Link from "next/link";
import { Card, ChapterHeading } from "@/components/ui/Card";
import { ChangePill, Pill, levelTone, trendTone } from "@/components/ui/Pill";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Icon } from "@/components/ui/Icon";
import { Donut } from "@/components/charts/Donut";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { ProfitChart } from "@/components/charts/ProfitChart";
import { RegionBars } from "@/components/charts/RegionBars";
import { CostBars } from "@/components/charts/CostBars";
import { DIVISION_BY_CODE } from "@/data/divisions";
import { formatCount, formatHuf } from "@/lib/format";
import type { IndustryReport, Kpi } from "@/lib/types";
import { CHAPTERS } from "./chapters";
import { Tabs } from "./Tabs";

const chapter = (id: string) => CHAPTERS.find((c) => c.id === id)!;
const Head = ({ id }: { id: string }) => <ChapterHeading id={id} icon={<Icon name={chapter(id).icon} size={26} />}>{chapter(id).label}</ChapterHeading>;

function kpiValue(k: Kpi): string {
  if (k.unit === "HUF bn") return formatHuf(k.value);
  if (k.unit === "%") return `${k.value.toFixed(1)}%`;
  return formatCount(k.value);
}

function DomesticList({ title, codes }: { title: string; codes: string[] }) {
  return (
    <div className="mt-5 first:mt-0">
      <h4 className="mb-1 text-lg font-bold">{title}</h4>
      <ul className="divide-y divide-line">
        {codes.map((c) => {
          const d = DIVISION_BY_CODE[c];
          return (
            <li key={c}>
              <Link href={`/industries/${c}/`} className="flex items-center justify-between py-3 text-ink hover:text-accent">
                <span>{d.shortEn} in Hungary <span className="ml-2 text-sm text-muted">{d.nameHu}</span></span>
                <span aria-hidden className="text-muted">›</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function AboutSection({ r }: { r: IndustryReport }) {
  const { division: d } = r;
  return (
    <section>
      <Head id="about" />
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <Card title="Definition"><p className="leading-7 text-ink2">{r.definition}</p></Card>
          <Card title="What's Included">
            <ul className="space-y-3">
              {r.included.map((t) => (
                <li key={t} className="flex gap-3 text-ink2"><span aria-hidden className="font-bold text-pos">✓</span>{t}</li>
              ))}
            </ul>
          </Card>
          <Card title={<>Companies <span className="ml-2 rounded-md bg-info-soft px-2 py-0.5 text-sm text-info">{r.companies.length}</span></>}>
            <p className="text-sm text-muted">Top players are listed in the <a className="text-accent underline" href="#companies">Companies</a> chapter. Names are fictional placeholders.</p>
          </Card>
          <Card title="Related Industries">
            <Tabs
              tabs={[
                { label: "Domestic industries", content: <><DomesticList title="Competitors" codes={d.competitors} /><DomesticList title="Complementors" codes={d.complementors} /></> },
                { label: "International industries", content: (
                  <ul className="divide-y divide-line">
                    {r.international.map((x) => <li key={x.country} className="flex justify-between py-3 text-ink2"><span>{x.name}</span><span className="text-sm text-muted">{x.country}</span></li>)}
                  </ul>
                ) },
              ]}
            />
          </Card>
          <Card title="Additional Resources">
            <ul className="divide-y divide-line text-ink">
              {[
                ["Hungarian Central Statistical Office (KSH)", "https://www.ksh.hu"],
                ["Eurostat — Structural Business Statistics", "https://ec.europa.eu/eurostat/web/structural-business-statistics"],
                ["Magyar Nemzeti Bank (MNB)", "https://www.mnb.hu"],
                ["Hungarian Chamber of Commerce and Industry (MKIK)", "https://mkik.hu"],
              ].map(([n, u]) => <li key={u}><a className="block py-3 hover:text-accent" href={u} target="_blank" rel="noreferrer">{n} ↗</a></li>)}
            </ul>
          </Card>
        </div>
        <div className="space-y-5">
          <Card title="Codes">
            <dl className="space-y-4 text-sm">
              <div><dt className="text-muted">TEÁOR&apos;08 / NACE Rev.2 division</dt><dd className="mt-1 text-base font-bold">{d.code}</dd><dd className="text-ink2">{d.nameHu}</dd></div>
              <div><dt className="text-muted">Section</dt><dd className="mt-1 font-bold">{r.section.code} — {r.section.nameEn}</dd></div>
              <div><dt className="text-muted">English title</dt><dd className="mt-1 text-ink2">{d.nameEn}</dd></div>
            </dl>
          </Card>
          <Card title="Related Terms">
            <dl className="space-y-5">
              {r.terms.map((t) => (
                <div key={t.term}><dt className="text-xs font-bold uppercase tracking-wide text-ink">{t.term}</dt><dd className="mt-1 text-sm text-ink2">{t.description}</dd></div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function GlanceSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="glance" />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <Card title="Key Takeaways">
          <h4 className="mb-2 text-lg font-bold">Performance</h4>
          <div className="space-y-3 leading-7 text-ink2">{r.takeaways.performance.map((t) => <p key={t}>{t}</p>)}</div>
          <a href="#performance" className="mt-3 inline-block font-semibold text-accent underline">Go to chapter</a>
          <h4 className="mb-2 mt-8 text-lg font-bold">Products and Markets</h4>
          <div className="space-y-3 leading-7 text-ink2">{r.takeaways.markets.map((t) => <p key={t}>{t}</p>)}</div>
          <a href="#products" className="mt-3 inline-block font-semibold text-accent underline">Go to chapter</a>
        </Card>
        <Card className="h-fit">
          <ul className="divide-y divide-line">
            {r.kpis.map((k) => (
              <li key={k.key} className="py-4 first:pt-0">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold">{k.label}</span>
                  <div className="flex flex-col items-end gap-1 text-xs text-ink2">
                    <span className="flex items-center gap-2">&apos;21–&apos;26 <ChangePill value={k.cagrHistoric} unit={k.key === "margin" ? "pp" : "%"} goodWhenUp /></span>
                    {k.cagrForecast !== undefined && <span className="flex items-center gap-2">&apos;26–&apos;31 <ChangePill value={k.cagrForecast} /></span>}
                  </div>
                </div>
                <p className="mt-1 text-3xl font-bold tracking-tight">{kpiValue(k)}</p>
                <div className="mt-1"><SourceBadge source={k.source} year={k.year} /></div>
              </li>
            ))}
          </ul>
          <p className="mt-2 rounded-lg bg-info-soft p-3 text-sm text-info">Five-year growth rates display historic and forecast CAGRs. Values are in forints (HUF).</p>
        </Card>
      </div>
    </section>
  );
}

export function PerformanceSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="performance" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Revenue (HUF bn)"><RevenueChart series={r.series} /></Card>
        <Card title="Profit (HUF bn)"><ProfitChart series={r.series} /></Card>
      </div>
    </section>
  );
}

export function ProductsSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="products" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Products and Services"><Donut segments={r.products} label={`Revenue by product segment, ${r.title}`} /></Card>
        <Card title="Major Markets"><Donut segments={r.markets} label={`Revenue by market, ${r.title}`} /></Card>
      </div>
    </section>
  );
}

export function GeographySection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="geography" />
      <Card title="Share by NUTS-2 region">
        <RegionBars regions={r.regions} />
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-semibold text-accent">View as table</summary>
          <table className="mt-3 w-full text-left">
            <thead><tr className="border-b border-line text-muted"><th className="py-2">Region</th><th>NUTS</th><th className="text-right">Revenue</th><th className="text-right">Businesses</th></tr></thead>
            <tbody>{r.regions.map((g) => <tr key={g.nuts} className="border-b border-line"><td className="py-2">{g.name}</td><td>{g.nuts}</td><td className="text-right">{g.share.toFixed(1)}%</td><td className="text-right">{g.businessShare.toFixed(1)}%</td></tr>)}</tbody>
          </table>
        </details>
      </Card>
    </section>
  );
}

export function ForcesSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="forces" />
      <Card title="Industry Structure">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead><tr className="bg-surface2 text-ink"><th className="rounded-l-lg px-3 py-2">Characteristic</th><th className="px-3 py-2">Level</th><th className="rounded-r-lg px-3 py-2">Trend</th></tr></thead>
          <tbody>
            {r.structure.map((c) => (
              <tr key={c.name} className="border-b border-line last:border-0">
                <td className="px-3 py-3 underline decoration-line underline-offset-4">{c.name}</td>
                <td className="px-3 py-3"><Pill tone={levelTone(c.name, c.level)}>{c.level}</Pill></td>
                <td className="px-3 py-3">{c.trend && <Pill tone={trendTone(c.trend)}>{c.trend}</Pill>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </section>
  );
}

export function CompaniesSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="companies" />
      <Card title="Major Players" action={<Pill tone="gray">Fictional placeholders</Pill>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead><tr className="bg-surface2"><th className="rounded-l-lg px-3 py-2">Company</th><th className="px-3 py-2 text-right">Market share</th><th className="px-3 py-2 text-right">Revenue</th><th className="rounded-r-lg px-3 py-2 text-right">Employees</th></tr></thead>
            <tbody>
              {r.companies.map((c) => (
                <tr key={c.name} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 font-semibold">{c.name}</td>
                  <td className="px-3 py-3 text-right">{c.share.toFixed(1)}%</td>
                  <td className="px-3 py-3 text-right">{formatHuf(c.revenueBn)}</td>
                  <td className="px-3 py-3 text-right">{formatCount(c.employees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

export function ExternalSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="external" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Key External Drivers">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead><tr className="bg-surface2"><th className="rounded-l-lg px-3 py-2">Driver</th><th className="rounded-r-lg px-3 py-2 text-right">Impact</th></tr></thead>
            <tbody>
              {r.drivers.map((d) => (
                <tr key={d.name} className="border-b border-line last:border-0">
                  <td className="px-3 py-3 underline decoration-line underline-offset-4">{d.name}</td>
                  <td className="px-3 py-3 text-right"><Pill tone={d.impact === "Positive" ? "green" : "red"}>{d.impact === "Positive" ? "▲ " : "▼ "}{d.impact}</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
        <Card title="SWOT">
          {([["Strengths", r.swot.strengths], ["Weaknesses", r.swot.weaknesses], ["Opportunities", r.swot.opportunities], ["Threats", r.swot.threats]] as const).map(([h, items]) => (
            <div key={h} className="mb-5 last:mb-0">
              <div className="flex items-center gap-3">
                <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">{h[0]}</span>
                <h4 className="text-lg font-bold">{h}</h4>
              </div>
              <ul className="mt-2 divide-y divide-line pl-12 text-sm text-ink2">
                {items.map((t) => <li key={t} className="py-2">{t}</li>)}
              </ul>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}

export function FinancialSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="financial" />
      <Card title="Cost structure vs. sector average"><CostBars costs={r.costs} sectionName={r.section.nameEn} /></Card>
    </section>
  );
}

export function StatisticsSection({ r }: { r: IndustryReport }) {
  return (
    <section>
      <Head id="statistics" />
      <Card title="Key Statistics">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-right text-sm">
            <thead><tr className="bg-surface2"><th className="rounded-l-lg px-3 py-2 text-left">Year</th><th className="px-3 py-2">Revenue</th><th className="px-3 py-2">Profit</th><th className="px-3 py-2">Wages</th><th className="px-3 py-2">Employees</th><th className="rounded-r-lg px-3 py-2">Businesses</th></tr></thead>
            <tbody>
              {r.series.map((p) => (
                <tr key={p.year} className={`border-b border-line last:border-0 ${p.forecast ? "text-muted" : ""}`}>
                  <td className="px-3 py-2 text-left font-semibold">{p.year}{p.forecast && " (f)"}{p.source !== "placeholder" && <span className="ml-2 align-middle"><SourceBadge source={p.source} /></span>}</td>
                  <td className="px-3 py-2">{formatHuf(p.revenueBn)}</td>
                  <td className="px-3 py-2">{formatHuf(p.profitBn)}</td>
                  <td className="px-3 py-2">{formatHuf(p.wagesBn)}</td>
                  <td className="px-3 py-2">{formatCount(p.employees)}</td>
                  <td className="px-3 py-2">{formatCount(p.businesses)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted">(f) = forecast. Values are in forints; years without a source badge are estimates.</p>
      </Card>
    </section>
  );
}
