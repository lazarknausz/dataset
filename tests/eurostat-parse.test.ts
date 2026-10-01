import { describe, expect, it } from "vitest";
import { collect, decode, findIndicators, rates, type JsonStat } from "../scripts/eurostat-parse";

const mock: JsonStat = {
  id: ["freq", "indic_sb", "unit", "nace_r2", "geo", "time"],
  size: [1, 1, 1, 2, 1, 2],
  dimension: {
    freq: { category: { index: { A: 0 } } },
    indic_sb: { category: { index: { V12110: 0 }, label: { V12110: "Turnover", V11110: "Number of enterprises" } } },
    unit: { category: { index: { MIO_EUR: 0 } } },
    nace_r2: { category: { index: { C10: 0, C11: 1 } } },
    geo: { category: { index: { HU: 0 } } },
    time: { category: { index: { "2021": 0, "2022": 1 } } },
  },
  value: { "0": 100, "1": 110, "3": 55 },
};

describe("eurostat parsing", () => {
  it("decodes sparse JSON-stat values to coordinates", () => {
    const cells = decode(mock);
    expect(cells).toHaveLength(3);
    expect(cells[0].coords).toMatchObject({ nace_r2: "C10", time: "2021" });
    expect(cells[2].coords).toMatchObject({ nace_r2: "C11", time: "2022" });
  });

  it("collects nace -> year -> value", () => {
    expect(collect(mock, { unit: ["MIO_EUR"] })).toEqual({ C10: { "2021": 100, "2022": 110 }, C11: { "2022": 55 } });
  });

  it("finds indicator codes by label", () => {
    expect(findIndicators(mock)).toMatchObject({ turnover: "V12110", enterprises: "V11110" });
  });

  it("extracts HUF rates", () => {
    const fx: JsonStat = {
      id: ["currency", "time"], size: [2, 1],
      dimension: { currency: { category: { index: ["HUF", "PLN"] } }, time: { category: { index: ["2022"] } } },
      value: [390.9, 4.69],
    };
    expect(rates(fx)).toEqual({ "2022": 390.9 });
  });
});
