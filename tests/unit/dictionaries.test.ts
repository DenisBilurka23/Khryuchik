import { describe, expect, it } from "vitest";

import europeEn from "@/i18n/overrides/europe/en.json";
import europeRu from "@/i18n/overrides/europe/ru.json";
import northAmericaEn from "@/i18n/overrides/northAmerica/en.json";
import northAmericaRu from "@/i18n/overrides/northAmerica/ru.json";
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
    ["europe", europeEn, europeRu],
    ["northAmerica", northAmericaEn, northAmericaRu],
  ])(
    "keeps the %s override shapes aligned across locales",
    (_region, enOverride, ruOverride) => {
      expect(sortedPaths(ruOverride)).toEqual(sortedPaths(enOverride));
    },
  );

  it.each([
    ["europe/en", europeEn],
    ["europe/ru", europeRu],
    ["northAmerica/en", northAmericaEn],
    ["northAmerica/ru", northAmericaRu],
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
