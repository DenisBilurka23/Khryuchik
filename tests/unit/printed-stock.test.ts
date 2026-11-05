import { describe, expect, it } from "vitest";

import { isPrintedOffered, toPrintedLanguages } from "@/utils/printed-stock";

describe("toPrintedLanguages", () => {
  const stock = { en: { northAmerica: 15 }, ru: {} };

  it("lists the languages stocked in the region", () => {
    expect(toPrintedLanguages(stock, ["northAmerica"])).toEqual(["en"]);
  });

  it("returns an empty list when the region has no copies", () => {
    expect(toPrintedLanguages(stock, ["europe"])).toEqual([]);
  });

  it.each([[undefined], [{}]])("leaves %j untracked", (untracked) => {
    expect(toPrintedLanguages(untracked, ["europe"])).toBeUndefined();
  });
});

describe("isPrintedOffered", () => {
  it("offers any language while stock is not tracked", () => {
    expect(isPrintedOffered(undefined, "en")).toBe(true);
  });

  it("offers a language stocked in the region", () => {
    expect(isPrintedOffered(["en"], "en")).toBe(true);
  });

  it("refuses a language that is not stocked in the region", () => {
    expect(isPrintedOffered(["en"], "ru")).toBe(false);
  });

  it("refuses print when the region has no copies at all", () => {
    expect(isPrintedOffered([], "en")).toBe(false);
  });
});
