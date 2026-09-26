import { describe, expect, it } from "vitest";

import byEn from "@/i18n/overrides/BY/en.json";
import byRu from "@/i18n/overrides/BY/ru.json";
import usEn from "@/i18n/overrides/US/en.json";
import usRu from "@/i18n/overrides/US/ru.json";
import en from "@/i18n/messages/en.json";
import ru from "@/i18n/messages/ru.json";

const isObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const collectLeafPaths = (value: unknown, prefix = ""): string[] => {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return [prefix];
    }

    return value.flatMap((item) => collectLeafPaths(item, `${prefix}[]`));
  }

  if (isObject(value)) {
    const entries = Object.entries(value);

    if (entries.length === 0) {
      return [prefix];
    }

    return entries.flatMap(([key, child]) =>
      collectLeafPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [prefix];
};

const sortedPaths = (value: unknown) =>
  [...new Set(collectLeafPaths(value))].sort();

describe("dictionaries", () => {
  it("keeps the English and Russian base dictionary shapes aligned", () => {
    expect(sortedPaths(ru)).toEqual(sortedPaths(en));
  });

  it.each([
    ["BY", byEn, byRu],
    ["US", usEn, usRu],
  ])(
    "keeps the %s override shapes aligned across locales",
    (_country, enOverride, ruOverride) => {
      expect(sortedPaths(ruOverride)).toEqual(sortedPaths(enOverride));
    },
  );

  it.each([
    ["BY/en", byEn],
    ["BY/ru", byRu],
    ["US/en", usEn],
    ["US/ru", usRu],
  ])("only overrides existing storefront keys in %s", (label, override) => {
    const basePaths = new Set(sortedPaths(en.storefront));

    for (const path of sortedPaths(override)) {
      expect(
        basePaths.has(path),
        `${label} contains an unknown storefront path: ${path}`,
      ).toBe(true);
    }
  });
});
