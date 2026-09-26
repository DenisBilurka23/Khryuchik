import { describe, expect, it } from "vitest";

import type { OrderDocument } from "@/types/order";
import {
  calculateOrderTotal,
  canConfirmOrderDelivery,
  formatCustomerName,
  formatOrderTracking,
  getCustomerOrderStatus,
  getOrderTrackings,
  hasLivePrintifyOrder,
  isDigitalOrderItem,
  isOrderStatus,
  isRefundableOrder,
  isReviewableOrder,
  normalizeOrderEmail,
  toAccountOrder,
} from "@/utils/order";

const orderDocument = (
  overrides: Partial<OrderDocument> = {},
): OrderDocument => ({
  id: "order-1",
  createdAt: "2026-09-25T00:00:00.000Z",
  locale: "en",
  country: "US",
  currency: "USD",
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  customer: {
    firstName: "Test",
    lastName: "Customer",
    email: "customer@example.com",
  },
  payment: { method: "stripe", status: "paid" },
  status: "new",
  fulfillmentType: "physical",
  ...overrides,
});

describe("calculateOrderTotal", () => {
  it("combines subtotal, shipping, and discount on the cents grid", () => {
    expect(
      calculateOrderTotal({ subtotal: 19.99, shipping: 5.5, discount: 3 }),
    ).toBe(22.49);
  });

  it("does not become negative for a full discount and free shipping", () => {
    expect(
      calculateOrderTotal({ subtotal: 49.99, shipping: 0, discount: 49.99 }),
    ).toBe(0);
  });
});

describe("order formatting and guards", () => {
  it("normalizes customer identity fields", () => {
    expect(normalizeOrderEmail("  ADA@EXAMPLE.COM ")).toBe("ada@example.com");
    expect(
      formatCustomerName({
        firstName: " Ada ",
        lastName: " Lovelace ",
        email: "ada@example.com",
      }),
    ).toBe("Ada Lovelace");
  });

  it("recognizes digital order items", () => {
    const item = {
      productId: "book-1",
      slug: "book-1",
      title: "Book",
      emoji: "book",
      unitPrice: 10,
      quantity: 1,
      lineTotal: 10,
    };

    expect(isDigitalOrderItem(item)).toBe(true);
    expect(isDigitalOrderItem({ ...item, formatSelection: "digital" })).toBe(
      true,
    );
    expect(isDigitalOrderItem({ ...item, formatSelection: "printed" })).toBe(
      false,
    );
  });

  it("recognizes active Printify orders", () => {
    expect(
      hasLivePrintifyOrder({
        printifyOrder: { printifyOrderId: "printify-1" },
      }),
    ).toBe(true);
    expect(
      hasLivePrintifyOrder({
        printifyOrder: {
          printifyOrderId: "printify-1",
          cancelledAt: "2026-09-25T00:00:00.000Z",
        },
      }),
    ).toBe(false);
    expect(hasLivePrintifyOrder({})).toBe(false);
  });

  it.each(["new", "processing", "shipped", "delivered", "cancelled"])(
    "accepts the %s order status",
    (status) => {
      expect(isOrderStatus(status)).toBe(true);
    },
  );

  it("rejects an unknown order status", () => {
    expect(isOrderStatus("unknown")).toBe(false);
    expect(isOrderStatus(null)).toBe(false);
  });
});

describe("order tracking", () => {
  it("keeps only fulfillment entries with a tracking number", () => {
    expect(
      getOrderTrackings({
        fulfillments: [
          {
            source: "manual",
            carrier: "bpost",
            trackingNumber: "TRACK-1",
            trackingUrl: "https://example.com/track/1",
          },
          { source: "printify", carrier: "Printify" },
        ],
      }),
    ).toEqual([
      {
        carrier: "bpost",
        number: "TRACK-1",
        url: "https://example.com/track/1",
        source: "manual",
      },
    ]);
    expect(getOrderTrackings({})).toEqual([]);
  });

  it("formats the carrier and tracking number", () => {
    const formatted = formatOrderTracking({
      carrier: "bpost",
      number: "TRACK-1",
    });

    expect(formatted).toContain("bpost");
    expect(formatted).toContain("TRACK-1");
  });
});

describe("isRefundableOrder", () => {
  it("allows an unreimbursed paid Stripe order with a payment intent", () => {
    expect(
      isRefundableOrder({
        payment: {
          method: "stripe",
          status: "paid",
          stripePaymentIntentId: "pi_123",
        },
      }),
    ).toBe(true);
  });

  it.each([
    [
      {
        method: "cod",
        status: "paid" as const,
        stripePaymentIntentId: "pi_123",
      },
    ],
    [
      {
        method: "stripe",
        status: "pending" as const,
        stripePaymentIntentId: "pi_123",
      },
    ],
    [{ method: "stripe", status: "paid" as const }],
    [
      {
        method: "stripe",
        status: "paid" as const,
        stripePaymentIntentId: "pi_123",
        refundedAmount: 0,
      },
    ],
  ])("rejects a non-refundable payment", (payment) => {
    expect(isRefundableOrder({ payment })).toBe(false);
  });
});

describe("getCustomerOrderStatus", () => {
  it.each([
    ["cancelled", "refunded", "physical", "cancelled"],
    ["delivered", "refunded", "physical", "refunded"],
    ["delivered", "paid", "physical", "delivered"],
    ["shipped", "paid", "physical", "shipped"],
    ["processing", "paid", "physical", "confirmed"],
    ["new", "paid", "digital", "completed"],
    ["new", "paid", "physical", "confirmed"],
    ["new", "pending", "physical", "pending"],
  ] as const)(
    "maps %s/%s/%s to %s",
    (status, paymentStatus, fulfillmentType, expected) => {
      expect(
        getCustomerOrderStatus({
          status,
          payment: { status: paymentStatus },
          fulfillmentType,
        }),
      ).toBe(expected);
    },
  );
});

describe("isReviewableOrder", () => {
  it("allows delivered paid orders", () => {
    expect(
      isReviewableOrder({
        status: "delivered",
        payment: { status: "paid" },
        fulfillmentType: "physical",
      }),
    ).toBe(true);
  });

  it("allows completed digital orders", () => {
    expect(
      isReviewableOrder({
        status: "new",
        payment: { status: "paid" },
        fulfillmentType: "digital",
      }),
    ).toBe(true);
  });

  it("rejects unpaid and in-transit orders", () => {
    expect(
      isReviewableOrder({
        status: "delivered",
        payment: { status: "cod_pending" },
        fulfillmentType: "physical",
      }),
    ).toBe(false);
    expect(
      isReviewableOrder({
        status: "shipped",
        payment: { status: "paid" },
        fulfillmentType: "physical",
      }),
    ).toBe(false);
  });
});

describe("canConfirmOrderDelivery", () => {
  it("allows paid and cash-on-delivery physical orders", () => {
    expect(canConfirmOrderDelivery(orderDocument())).toBe(true);
    expect(
      canConfirmOrderDelivery(
        orderDocument({ payment: { method: "cod", status: "cod_pending" } }),
      ),
    ).toBe(true);
  });

  it("rejects digital, delivered, cancelled, and unpaid orders", () => {
    expect(
      canConfirmOrderDelivery(orderDocument({ fulfillmentType: "digital" })),
    ).toBe(false);
    expect(
      canConfirmOrderDelivery(orderDocument({ status: "delivered" })),
    ).toBe(false);
    expect(
      canConfirmOrderDelivery(orderDocument({ status: "cancelled" })),
    ).toBe(false);
    expect(
      canConfirmOrderDelivery(
        orderDocument({
          payment: { method: "stripe", status: "pending" },
        }),
      ),
    ).toBe(false);
  });
});

describe("toAccountOrder", () => {
  it("maps persisted order details to the account view model", () => {
    const accountOrder = toAccountOrder(
      orderDocument({
        id: "order-123456",
        total: 12,
        status: "shipped",
        items: [
          {
            productId: "book-1",
            slug: "book-1",
            title: "Book",
            emoji: "book",
            unitPrice: 12,
            quantity: 1,
            lineTotal: 12,
            formatSelection: "printed",
          },
        ],
        fulfillments: [
          {
            id: "manual:europe",
            source: "manual",
            provider: "bpost",
            service: "standard",
            amount: 5,
            currency: "EUR",
            trackingNumber: "TRACK-1",
          },
        ],
      }),
      "en",
    );

    expect(accountOrder).toMatchObject({
      id: "order-123456",
      number: "#ORDER-12",
      status: "shipped",
      canConfirmDelivery: true,
      canReview: false,
      items: [
        {
          productId: "book-1",
          slug: "book-1",
          title: "Book",
          quantity: 1,
        },
      ],
      trackings: [{ number: "TRACK-1", source: "manual" }],
    });
  });
});
