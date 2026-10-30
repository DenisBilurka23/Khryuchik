import { describe, expect, it } from "vitest";

import { localizeBookOptionLabels } from "@/utils/product";

const storedOptions = {
  languages: [
    { label: "английский", value: "en" },
    { label: "русский", value: "ru", priceDelta: { USD: 2 } },
  ],
  formats: [
    { label: "Печатная версия", value: "printed" },
    { label: "PDF", value: "pdf" },
  ],
  sizes: [{ label: "S", value: "s" }],
};

describe("localizeBookOptionLabels", () => {
  it("labels languages and formats in the storefront locale, not the stored one", () => {
    const result = localizeBookOptionLabels(storedOptions, "en", {
      printed: "Print edition",
      digital: "Digital edition",
    });

    expect(result.languages).toEqual([
      { label: "English", value: "en" },
      { label: "Russian", value: "ru", priceDelta: { USD: 2 } },
    ]);
    expect(result.formats).toEqual([
      { label: "Print edition", value: "printed" },
      { label: "PDF", value: "pdf" },
    ]);
    expect(result.sizes).toBe(storedOptions.sizes);
  });

  it("capitalizes language names that Intl returns in lower case", () => {
    const result = localizeBookOptionLabels(storedOptions, "ru", {});

    expect(result.languages?.map((option) => option.label)).toEqual([
      "Английский",
      "Русский",
    ]);
  });
});
