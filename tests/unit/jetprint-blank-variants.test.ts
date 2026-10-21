import { describe, expect, it, vi } from "vitest";

import type { JetprintBlank, JetprintBlankCatalog } from "@/types/catalog";
import {
  buildJetprintProductOptions,
  buildJetprintVariantLinks,
  mergeJetprintLink,
  mergeProductOptions,
  resolveJetprintBlankId,
} from "@/utils";

const tShirt: JetprintBlank = {
  name: "105. T-shirt",
  productionDays: "3-5",
  skus: {
    "T1-White-S": { weightGrams: 180 },
    "T1-White-M": { weightGrams: 190 },
    "T1-Light-Blue-S": { weightGrams: 180 },
  },
  variants: [
    { sku: "T1-White-S", size: "S", color: "White", colorHex: "#FFFFFF" },
    { sku: "T1-White-M", size: "M", color: "White", colorHex: "#FFFFFF" },
    { sku: "T1-Light-Blue-S", size: "S", color: "Light Blue" },
  ],
  standardShipping: [],
  importedAt: "2026-10-20",
};

const backpack: JetprintBlank = {
  ...tShirt,
  name: "201. Kid's School Backpack",
  skus: { "D42-Default": { weightGrams: 550 } },
  variants: [{ sku: "D42-Default" }],
};

const catalog: JetprintBlankCatalog = { "105": tShirt, "201": backpack };

vi.mock("server-only", () => ({}));
vi.mock("@/data/jetprint-blank-catalog", () => ({
  jetprintBlankCatalog: {
    "105": {
      name: "105. T-shirt",
      productionDays: "3-5",
      skus: {},
      variants: [
        { sku: "T1-White-S", size: "S", color: "White" },
        { sku: "T1-White-M", size: "M", color: "White" },
      ],
      standardShipping: [],
      importedAt: "2026-10-20",
    },
  },
}));

const { parseProductJetprint } =
  await import("@/server/admin/jetprint-form-data");

const jetprintForm = (fields: Record<string, string>) => {
  const formData = new FormData();

  formData.set("jetprint.enabled", "on");
  Object.entries(fields).forEach(([key, value]) => formData.set(key, value));

  return formData;
};

describe("JetPrint variants from blank data", () => {
  it("links only the chosen SKUs with language-independent selections", () => {
    expect(
      buildJetprintVariantLinks(tShirt, ["T1-Light-Blue-S", "T1-White-M"]),
    ).toEqual([
      {
        sku: "T1-White-M",
        selections: { size: "m", color: "white" },
        isAvailable: true,
      },
      {
        sku: "T1-Light-Blue-S",
        selections: { size: "s", color: "light-blue" },
        isAvailable: true,
      },
    ]);
  });

  it("links a blank without variants with empty selections", () => {
    expect(buildJetprintVariantLinks(backpack, ["D42-Default"])).toEqual([
      { sku: "D42-Default", selections: {}, isAvailable: true },
    ]);
  });

  it("builds sizes and colors once each, in blank order", () => {
    expect(
      buildJetprintProductOptions(tShirt, [
        "T1-White-S",
        "T1-White-M",
        "T1-Light-Blue-S",
      ]),
    ).toEqual({
      sizes: [
        { label: "S", value: "s" },
        { label: "M", value: "m" },
      ],
      colors: [
        { label: "White", value: "white" },
        { label: "Light Blue", value: "light-blue" },
      ],
    });
    expect(buildJetprintProductOptions(backpack, ["D42-Default"])).toEqual({
      sizes: [],
      colors: [],
    });
  });

  it("keeps translated labels and price deltas when options are rebuilt", () => {
    const translated = [
      { label: "Белый", value: "white", priceDelta: { USD: 2 } },
      { label: "Старый цвет", value: "old" },
    ];

    expect(
      mergeProductOptions(
        [
          { label: "White", value: "white" },
          { label: "Light Blue", value: "light-blue" },
        ],
        translated,
      ),
    ).toEqual([
      { label: "Белый", value: "white", priceDelta: { USD: 2 } },
      { label: "Light Blue", value: "light-blue" },
    ]);
  });

  it("finds the blank of a product saved before blanks were stored", () => {
    const legacy = {
      variants: [{ sku: "D42-Default", selections: {}, isAvailable: true }],
      printFiles: [],
      previewFiles: [],
    };

    expect(resolveJetprintBlankId(catalog, legacy)).toBe("201");
    expect(resolveJetprintBlankId(catalog, { ...legacy, blankId: "105" })).toBe(
      "105",
    );
    expect(resolveJetprintBlankId(catalog, undefined)).toBeUndefined();
  });

  it("keeps the blank when merging a saved link", () => {
    const link = {
      blankId: "105",
      variants: buildJetprintVariantLinks(tShirt, ["T1-White-S"]),
      printFiles: [],
      previewFiles: [],
    };

    expect(mergeJetprintLink(link, undefined)?.blankId).toBe("105");
  });
});

describe("JetPrint section of the product form", () => {
  it("builds variants from the blank, not from what the form sent", () => {
    const link = parseProductJetprint(
      jetprintForm({
        "jetprint.blankId": "105",
        "jetprint.skusJson": JSON.stringify([
          "T1-White-M",
          "FAKE-SKU",
          "D42-Default",
        ]),
      }),
    );

    expect(link?.blankId).toBe("105");
    expect(link?.variants).toEqual([
      {
        sku: "T1-White-M",
        selections: { size: "m", color: "white" },
        isAvailable: true,
      },
    ]);
  });

  it("drops an unknown blank and its variants", () => {
    const link = parseProductJetprint(
      jetprintForm({
        "jetprint.blankId": "999",
        "jetprint.skusJson": JSON.stringify(["T1-White-M"]),
      }),
    );

    expect(link?.blankId).toBeUndefined();
    expect(link?.variants).toEqual([]);
  });
});
