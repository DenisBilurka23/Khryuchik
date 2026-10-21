import { describe, expect, it } from "vitest";

import {
  JetprintBlankParseError,
  type RawJetprintBlank,
  toJetprintBlank,
  toJetprintBlankVariants,
} from "../../scripts/jetprint-blank-parse";

const option = (text: string, color: string | null = null) =>
  JSON.stringify({ text, color, fileUrl: null });

const standardShipping = {
  name: "Standard Shipping",
  items: [
    {
      countryGroupName: "USA",
      countryItems: [{ countryCode: "us" }],
      deliveryTime: "7-10 days",
      priceItems: [
        { pricePerKilo: 0, registrationFee: 0, weightMin: 0, weightMax: 0.01 },
        { pricePerKilo: 8, registrationFee: 4, weightMin: 0.01, weightMax: 2 },
      ],
    },
  ],
};

const backpack: RawJetprintBlank = {
  id: 201,
  blankProductInfo: {
    model: "201. Kid's School Backpack",
    productionTime: "5-7 days",
  },
  skuInfos: [{ id: 757, skuName: "D42-Default", weight: 550 }],
  skuTrees: [
    {
      optionName: "Size",
      optionValue: "Default",
      variantIds: [757],
      children: [],
    },
  ],
  skuMaps: [
    { name: "Size", items: [{ name: "Default", option: option("Default") }] },
  ],
  logisticsMethodInfos: [standardShipping],
};

const tShirt: RawJetprintBlank = {
  id: 105,
  blankProductInfo: { model: "105. T-shirt", productionTime: "3-5 days" },
  skuInfos: [
    { id: 1, skuName: "T1-White-S", weight: 180 },
    { id: 2, skuName: "T1-White-M", weight: 190 },
    { id: 3, skuName: "T1-Black-S", weight: 180 },
    { id: 4, skuName: "T1-Black-M", weight: 190 },
  ],
  skuTrees: [
    {
      optionName: "Color",
      optionValue: "White",
      variantIds: [1, 2],
      children: [
        { optionName: "Size", optionValue: "S", variantIds: [1], children: [] },
        { optionName: "Size", optionValue: "M", variantIds: [2], children: [] },
      ],
    },
    {
      optionName: "Color",
      optionValue: "Black",
      variantIds: [3, 4],
      children: [
        { optionName: "Size", optionValue: "S", variantIds: [3], children: [] },
        { optionName: "Size", optionValue: "M", variantIds: [4], children: [] },
      ],
    },
  ],
  skuMaps: [
    {
      name: "Color",
      items: [
        { name: "White", option: option("White", "#FFFFFF") },
        { name: "Black", option: option("Black", "#000000") },
      ],
    },
    {
      name: "Size",
      items: [
        { name: "S", option: option("S") },
        { name: "M", option: option("M") },
      ],
    },
  ],
  logisticsMethodInfos: [standardShipping],
};

describe("JetPrint blank variants", () => {
  it("treats a single Default option as a product without variants", () => {
    expect(toJetprintBlankVariants(backpack)).toEqual([{ sku: "D42-Default" }]);
  });

  it("maps a color and size tree to SKUs with color swatches", () => {
    expect(toJetprintBlankVariants(tShirt)).toEqual([
      { sku: "T1-White-S", size: "S", color: "White", colorHex: "#FFFFFF" },
      { sku: "T1-White-M", size: "M", color: "White", colorHex: "#FFFFFF" },
      { sku: "T1-Black-S", size: "S", color: "Black", colorHex: "#000000" },
      { sku: "T1-Black-M", size: "M", color: "Black", colorHex: "#000000" },
    ]);
  });

  it("drops an option that has only one value", () => {
    const whiteOnly: RawJetprintBlank = {
      ...tShirt,
      skuInfos: tShirt.skuInfos.slice(0, 2),
      skuTrees: tShirt.skuTrees!.slice(0, 1),
    };

    expect(toJetprintBlankVariants(whiteOnly)).toEqual([
      { sku: "T1-White-S", size: "S" },
      { sku: "T1-White-M", size: "M" },
    ]);
  });

  it("lists plain SKUs when the response has no variant tree", () => {
    expect(
      toJetprintBlankVariants({ ...backpack, skuTrees: undefined }),
    ).toEqual([{ sku: "D42-Default" }]);
  });

  it("refuses options the store cannot sell", () => {
    const styled: RawJetprintBlank = {
      ...backpack,
      skuTrees: [
        {
          optionName: "Style",
          optionValue: "Classic",
          variantIds: [757],
          children: [],
        },
      ],
    };

    expect(() => toJetprintBlankVariants(styled)).toThrow(
      JetprintBlankParseError,
    );
  });

  it("refuses a response where a SKU is missing from the tree", () => {
    const incomplete: RawJetprintBlank = {
      ...tShirt,
      skuTrees: tShirt.skuTrees!.slice(0, 1),
    };

    expect(() => toJetprintBlankVariants(incomplete)).toThrow(
      /T1-Black-S, T1-Black-M/,
    );
  });
});

describe("JetPrint blank import", () => {
  it("keeps weights, shipping and variants together", () => {
    const blank = toJetprintBlank(tShirt, "2026-10-20");

    expect(blank.name).toBe("105. T-shirt");
    expect(blank.productionDays).toBe("3-5");
    expect(blank.skus["T1-Black-M"]).toEqual({ weightGrams: 190 });
    expect(blank.variants).toHaveLength(4);
    expect(blank.standardShipping).toEqual([
      {
        name: "USA",
        countries: ["US"],
        deliveryDays: "7-10",
        bands: [{ minKg: 0.01, maxKg: 2, perKg: 8, fee: 4 }],
      },
    ]);
    expect(blank.importedAt).toBe("2026-10-20");
  });

  it("refuses a signed-out response without shipping data", () => {
    expect(() =>
      toJetprintBlank({ ...tShirt, logisticsMethodInfos: [] }, "2026-10-20"),
    ).toThrow(JetprintBlankParseError);
  });
});
