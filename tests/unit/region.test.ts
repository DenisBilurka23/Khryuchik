import { describe, expect, it } from "vitest";

import {
  getAddressRegion,
  getRegionForCountry,
  isRegionCode,
} from "@/utils/region";

describe("getRegionForCountry", () => {
  it.each([
    ["US", "northAmerica"],
    ["CA", "northAmerica"],
    ["BE", "europe"],
    ["BY", "europe"],
    ["de", "europe"],
    ["JP", null],
  ])("maps %s to %s", (country, region) => {
    expect(getRegionForCountry(country)).toBe(region);
  });
});

describe("getAddressRegion", () => {
  const bothRegions = ["northAmerica", "europe"] as const;

  it("prices a European address in Europe", () => {
    expect(getAddressRegion("FR", bothRegions)).toBe("europe");
  });

  it("prices a Canadian address in North America", () => {
    expect(getAddressRegion("CA", bothRegions)).toBe("northAmerica");
  });

  it("leaves a country outside both regions to the visitor's choice", () => {
    expect(getAddressRegion("JP", bothRegions)).toBeNull();
  });

  it("ignores a region that is not active", () => {
    expect(getAddressRegion("FR", ["northAmerica"])).toBeNull();
  });

  it("returns nothing without an address country", () => {
    expect(getAddressRegion(undefined, bothRegions)).toBeNull();
    expect(getAddressRegion("", bothRegions)).toBeNull();
  });
});

describe("isRegionCode", () => {
  it("accepts only the two sales regions", () => {
    expect(isRegionCode("europe")).toBe(true);
    expect(isRegionCode("northAmerica")).toBe(true);
    expect(isRegionCode("US")).toBe(false);
    expect(isRegionCode(undefined)).toBe(false);
  });
});
