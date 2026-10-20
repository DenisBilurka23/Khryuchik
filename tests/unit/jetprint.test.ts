import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  JetprintApiError,
  JetprintConfigError,
  jetprintRequest,
} from "@/server/jetprint/client";
import {
  buildJetprintOrderRequest,
  JetprintOrderError,
} from "@/server/jetprint/order-request";
import jetprintBlanks from "@/data/jetprint-blanks.json";
import type {
  JetprintBlankCatalog,
  JetprintVariantLink,
  ProductJetprintLink,
} from "@/types/catalog";
import type { OrderDocument, OrderItem } from "@/types/order";
import {
  canCancelJetprintOrder,
  canSubmitOrderToJetprint,
  getOrderDeleteBlocker,
  hasLiveJetprintOrder,
} from "@/utils/order";
import {
  addDayRanges,
  findJetprintVariant,
  getJetprintOrderStatusKey,
  isJetprintDuplicateOrderMessage,
  mergeJetprintLink,
  nextJetprintCustomerOrderNo,
  pickSlowestTransitDays,
  quoteJetprintShipping,
  resolveNextJetprintOrderStatus,
  resolveSellableJetprintVariant,
  roundShippingCents,
} from "@/utils/jetprint";

const ORDER_ID = "3f2c9a1e-5b7d-4c11-9e2a-0d8f6b4a7c31";

const orderItem = (overrides: Partial<OrderItem> = {}): OrderItem => ({
  productId: "backpack",
  slug: "backpack",
  title: "Backpack",
  emoji: "🎒",
  unitPrice: 30,
  quantity: 1,
  lineTotal: 30,
  ...overrides,
});

const orderDocument = (
  overrides: Partial<OrderDocument> = {},
): OrderDocument => ({
  id: ORDER_ID,
  createdAt: "2026-10-19T00:00:00.000Z",
  locale: "en",
  region: "europe",
  currency: "EUR",
  items: [
    orderItem({ productId: "book", slug: "book", title: "Book" }),
    orderItem({
      quantity: 2,
      jetprint: {
        sku: "D42-Default",
        printFiles: [{ name: "front", url: "https://cdn.example/print.png" }],
        previewFiles: [{ name: "", url: "https://cdn.example/preview.png" }],
      },
    }),
  ],
  subtotal: 60,
  shipping: 0,
  discount: 0,
  total: 60,
  customer: {
    firstName: "Ona",
    lastName: "Jonaitė",
    email: "ona@example.com",
    phone: "+37060000000",
  },
  shippingAddress: {
    line1: "Gedimino pr. 1",
    city: "Vilnius",
    postalCode: "01103",
    country: "LT",
  },
  payment: { method: "stripe", status: "paid" },
  status: "new",
  fulfillmentType: "physical",
  ...overrides,
});

const variant = (
  overrides: Partial<JetprintVariantLink> = {},
): JetprintVariantLink => ({
  sku: "D42-Default",
  selections: {},
  isAvailable: true,
  ...overrides,
});

describe("findJetprintVariant", () => {
  it("returns the only sellable variant when nothing is selected", () => {
    expect(findJetprintVariant([variant()], {})?.sku).toBe("D42-Default");
  });

  it("matches size and color, treating blanks as unset", () => {
    const variants = [
      variant({ sku: "T-White-M", selections: { size: "m", color: "white" } }),
      variant({ sku: "T-White-L", selections: { size: "l", color: "white" } }),
      variant({ sku: "Cap", selections: { size: "", color: "black" } }),
    ];

    expect(
      findJetprintVariant(variants, { size: "l", color: "white" })?.sku,
    ).toBe("T-White-L");
    expect(findJetprintVariant(variants, { color: "black" })?.sku).toBe("Cap");
    expect(findJetprintVariant(variants, { size: "s" })).toBeUndefined();
  });

  it("skips variants JetPrint no longer offers", () => {
    expect(
      findJetprintVariant([variant({ isAvailable: false })], {}),
    ).toBeUndefined();
  });
});

describe("nextJetprintCustomerOrderNo", () => {
  it("uses the order id first and numbers resubmissions from two", () => {
    expect(nextJetprintCustomerOrderNo(ORDER_ID)).toBe(ORDER_ID);
    expect(nextJetprintCustomerOrderNo(ORDER_ID, ORDER_ID)).toBe(
      `${ORDER_ID}-2`,
    );
    expect(nextJetprintCustomerOrderNo(ORDER_ID, `${ORDER_ID}-2`)).toBe(
      `${ORDER_ID}-3`,
    );
    expect(nextJetprintCustomerOrderNo(ORDER_ID, "something-else")).toBe(
      `${ORDER_ID}-2`,
    );
  });
});

describe("mergeJetprintLink", () => {
  const EARLIER = "2026-10-01T09:00:00.000Z";

  const link = (
    overrides: Partial<ProductJetprintLink> = {},
  ): ProductJetprintLink => ({
    variants: [variant()],
    printFiles: [],
    previewFiles: [],
    ...overrides,
  });

  it("drops the link when the product is no longer fulfilled by JetPrint", () => {
    expect(mergeJetprintLink(undefined, link())).toBeUndefined();
  });

  it("keeps what the availability check learned about known SKUs", () => {
    const previous = link({
      variants: [variant({ isAvailable: false, checkedAt: EARLIER })],
    });
    const merged = mergeJetprintLink(
      link({
        variants: [
          variant(),
          variant({ sku: "D42-Blue", selections: { color: "blue" } }),
        ],
      }),
      previous,
    );

    expect(merged?.variants).toEqual([
      {
        sku: "D42-Default",
        selections: {},
        isAvailable: false,
        checkedAt: EARLIER,
      },
      { sku: "D42-Blue", selections: { color: "blue" }, isAvailable: true },
    ]);
  });
});

describe("quoteJetprintShipping", () => {
  const catalog = jetprintBlanks as JetprintBlankCatalog;
  const backpacks = (quantity: number) => [{ sku: "D42-Default", quantity }];

  it("matches the JetPrint calculator for the backpack", () => {
    expect(quoteJetprintShipping(backpacks(1), "US", catalog)).toEqual({
      status: "quoted",
      amountUsd: 10.75,
      transitDays: "17-22",
    });
    expect(quoteJetprintShipping(backpacks(2), "US", catalog)).toMatchObject({
      amountUsd: 17.06,
    });
    expect(quoteJetprintShipping(backpacks(3), "us", catalog)).toMatchObject({
      amountUsd: 24.48,
    });
    expect(quoteJetprintShipping(backpacks(4), "AU", catalog)).toMatchObject({
      amountUsd: 30.64,
    });
  });

  it("prices each destination from its own group", () => {
    expect(quoteJetprintShipping(backpacks(1), "LT", catalog)).toMatchObject({
      amountUsd: 16.3,
    });
    expect(quoteJetprintShipping(backpacks(1), "DE", catalog)).toMatchObject({
      amountUsd: 15.43,
    });
    expect(quoteJetprintShipping(backpacks(1), "GB", catalog)).toMatchObject({
      amountUsd: 11.83,
    });
    expect(quoteJetprintShipping(backpacks(1), "CA", catalog)).toMatchObject({
      amountUsd: 13.57,
    });
  });

  it("weighs every line of the same blank as one parcel", () => {
    expect(
      quoteJetprintShipping(
        [
          { sku: "D42-Default", quantity: 1 },
          { sku: "D42-Default", quantity: 1 },
        ],
        "US",
        catalog,
      ),
    ).toMatchObject({ amountUsd: 17.06 });
  });

  it("refuses unknown SKUs and destinations JetPrint does not list", () => {
    expect(
      quoteJetprintShipping([{ sku: "NOPE", quantity: 1 }], "US", catalog),
    ).toEqual({ status: "unsupported-variant" });
    expect(quoteJetprintShipping(backpacks(1), "ZZ", catalog)).toEqual({
      status: "unsupported-destination",
    });
  });
});

describe("addDayRanges", () => {
  it("adds production and delivery times", () => {
    expect(addDayRanges("5-7", "12-15")).toBe("17-22");
    expect(addDayRanges("3", "10-14")).toBe("13-17");
    expect(addDayRanges("2", "3")).toBe("5");
    expect(addDayRanges("", "12-15")).toBe("12-15");
  });
});

describe("roundShippingCents", () => {
  it("rounds half-cents up the way the JetPrint calculator does", () => {
    expect(roundShippingCents(27.465)).toBe(27.47);
    expect(roundShippingCents(10.7495)).toBe(10.75);
    expect(roundShippingCents(30.644)).toBe(30.64);
  });
});

describe("resolveSellableJetprintVariant", () => {
  it("needs both print files and previews", () => {
    const file = { name: "", url: "https://cdn.example/f.png" };
    const base = {
      variants: [variant()],
    };

    expect(
      resolveSellableJetprintVariant(
        { ...base, printFiles: [file], previewFiles: [file] },
        {},
      )?.sku,
    ).toBe("D42-Default");
    expect(
      resolveSellableJetprintVariant(
        { ...base, printFiles: [file], previewFiles: [] },
        {},
      ),
    ).toBeUndefined();
    expect(resolveSellableJetprintVariant(undefined, {})).toBeUndefined();
  });
});

describe("pickSlowestTransitDays", () => {
  it("keeps the estimate with the latest last day", () => {
    expect(pickSlowestTransitDays(["12-15", "17-22", "20"])).toBe("17-22");
    expect(pickSlowestTransitDays([])).toBeUndefined();
  });
});

describe("JetPrint order controls", () => {
  const live = { orderNo: "O_261019_00001", customerOrderNo: ORDER_ID };

  it("treats an order as live until it is cancelled", () => {
    expect(hasLiveJetprintOrder(orderDocument())).toBe(false);
    expect(hasLiveJetprintOrder(orderDocument({ jetprintOrder: live }))).toBe(
      true,
    );
    expect(
      hasLiveJetprintOrder(
        orderDocument({
          jetprintOrder: { ...live, cancelledAt: "2026-10-19T00:00:00Z" },
        }),
      ),
    ).toBe(false);
  });

  it("offers sending only for paid, open orders that JetPrint does not have", () => {
    expect(canSubmitOrderToJetprint(orderDocument())).toBe(true);
    expect(
      canSubmitOrderToJetprint(
        orderDocument({ jetprintOrder: { lastError: "timeout" } }),
      ),
    ).toBe(true);
    expect(
      canSubmitOrderToJetprint(orderDocument({ jetprintOrder: live })),
    ).toBe(false);
    expect(
      canSubmitOrderToJetprint(
        orderDocument({ payment: { method: "stripe", status: "pending" } }),
      ),
    ).toBe(false);
    expect(
      canSubmitOrderToJetprint(orderDocument({ status: "cancelled" })),
    ).toBe(false);
    expect(
      canSubmitOrderToJetprint(orderDocument({ items: [orderItem()] })),
    ).toBe(false);
  });

  it("offers cancelling only before anything ships", () => {
    expect(
      canCancelJetprintOrder(
        orderDocument({ jetprintOrder: { ...live, status: 1 } }),
      ),
    ).toBe(true);
    expect(
      canCancelJetprintOrder(
        orderDocument({ jetprintOrder: { ...live, status: 2 } }),
      ),
    ).toBe(true);
    expect(
      canCancelJetprintOrder(
        orderDocument({ jetprintOrder: { ...live, status: 3 } }),
      ),
    ).toBe(false);
    expect(canCancelJetprintOrder(orderDocument())).toBe(false);
  });

  it("blocks deleting an order that is still live at a fulfiller", () => {
    expect(getOrderDeleteBlocker(orderDocument())).toBeUndefined();
    expect(getOrderDeleteBlocker(orderDocument({ jetprintOrder: live }))).toBe(
      "blockedByJetprint",
    );
    expect(
      getOrderDeleteBlocker(
        orderDocument({ printifyOrder: { printifyOrderId: "p-1" } }),
      ),
    ).toBe("blockedByPrintify");
  });

  it("names JetPrint statuses for the admin", () => {
    expect(getJetprintOrderStatusKey(1)).toBe("pending");
    expect(getJetprintOrderStatusKey(99)).toBe("cancelled");
    expect(getJetprintOrderStatusKey(7)).toBe("unknown");
    expect(getJetprintOrderStatusKey(undefined)).toBe("unknown");
  });
});

describe("resolveNextJetprintOrderStatus", () => {
  it("moves the order forward as JetPrint reports progress", () => {
    expect(resolveNextJetprintOrderStatus("new", 1, false)).toBeUndefined();
    expect(resolveNextJetprintOrderStatus("new", 2, false)).toBe("processing");
    expect(resolveNextJetprintOrderStatus("processing", 4, false)).toBe(
      "shipped",
    );
    expect(resolveNextJetprintOrderStatus("processing", 2, true)).toBe(
      "shipped",
    );
  });

  it("never moves an order backwards or out of a final state", () => {
    expect(resolveNextJetprintOrderStatus("shipped", 2, false)).toBeUndefined();
    expect(
      resolveNextJetprintOrderStatus("delivered", 4, true),
    ).toBeUndefined();
    expect(
      resolveNextJetprintOrderStatus("cancelled", 4, true),
    ).toBeUndefined();
    expect(resolveNextJetprintOrderStatus("new", 99, false)).toBeUndefined();
  });
});

describe("isJetprintDuplicateOrderMessage", () => {
  it("recognises the already-imported reply", () => {
    expect(
      isJetprintDuplicateOrderMessage("订单:KHR-TEST-0002,已经导入过了"),
    ).toBe(true);
    expect(isJetprintDuplicateOrderMessage("找不到对应的订单")).toBe(false);
    expect(isJetprintDuplicateOrderMessage(undefined)).toBe(false);
  });
});

describe("buildJetprintOrderRequest", () => {
  it("sends only JetPrint lines and keeps their position in the order", () => {
    const request = buildJetprintOrderRequest(orderDocument(), ORDER_ID);

    expect(request.customerOrderNo).toBe(ORDER_ID);
    expect(request.isUrgent).toBe(false);
    expect(request.remark).toBe("#3F2C9A1E");
    expect(request.shipping).toEqual({ logisticsType: 1, deliveryType: 1 });
    expect(request.lineItems).toEqual([
      {
        customerItemNo: `${ORDER_ID}-2`,
        quantity: 2,
        sku: "D42-Default",
        previewFiles: [{ url: "https://cdn.example/preview.png" }],
        printFiles: [{ name: "front", url: "https://cdn.example/print.png" }],
      },
    ]);
  });

  it("never sends the customer's email, and the phone only when given", () => {
    const withPhone = buildJetprintOrderRequest(orderDocument(), ORDER_ID);
    const withoutPhone = buildJetprintOrderRequest(
      orderDocument({
        customer: { firstName: "Ona", lastName: "Jonaitė", email: "x@y.z" },
      }),
      ORDER_ID,
    );

    expect(withPhone.addressTo).toEqual({
      address1: "Gedimino pr. 1",
      city: "Vilnius",
      zip: "01103",
      country: "LT",
      firstName: "Ona",
      lastName: "Jonaitė",
      phone: "+37060000000",
    });
    expect(withoutPhone.addressTo).not.toHaveProperty("email");
    expect(withoutPhone.addressTo).not.toHaveProperty("phone");
  });

  it("refuses orders without JetPrint lines or an address", () => {
    expect(() =>
      buildJetprintOrderRequest(
        orderDocument({ items: [orderItem()] }),
        ORDER_ID,
      ),
    ).toThrow(JetprintOrderError);
    expect(() =>
      buildJetprintOrderRequest(
        orderDocument({ shippingAddress: undefined }),
        ORDER_ID,
      ),
    ).toThrow(JetprintOrderError);
  });
});

describe("jetprintRequest", () => {
  const fetchMock = vi.fn();

  const reply = (status: number, body: unknown) =>
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(body), { status }),
    );

  beforeEach(() => {
    vi.stubEnv("JETPRINT_API_URL", "http://jetprint.test/oapi/");
    vi.stubEnv("JETPRINT_API_ID", "id");
    vi.stubEnv("JETPRINT_API_SECRET", "secret");
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("posts with basic auth and unwraps the data envelope", async () => {
    reply(200, {
      code: 200,
      msg: "success",
      data: { order: { orderNo: "O_1" } },
    });

    await expect(
      jetprintRequest("/order/query", { orderNo: "O_1" }),
    ).resolves.toEqual({ order: { orderNo: "O_1" } });

    const [url, init] = fetchMock.mock.calls[0];

    expect(url).toBe("http://jetprint.test/oapi/order/query");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe(
      `Basic ${Buffer.from("id:secret").toString("base64")}`,
    );
    expect(JSON.parse(init.body)).toEqual({ orderNo: "O_1" });
  });

  it("returns bare bodies as they come", async () => {
    reply(200, { status: 1 });

    await expect(
      jetprintRequest("/product/variant/status/query", { sku: "D42-Default" }),
    ).resolves.toEqual({ status: 1 });
  });

  it("raises envelope failures whatever the HTTP status", async () => {
    reply(500, { code: 400, msg: "订单:KHR-1,已经导入过了" });

    const error = await jetprintRequest("/order/submit", {}).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(JetprintApiError);
    expect(error).toMatchObject({ status: 500, code: 400 });
    expect((error as JetprintApiError).isDuplicateOrder).toBe(true);
  });

  it("raises non-envelope HTTP errors such as a rejected login", async () => {
    reply(401, { status: 401, error: "Unauthorized" });

    const error = await jetprintRequest("/order/query", {}).catch(
      (caught: unknown) => caught,
    );

    expect(error).toBeInstanceOf(JetprintApiError);
    expect(error).toMatchObject({ status: 401, detail: "Unauthorized" });
    expect((error as JetprintApiError).isDuplicateOrder).toBe(false);
  });

  it("refuses to run without credentials", async () => {
    vi.stubEnv("JETPRINT_API_SECRET", "");

    await expect(jetprintRequest("/order/query", {})).rejects.toBeInstanceOf(
      JetprintConfigError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
