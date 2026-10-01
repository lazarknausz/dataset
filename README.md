# DepthAnalysis

Industry research for the **Hungarian market only** — an IBISWorld-style report for each of the 88 TEÁOR'08 (NACE Rev.2)
divisions, grouped into 21 sections (A–U). Built with Next.js (App Router, static export), TypeScript, Tailwind CSS 4 and Recharts.

> **Data status:** all numbers are deterministic *placeholders* (HUF) and company names are fictional. Every figure carries a
> source badge ("Estimate" vs "Eurostat SBS") so real data can replace it without UI changes.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out (116 pages)
npm test           # vitest
npm run lint && npm run typecheck
```

## What's in a report
About This Industry (definition, codes, related terms, related industries) · At a Glance (KPIs with '21–'26 / '26–'31 growth) ·
Performance · Products and Markets · Geographic Breakdown (8 NUTS-2 regions) · Competitive Forces · Companies ·
External Environment (drivers + SWOT) · Financial Benchmarks · Key Statistics.

## Layout
- `src/data/` — sections, divisions (HU/EN names, related industries), glossary, external drivers
- `src/lib/placeholder.ts` — seeded generators; `src/lib/report.ts` — `buildReport(code)` merges real data over placeholders
- `src/data/generated/eurostat-hu.json` — real-data snapshot (currently empty `{}`)
- `scripts/fetch-eurostat.ts` — pulls Hungarian SBS data (turnover, employees, enterprises, personnel costs, value added) and converts EUR→HUF

## Loading real data
```bash
NODE_USE_ENV_PROXY=1 npm run data:fetch   # needs outbound HTTPS to ec.europa.eu
npm run build
```
SBS covers sections B–N and parts of P–S; other divisions (e.g. agriculture, public administration) and divisions Eurostat
publishes only in combined groups keep placeholders. On failure the script exits non-zero and leaves the snapshot untouched.
