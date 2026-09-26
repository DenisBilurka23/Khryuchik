import { describe, expect, it } from "vitest";

import {
  calculatePromoDiscount,
  generatePromoCode,
  normalizePromoCode,
} from "@/utils/promo";

describe("calculatePromoDiscount", () => {
  it.each([
    [0, 49.99, 0],
    [10, 49.99, 5],
    [15, 19.99, 3],
    [100, 49.99, 49.99],
  ])("calculates a %s%% discount on %s", (percentOff, subtotal, expected) => {
    expect(calculatePromoDiscount(percentOff, subtotal)).toBe(expected);
  });
});

describe("normalizePromoCode", () => {
  it("trims, removes whitespace, and uppercases a code", () => {
    expect(normalizePromoCode("  autumn  sale  ")).toBe("AUTUMNSALE");
  });
});

describe("generatePromoCode", () => {
  it("generates an eight-character code from the safe alphabet", () => {
    expect(generatePromoCode()).toMatch(
      /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/,
    );
  });
});
