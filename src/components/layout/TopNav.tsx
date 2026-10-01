import Link from "next/link";

const LINKS = [
  { href: "/industries/", label: "Industries" },
  { href: "/sections/A/", label: "Sectors" },
  { href: "/data/", label: "Data & Methodology" },
  { href: "/about/", label: "About" },
];

export function TopNav() {
  return (
    <header className="no-print sticky top-0 z-40 bg-brand text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span aria-hidden className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-sm">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
            </svg>
          </span>
          <span>Depth<span className="font-light">Analysis</span></span>
        </Link>
        <nav className="ml-2 hidden gap-6 text-sm font-semibold sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-white/85 hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/industries/"
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <span className="hidden sm:inline">Search industries</span>
        </Link>
      </div>
      <nav className="flex gap-5 overflow-x-auto border-t border-white/10 px-4 py-2 text-sm font-semibold sm:hidden">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap text-white/85">{l.label}</Link>
        ))}
      </nav>
    </header>
  );
}
