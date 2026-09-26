import { describe, expect, it } from "vitest";

import {
  BPOST_ZONE,
  hasBpostPickupPoints,
  resolveBpostZone,
} from "@/constants/bpost";
import { BPOST_TARIFF_RULES } from "@/server/shipping/bpost-tariff";

describe("resolveBpostZone", () => {
  it.each([
    ["BE", BPOST_ZONE.domestic],
    ["FR", BPOST_ZONE.neighbours],
    ["AT", BPOST_ZONE.restOfEu],
    ["GB", BPOST_ZONE.restOfEurope],
    ["CA", BPOST_ZONE.mediterraneanNorthAmerica],
    ["JP", BPOST_ZONE.restOfWorld],
  ])("maps %s to %s", (country, expected) => {
    expect(resolveBpostZone(country)).toBe(expected);
  });
});

describe("hasBpostPickupPoints", () => {
  it.each(["BE", "FR", "NL"])("supports pickup points in %s", (country) => {
    expect(hasBpostPickupPoints(country)).toBe(true);
  });

  it("does not advertise pickup points elsewhere", () => {
    expect(hasBpostPickupPoints("DE")).toBe(false);
  });
});

describe("BPOST_TARIFF_RULES", () => {
  it("contains positive euro-denominated rates", () => {
    for (const rule of BPOST_TARIFF_RULES) {
      expect(rule.amount).toBeGreaterThan(0);
      expect(rule.maxWeightGrams).toBeGreaterThan(0);
      expect(rule.currency).toBe("EUR");
    }
  });

  it("keeps weight bands ordered with non-decreasing prices", () => {
    const bandsByService = Map.groupBy(
      BPOST_TARIFF_RULES,
      (rule) => `${rule.zone}:${rule.service}:${rule.deliveryType}`,
    );

    for (const bands of bandsByService.values()) {
      for (let index = 1; index < bands.length; index += 1) {
        expect(bands[index].maxWeightGrams).toBeGreaterThan(
          bands[index - 1].maxWeightGrams,
        );
        expect(bands[index].amount).toBeGreaterThanOrEqual(
          bands[index - 1].amount,
        );
      }
    }
  });
});
