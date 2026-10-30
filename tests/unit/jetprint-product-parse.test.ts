import { describe, expect, it } from "vitest";

import {
  applyJetprintPriceDeltas,
  htmlToPlainText,
  JetprintProductParseError,
  parsePrintAreaSize,
  type RawJetprintMyProduct,
  toJetprintArtLayers,
  toJetprintMyProduct,
} from "../../scripts/jetprint-product-parse";

const workspace = {
  type: "rect",
  id: "workspace",
  left: 0,
  top: 0,
  width: 714,
  height: 714,
  scaleX: 1,
  scaleY: 1,
};

const artwork = {
  type: "image",
  originX: "left",
  originY: "top",
  left: -133.9013,
  top: 136.2607,
  width: 7096,
  height: 3548,
  scaleX: 0.1244,
  scaleY: 0.1244,
  angle: 0,
  flipX: true,
  flipY: false,
  fileUrl: "https://example.com/art.png",
  fileName: "Хрючик и гриб",
};

const designOf = (...objects: object[]) =>
  JSON.stringify([{ id: 280, svg: { objects: [workspace, ...objects] } }]);

const drawstringBag: RawJetprintMyProduct = {
  customProductInfo: {
    blankProductId: 280,
    title: " Drawstring Bag ",
    description:
      "<p>Take Khryuchik along!</p><p>✨ Polyester.<br>✨ Drawstring &amp; more.</p><p><br></p>",
    tags: "Bag, sports bag,#LittleKhryuchik ",
    mainImageId: 3,
  },
  images: [
    { id: 1, url: "https://example.com/1.jpg", checked: true },
    { id: 2, url: "https://example.com/2.jpg", checked: false },
    { id: 3, url: "https://example.com/3.jpg", checked: true },
  ],
  variants: [
    { checked: true, retailPrice: 9.75, blankProductSkuId: 1508 },
    { checked: false, retailPrice: 5, blankProductSkuId: 1509 },
  ],
  designDataJson: designOf(artwork),
};

describe("htmlToPlainText", () => {
  it("turns paragraphs and line breaks into plain text", () => {
    expect(
      htmlToPlainText(
        "<p>One &amp; two</p><p>A<br>B&#39;s<br/>C</p><ul><li>x</li><li>y</li></ul><p><br></p>",
      ),
    ).toBe("One & two\n\nA\nB's\nC\n\n• x\n• y");
  });
});

describe("toJetprintMyProduct", () => {
  it("reads the listing and keeps only what the merchant selected", () => {
    expect(toJetprintMyProduct(drawstringBag)).toEqual({
      blankId: "280",
      title: "Drawstring Bag",
      description:
        "Take Khryuchik along!\n\n✨ Polyester.\n✨ Drawstring & more.",
      tags: ["Bag", "sports bag", "#LittleKhryuchik"],
      price: 9.75,
      variants: [{ blankSkuId: 1508, price: 9.75 }],
      imageUrls: ["https://example.com/3.jpg", "https://example.com/1.jpg"],
    });
  });

  it("uses the lowest variant price as the base price", () => {
    const product = toJetprintMyProduct({
      ...drawstringBag,
      variants: [
        { checked: true, retailPrice: 12, blankProductSkuId: 1 },
        { checked: true, retailPrice: 10, blankProductSkuId: 2 },
      ],
    });

    expect(product.price).toBe(10);
  });

  it("rejects a blank catalog response", () => {
    expect(() =>
      toJetprintMyProduct({} as unknown as RawJetprintMyProduct),
    ).toThrow(JetprintProductParseError);
  });
});

describe("applyJetprintPriceDeltas", () => {
  const sizes = [
    { label: "Men-US4-5/EU 37-38", value: "men-us4-5-eu-37-38" },
    { label: "Women-US12/EU46-47", value: "women-us12-eu46-47" },
  ];
  const slippers = [
    { sku: "SF_S50-Men-US4-5/EU 37-38", size: "Men-US4-5/EU 37-38" },
    { sku: "SF_S50-Women-US12/EU46-47", size: "Women-US12/EU46-47" },
  ];

  it("turns a dearer size into a surcharge in every currency", () => {
    const result = applyJetprintPriceDeltas({
      options: { sizes, colors: [] },
      variants: slippers,
      priceBySku: new Map([
        ["SF_S50-Men-US4-5/EU 37-38", 12],
        ["SF_S50-Women-US12/EU46-47", 14],
      ]),
      basePrice: 12,
      currencies: ["USD", "EUR"],
    });

    expect(result.isPricedPerOption).toBe(true);
    expect(result.options.sizes).toEqual([
      sizes[0],
      { ...sizes[1], priceDelta: { USD: 2, EUR: 2 } },
    ]);
  });

  it("leaves prices to the admin when they vary along two axes", () => {
    const result = applyJetprintPriceDeltas({
      options: { sizes, colors: [{ label: "White", value: "white" }] },
      variants: slippers.map((variant) => ({ ...variant, color: "White" })),
      priceBySku: new Map([
        ["SF_S50-Men-US4-5/EU 37-38", 12],
        ["SF_S50-Women-US12/EU46-47", 14],
      ]),
      basePrice: 12,
      currencies: ["USD"],
    });

    expect(result.isPricedPerOption).toBe(false);
    expect(result.options.sizes).toEqual(sizes);
  });
});

describe("parsePrintAreaSize", () => {
  it("reads the factory print size in every spacing JetPrint uses", () => {
    expect(parsePrintAreaSize("4934 x 4934")).toEqual({
      width: 4934,
      height: 4934,
    });
    expect(parsePrintAreaSize("3130x3130 ")).toEqual({
      width: 3130,
      height: 3130,
    });
    expect(parsePrintAreaSize("4429 × 4429")).toEqual({
      width: 4429,
      height: 4429,
    });
    expect(parsePrintAreaSize(undefined)).toBeUndefined();
  });
});

describe("toJetprintArtLayers", () => {
  const template = { width: 4380, height: 4380 };

  it("maps the editor canvas onto the template pixels", () => {
    const [layer] = toJetprintArtLayers(designOf(artwork), template);

    expect(layer.url).toBe("https://example.com/art.png");
    expect(layer.fileName).toBe("Хрючик и гриб");
    expect(layer.x).toBeCloseTo(-821.41, 1);
    expect(layer.y).toBeCloseTo(835.88, 1);
    expect(layer.width).toBeCloseTo(5415.2, 0);
    expect(layer.height).toBeCloseTo(2707.6, 0);
    expect(layer.flipX).toBe(true);
    expect(layer.flipY).toBe(false);
  });

  it("refuses designs it would render wrongly", () => {
    expect(() =>
      toJetprintArtLayers(designOf({ ...artwork, angle: 15 }), template),
    ).toThrow(/Rotated/);
    expect(() =>
      toJetprintArtLayers(designOf({ ...artwork, type: "textbox" }), template),
    ).toThrow(/textbox/);
    expect(() =>
      toJetprintArtLayers(
        JSON.stringify([
          { svg: { objects: [workspace, artwork] } },
          { svg: { objects: [workspace, artwork] } },
        ]),
        template,
      ),
    ).toThrow(/2 print areas/);
    expect(() => toJetprintArtLayers(designOf(), template)).toThrow(
      /no artwork/,
    );
  });
});
