"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export interface ExplorerItem {
  code: string; section: string; sectionName: string; nameEn: string; nameHu: string; shortEn: string;
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function IndustryExplorer({ items, sections, initialSection = "" }: { items: ExplorerItem[]; sections: { code: string; name: string }[]; initialSection?: string }) {
  const [q, setQ] = useState("");
  const [sec, setSec] = useState(initialSection);
  const results = useMemo(() => {
    const n = norm(q.trim());
    return items.filter((i) => (!sec || i.section === sec) && (!n || norm(`${i.code} ${i.nameEn} ${i.nameHu} ${i.shortEn}`).includes(n)));
  }, [q, sec, items]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search industries</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name (English or Hungarian) or TEÁOR code…"
            className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink placeholder:text-muted focus:outline-2 focus:outline-accent"
          />
        </label>
        <label>
          <span className="sr-only">Filter by section</span>
          <select value={sec} onChange={(e) => setSec(e.target.value)} className="w-full rounded-lg border border-line bg-surface px-4 py-3 text-ink sm:w-80">
            <option value="">All sections</option>
            {sections.map((s) => <option key={s.code} value={s.code}>{s.code} — {s.name}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-4 text-sm text-muted" aria-live="polite">{results.length} of {items.length} industries</p>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((i) => (
          <li key={i.code}>
            <Link href={`/industries/${i.code}/`} className="block h-full rounded-xl border border-line bg-surface p-4 hover:border-accent">
              <span className="flex items-center gap-2 text-xs font-bold text-muted"><span className="rounded bg-surface2 px-1.5 py-0.5 text-ink">{i.code}</span>{i.section} · {i.sectionName}</span>
              <span className="mt-2 block font-bold text-ink">{i.shortEn} in Hungary</span>
              <span className="mt-1 block text-sm text-ink2">{i.nameHu}</span>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="mt-8 text-center text-ink2">No industries match your search.</p>}
    </div>
  );
}
