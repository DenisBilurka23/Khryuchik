import { describe, expect, it } from "vitest";

import { bpostProvider } from "@/server/shipping/providers/bpost.provider";
import type { ShippingParcel } from "@/types/shipping";

const buildParcel = (
  weightGrams: number,
  dimensions: Partial<
    Pick<ShippingParcel, "lengthMm" | "widthMm" | "heightMm">
  > = {},
): ShippingParcel => ({
  weightGrams,
  lengthMm: 260,
  widthMm: 260,
  heightMm: 160,
  valueAmount: 25,
  valueCurrency: "EUR",
  contents: [],
  ...dimensions,
});

const quoteCountry = async (country: string, weightGrams: number) => {
  const result = await bpostProvider.quote(buildParcel(weightGrams), {
    country,
  });

  expect(result.status).toBe("quoted");

  if (result.status !== "quoted") {
    throw new Error(`Expected a quote for ${country} at ${weightGrams} grams`);
  }

  return Object.fromEntries(
    result.options.map((option) => [option.service, option.amount]),
  );
};

const quoteBelgium = (weightGrams: number) => quoteCountry("BE", weightGrams);

describe("bpostProvider", () => {
  it.each([
    [2_000, { pickupPoint: 5.4, standard: 7.1 }],
    [2_001, { pickupPoint: 5.6, standard: 11.5 }],
    [5_000, { pickupPoint: 5.6, standard: 11.5 }],
    [5_001, { pickupPoint: 6, standard: 11.5 }],
    [10_000, { pickupPoint: 6, standard: 11.5 }],
    [10_001, { pickupPoint: 10.15 }],
    [20_000, { pickupPoint: 10.15 }],
    [20_001, { pickupPoint: 12.8 }],
    [30_000, { pickupPoint: 12.8 }],
  ])(
    "selects the smallest eligible band at %s grams",
    async (weight, rates) => {
      await expect(quoteBelgium(weight)).resolves.toEqual(rates);
    },
  );

  it("rejects a parcel above the highest weight band", async () => {
    await expect(
      bpostProvider.quote(buildParcel(30_001), { country: "BE" }),
    ).resolves.toEqual({ status: "unsupported-parcel" });
  });

  it("rejects a parcel with a side above the size limit", async () => {
    await expect(
      bpostProvider.quote(buildParcel(1_000, { lengthMm: 1_501 }), {
        country: "BE",
      }),
    ).resolves.toEqual({ status: "unsupported-parcel" });
  });

  it.each([
    ["FR", { pickupPoint: 11.75, economy: 11.6, standard: 18.1 }],
    ["AT", { economy: 13.75, standard: 36.2 }],
    ["GB", { economy: 17.7, standard: 38.8 }],
    ["DZ", { economy: 22.5, standard: 58.2 }],
    ["JP", { economy: 31.9, standard: 77.6 }],
  ])("uses the tariff table for the %s zone", async (country, rates) => {
    await expect(quoteCountry(country, 2_000)).resolves.toEqual(rates);
  });
});
