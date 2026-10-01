import Link from "next/link";

export function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-ink2 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-bold text-ink">DepthAnalysis</p>
          <p className="mt-2 max-w-xs">Industry research for the Hungarian market, organised by TEÁOR&apos;08 / NACE Rev.2.</p>
        </div>
        <div className="space-y-1">
          <p className="font-bold text-ink">Explore</p>
          <Link className="block hover:underline" href="/industries/">All industries</Link>
          <Link className="block hover:underline" href="/data/">Data &amp; methodology</Link>
          <Link className="block hover:underline" href="/about/">About</Link>
        </div>
        <p className="text-muted">
          Revenue, employment, businesses, wages and profit are derived from Eurostat structural business statistics (EUR converted to HUF); regional splits are Eurostat NUTS-2 data. Figures marked &ldquo;Estimate&rdquo; (forecasts, product and market splits, cost mix) are modelled placeholders.
          Company names are fictional.
        </p>
      </div>
    </footer>
  );
}
