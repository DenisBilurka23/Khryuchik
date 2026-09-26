import { describe, expect, it } from "vitest";

import {
  convertFromUsd,
  convertShippingAmount,
  roundToCents,
} from "@/utils/price-conversion";

describe("roundToCents", () => {
  it.each([
    [12, 12],
    [12.344, 12.34],
    [12.345, 12.35],
    [0.009, 0.01],
  ])("rounds %s to %s", (value, expected) => {
    expect(roundToCents(value)).toBe(expected);
  });
});

describe("convertFromUsd", () => {
  it("keeps an exact whole-unit conversion", () => {
    expect(convertFromUsd(10, 1.2)).toBe(12);
  });

  it("rounds a fractional conversion up", () => {
    expect(convertFromUsd(10, 1.201)).toBe(13);
  });
});

describe("convertShippingAmount", () => {
  it("returns the amount unchanged for equal currencies", () => {
    expect(
      convertShippingAmount({
        amount: 12.345,
        fromCurrency: "EUR",
        toCurrency: "EUR",
        fromUsdRate: 0.8,
        toUsdRate: 0.8,
      }),
    ).toBe(12.345);
  });

  it("converts through USD and rounds to cents", () => {
    expect(
      convertShippingAmount({
        amount: 10,
        fromCurrency: "CAD",
        toCurrency: "EUR",
        fromUsdRate: 1.5,
        toUsdRate: 0.91,
      }),
    ).toBe(6.07);
  });
});
