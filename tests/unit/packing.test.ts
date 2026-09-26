import { describe, expect, it } from "vitest";

import { buildParcel } from "@/server/shipping/packing";

describe("buildParcel", () => {
  it.each([
    [1, 100, 260, 260, 50],
    [2, 100, 260, 260, 50],
    [3, 250, 260, 260, 100],
    [6, 250, 260, 260, 100],
    [7, 400, 260, 260, 160],
    [12, 400, 260, 260, 160],
    [13, 400, 260, 260, 160],
  ])(
    "selects the expected box for %s units",
    (units, tareGrams, lengthMm, widthMm, heightMm) => {
      const parcel = buildParcel({
        units,
        contentWeightGrams: 1_000,
        value: { amount: 25, currency: "USD" },
        contents: [],
      });

      expect(parcel).toMatchObject({
        weightGrams: 1_000 + tareGrams,
        lengthMm,
        widthMm,
        heightMm,
        valueAmount: 25,
        valueCurrency: "USD",
        contents: [],
      });
    },
  );
});
