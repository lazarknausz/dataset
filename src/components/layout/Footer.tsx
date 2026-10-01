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
          Demonstration build: figures marked &ldquo;Estimate&rdquo; are placeholder values, not real market data.
          Company names are fictional.
        </p>
      </div>
    </footer>
  );
}
