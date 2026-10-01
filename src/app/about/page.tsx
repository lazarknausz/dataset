import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">About DepthAnalysis</h1>
      <div className="mt-6 space-y-4 leading-7 text-ink2">
        <p>DepthAnalysis is an industry research site built exclusively for the Hungarian market. Each of the 88 TEÁOR&apos;08 divisions has its own report: definition, key statistics, performance and forecast, products and markets, regional breakdown, competitive forces, major companies, external drivers and SWOT.</p>
        <p>The project is in its early stage. Values you see are placeholders designed to show how the finished reports will read, and are labelled as estimates throughout.</p>
      </div>
    </main>
  );
}
