import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DIVISIONS, DIVISION_BY_CODE } from "@/data/divisions";
import { buildReport } from "@/lib/report";
import { ReportSidebar } from "@/components/report/ReportSidebar";
import { RightRail } from "@/components/report/RightRail";
import { Pill } from "@/components/ui/Pill";
import {
  AboutSection, CompaniesSection, ExternalSection, FinancialSection, ForcesSection, GeographySection,
  GlanceSection, PerformanceSection, ProductsSection, StatisticsSection,
} from "@/components/report/ReportSections";

export const dynamicParams = false;

export function generateStaticParams() {
  return DIVISIONS.map((d) => ({ code: d.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  const d = DIVISION_BY_CODE[code];
  return d ? { title: `${d.shortEn} in Hungary`, description: `Industry report: ${d.nameEn} (TEÁOR ${d.code}) in Hungary.` } : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!DIVISION_BY_CODE[code]) notFound();
  const r = buildReport(code);

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
      <ReportSidebar />
      <main className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-accent">
          <Link href="/" className="hover:underline">Home</Link><span aria-hidden className="text-muted">›</span>
          <Link href="/industries/" className="underline">Hungary</Link><span aria-hidden className="text-muted">›</span>
          <span>{r.division.code} — {r.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-semibold tracking-tight text-ink sm:text-5xl">
            {r.title}
            <span className="flex items-center gap-2 text-sm font-bold text-ink2"><span aria-hidden className="text-2xl">🇭🇺</span>HU {r.division.code}</span>
          </h1>
          <p className="mt-2 text-lg text-ink2">{r.division.nameHu}</p>
          <p className="mt-3 font-bold">{r.analyst}</p>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink2">
            <span>Analyst</span><span aria-hidden>·</span><span>{r.location}</span><span aria-hidden>·</span>
            <span>Published: {r.published}</span>
            <Pill tone="blue">Standard</Pill>
            {!r.hasRealData && <Pill tone="gray">Placeholder data</Pill>}
          </p>
        </header>

        <AboutSection r={r} />
        <GlanceSection r={r} />
        <PerformanceSection r={r} />
        <ProductsSection r={r} />
        <GeographySection r={r} />
        <ForcesSection r={r} />
        <CompaniesSection r={r} />
        <ExternalSection r={r} />
        <FinancialSection r={r} />
        <StatisticsSection r={r} />
      </main>
      <RightRail />
    </div>
  );
}
