import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DIVISIONS } from "@/data/divisions";
import { SECTIONS, SECTION_BY_CODE } from "@/data/sections";
import { buildReport } from "@/lib/report";
import { formatCount, formatHuf } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { ChangePill } from "@/components/ui/Pill";

export const dynamicParams = false;
export const generateStaticParams = () => SECTIONS.map((s) => ({ section: s.code }));

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const { section } = await params;
  const s = SECTION_BY_CODE[section];
  return s ? { title: `${s.nameEn} in Hungary` } : {};
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const sec = SECTION_BY_CODE[section];
  if (!sec) notFound();
  const reports = DIVISIONS.filter((d) => d.section === section).map((d) => buildReport(d.code));
  const at = (r: (typeof reports)[number], y: number) => r.series.find((p) => p.year === y)!;
  const sum = (y: number, f: (p: ReturnType<typeof at>) => number) => reports.reduce((a, r) => a + f(at(r, y)), 0);
  const rev26 = sum(2026, (p) => p.revenueBn), rev21 = sum(2021, (p) => p.revenueBn);
  const growth = (Math.pow(rev26 / rev21, 1 / 5) - 1) * 100;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <nav className="mb-4 flex flex-wrap gap-2 text-sm font-semibold text-accent" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link><span aria-hidden className="text-muted">›</span><span>Section {sec.code}</span>
      </nav>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{sec.nameEn} in Hungary</h1>
      <p className="mt-2 text-lg text-ink2">{sec.nameHu}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><p className="text-sm font-semibold text-ink2">Revenue</p><p className="mt-1 text-3xl font-bold">{formatHuf(rev26)}</p><div className="mt-2"><ChangePill value={growth} /> <span className="text-xs text-muted">&apos;21–&apos;26</span></div></Card>
        <Card><p className="text-sm font-semibold text-ink2">Profit</p><p className="mt-1 text-3xl font-bold">{formatHuf(sum(2026, (p) => p.profitBn))}</p></Card>
        <Card><p className="text-sm font-semibold text-ink2">Employees</p><p className="mt-1 text-3xl font-bold">{formatCount(sum(2026, (p) => p.employees))}</p></Card>
        <Card><p className="text-sm font-semibold text-ink2">Businesses</p><p className="mt-1 text-3xl font-bold">{formatCount(sum(2026, (p) => p.businesses))}</p></Card>
      </div>
      <p className="mt-2 text-xs text-muted">2026 estimate; placeholder values unless a report shows an Eurostat badge.</p>

      <h2 className="mt-10 mb-3 text-2xl font-bold">Industries in this section</h2>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <li key={r.division.code}>
            <Link href={`/industries/${r.division.code}/`} className="block h-full rounded-xl border border-line bg-surface p-4 hover:border-accent">
              <span className="text-xs font-bold text-muted">{r.division.code}</span>
              <span className="mt-1 block font-bold">{r.title}</span>
              <span className="block text-sm text-ink2">{r.division.nameHu}</span>
              <span className="mt-2 block text-sm text-ink2">{formatHuf(at(r, 2026).revenueBn)} revenue</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 mb-3 text-2xl font-bold">Other sections</h2>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <Link key={s.code} href={`/sections/${s.code}/`} title={s.nameEn} className={`grid h-10 w-10 place-items-center rounded-lg border font-bold ${s.code === section ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface text-ink2 hover:border-accent"}`}>{s.code}</Link>
        ))}
      </div>
    </main>
  );
}
