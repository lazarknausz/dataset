"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const btn = "grid h-10 w-10 place-items-center rounded-lg text-ink2 hover:bg-surface2";

export function RightRail() {
  return (
    <div className="no-print sticky top-20 hidden h-fit flex-col gap-2 rounded-xl border border-line bg-surface p-1.5 xl:flex">
      <button className={btn} title="Print / save as PDF" aria-label="Print or save as PDF" onClick={() => window.print()}><Icon name="download" /></button>
      <Link className={btn} title="Search industries" aria-label="Search industries" href="/industries/"><Icon name="search" /></Link>
      <button className={btn} title="Back to top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Icon name="up" /></button>
    </div>
  );
}
