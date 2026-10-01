import { describe, expect, it } from "vitest";
import { DIVISIONS } from "@/data/divisions";
import { buildReport, mergeRealData } from "@/lib/report";
import { placeholderSeries } from "@/lib/placeholder";
import { SECTION_BY_CODE } from "@/data/sections";
import { cagr } from "@/lib/format";

describe("placeholder data", () => {
  it("is deterministic per division", () => {
    expect(buildReport("10")).toEqual(buildReport("10"));
    expect(buildReport("10").series[0].revenueBn).not.toEqual(buildReport("11").series[0].revenueBn);
  });

  it("builds a complete report for all 88 divisions", () => {
    expect(DIVISIONS).toHaveLength(88);
    for (const d of DIVISIONS) {
      const r = buildReport(d.code);
      expect(r.series).toHaveLength(16);
      expect(r.kpis).toHaveLength(6);
      expect(r.regions).toHaveLength(8);
      expect(r.terms.length).toBeGreaterThan(0);
      expect(r.drivers.length).toBeGreaterThan(0);
      expect(Math.round(r.products.reduce((a, s) => a + s.share, 0))).toBe(100);
      expect(Math.round(r.regions.reduce((a, s) => a + s.share, 0))).toBe(100);
      expect(Math.round(r.costs.reduce((a, c) => a + c.industry, 0))).toBe(100);
      for (const p of r.series) expect(Number.isFinite(p.revenueBn) && p.revenueBn > 0).toBe(true);
    }
  });
});

describe("real data merge", () => {
  it("overrides placeholders and tags the source", () => {
    const r = buildReport("10", { "10": { turnoverBn: { "2022": 5000, "2023": 5200 }, employees: { "2023": 100000 } } });
    expect(r.hasRealData).toBe(true);
    expect(r.series.find((p) => p.year === 2023)!.revenueBn).toBe(5200);
    expect(r.series.find((p) => p.year === 2023)!.source).toBe("eurostat");
    expect(r.series.find((p) => p.year === 2023)!.employees).toBe(100000);
    expect(r.kpis[0].source).toBe("derived");
    expect(r.kpis[0].year).toBe(2023);
  });

  it("leaves series untouched without data", () => {
    const s = placeholderSeries({ code: "10", section: "C" } as never, SECTION_BY_CODE.C);
    expect(mergeRealData(s, undefined).series).toBe(s);
  });
});

describe("cagr", () => {
  it("computes compound growth", () => {
    expect(cagr(100, 121, 2)).toBeCloseTo(10, 5);
    expect(cagr(0, 10, 2)).toBe(0);
  });
});
