"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { CHAPTERS } from "./chapters";

export function ReportSidebar() {
  const [active, setActive] = useState<string>(CHAPTERS[0].id);

  useEffect(() => {
    const els = CHAPTERS.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <nav aria-label="Report chapters" className="no-print sticky top-20 hidden max-h-[calc(100vh-6rem)] w-60 shrink-0 overflow-y-auto lg:block">
      <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-muted">Industry Report</p>
      <ul className="space-y-0.5 rounded-xl border border-line bg-surface p-2">
        {CHAPTERS.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={active === c.id ? "true" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold ${active === c.id ? "bg-accent-soft text-accent" : "text-ink2 hover:bg-surface2"}`}
            >
              <Icon name={c.icon} size={18} />
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
