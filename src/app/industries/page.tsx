import type { Metadata } from "next";
import { IndustryExplorer } from "@/components/IndustryExplorer";
import { EXPLORER_ITEMS, EXPLORER_SECTIONS } from "@/lib/explorer";

export const metadata: Metadata = { title: "All Hungarian Industries" };

export default function IndustriesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Hungarian industries</h1>
      <p className="mt-2 mb-8 max-w-2xl text-ink2">Every TEÁOR&apos;08 division of the Hungarian economy, with its own industry report.</p>
      <IndustryExplorer items={EXPLORER_ITEMS} sections={EXPLORER_SECTIONS} />
    </main>
  );
}
