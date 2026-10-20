import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/email/order-status-email", () => ({
  sendOrderStatusEmail: vi.fn(),
}));
vi.mock("@/server/payments/telegram", () => ({
  notifyAdminJetprintOrderSubmitted: vi.fn(),
  notifyAdminJetprintOrderFailed: vi.fn(),
  notifyAdminJetprintOrderCancelled: vi.fn(),
  notifyAdminJetprintUnknownStatus: vi.fn(),
}));
vi.mock("@/server/orders/repositories/orders.repository", () => ({
  findOrderById: vi.fn(),
  findOrdersAwaitingJetprint: vi.fn(),
  updateOrderFulfillment: vi.fn(),
  updateOrderJetprintOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
}));
vi.mock("@/server/jetprint/services/jetprint-order.service", () => ({
  submitJetprintOrder: vi.fn(),
  fetchJetprintOrder: vi.fn(),
  cancelJetprintOrder: vi.fn(),
}));

import {
  fetchJetprintOrder,
  submitJetprintOrder,
} from "@/server/jetprint/services/jetprint-order.service";
import { sendOrderStatusEmail } from "@/server/email/order-status-email";
import {
  findOrderById,
  updateOrderFulfillment,
  updateOrderJetprintOrder,
  updateOrderStatus,
} from "@/server/orders/repositories/orders.repository";
import {
  submitOrderToJetprint,
  syncOrderFromJetprint,
} from "@/server/orders/services/jetprint-fulfillment.service";
import type { OrderDocument } from "@/types/order";

const makeOrder = (overrides: Partial<OrderDocument> = {}): OrderDocument => ({
  id: "order-1",
  createdAt: "2026-10-20T00:00:00Z",
  locale: "en",
  region: "europe",
  currency: "EUR",
  items: [
    {
      productId: "bag",
      slug: "bag",
      title: "Bag",
      emoji: "bag",
      quantity: 1,
      unitPrice: 30,
      lineTotal: 30,
      jetprint: {
        sku: "D42-Default",
        printFiles: [{ name: "print", url: "https://cdn.test/print.png" }],
        previewFiles: [
          { name: "preview", url: "https://cdn.test/preview.png" },
        ],
      },
    },
  ],
  subtotal: 30,
  shipping: 5,
  discount: 0,
  total: 35,
  customer: {
    firstName: "Test",
    lastName: "Customer",
    email: "test@example.com",
  },
  payment: { method: "stripe", status: "paid" },
  status: "new",
  fulfillments: [
    {
      id: "jetprint",
      source: "jetprint",
      provider: "jetprint",
      service: "standard",
      amount: 5,
      currency: "EUR",
    },
  ],
  ...overrides,
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(submitJetprintOrder).mockResolvedValue({
    orderNo: "remote-new",
    customerOrderNo: "order-1",
    orderStatus: 1,
  });
  vi.mocked(findOrderById).mockResolvedValue(null);
});

describe("JetPrint submission guards", () => {
  const cancelled = {
    orderNo: "remote-old",
    customerOrderNo: "order-1",
    status: 99,
    cancelledAt: "2026-10-19T00:00:00Z",
  };

  it("does not resubmit an externally cancelled order on an automatic retry", async () => {
    expect(
      await submitOrderToJetprint(makeOrder({ jetprintOrder: cancelled })),
    ).toBe(false);
    expect(submitJetprintOrder).not.toHaveBeenCalled();
    expect(updateOrderJetprintOrder).not.toHaveBeenCalled();
  });

  it("allows an explicit admin resubmission with a new external number", async () => {
    const order = makeOrder({ jetprintOrder: cancelled });
    expect(
      await submitOrderToJetprint(order, { allowResubmission: true }),
    ).toBe(true);
    expect(submitJetprintOrder).toHaveBeenCalledWith(order, "order-1-2");
  });

  it.each([false, true])(
    "does not send a locally cancelled order, manual=%s",
    async (allowResubmission) => {
      expect(
        await submitOrderToJetprint(makeOrder({ status: "cancelled" }), {
          allowResubmission,
        }),
      ).toBe(false);
      expect(submitJetprintOrder).not.toHaveBeenCalled();
    },
  );

  it("does not send an unpaid order", async () => {
    expect(
      await submitOrderToJetprint(
        makeOrder({ payment: { method: "stripe", status: "pending" } }),
      ),
    ).toBe(false);
    expect(submitJetprintOrder).not.toHaveBeenCalled();
  });

  it("reuses the customer number after a failed submission", async () => {
    const order = makeOrder({
      jetprintOrder: { customerOrderNo: "order-1-2", lastError: "timeout" },
    });
    expect(await submitOrderToJetprint(order)).toBe(true);
    expect(submitJetprintOrder).toHaveBeenCalledWith(order, "order-1-2");
  });
});

describe("JetPrint waybill synchronization", () => {
  it("emails new tracking numbers that arrive after the order was marked shipped", async () => {
    const order = makeOrder({
      status: "shipped",
      jetprintOrder: { orderNo: "remote-1", status: 4 },
    });
    order.fulfillments![0].trackingNumber = "ONE";
    vi.mocked(fetchJetprintOrder).mockResolvedValue({
      orderNo: "remote-1",
      customerOrderNo: "order-1",
      orderStatus: 4,
      waybills: [
        { trackingNumber: "ONE", waybillStatus: 3 },
        { trackingNumber: "TWO", waybillStatus: 3 },
      ],
    });
    const updated = makeOrder({
      ...order,
      fulfillments: [
        {
          ...order.fulfillments![0],
          trackings: [{ number: "ONE" }, { number: "TWO" }],
        },
      ],
    });
    vi.mocked(findOrderById).mockResolvedValue(updated);
    await syncOrderFromJetprint(order);
    expect(sendOrderStatusEmail).toHaveBeenCalledWith(updated, undefined);
    expect(updateOrderStatus).not.toHaveBeenCalled();
    vi.clearAllMocks();
    await syncOrderFromJetprint(updated);
    expect(sendOrderStatusEmail).not.toHaveBeenCalled();
  });

  it("preserves tracking if the API response omits waybills entirely", async () => {
    const order = makeOrder({
      jetprintOrder: { orderNo: "remote-1", status: 2 },
    });
    order.fulfillments![0].trackingNumber = "ONE";
    vi.mocked(fetchJetprintOrder).mockResolvedValue({
      orderNo: "remote-1",
      customerOrderNo: "order-1",
      orderStatus: 2,
    });
    await syncOrderFromJetprint(order);
    expect(updateOrderFulfillment).toHaveBeenCalledWith("order-1", "jetprint", {
      status: "inProduction",
    });
  });

  it("stores every live tracking number and ignores deleted waybills", async () => {
    vi.mocked(fetchJetprintOrder).mockResolvedValue({
      orderNo: "remote-1",
      customerOrderNo: "order-1",
      orderStatus: 4,
      waybills: [
        {
          trackingNumber: "ONE",
          carrier: "Carrier A",
          trackingUrl: "https://track.test/1",
          waybillStatus: 3,
        },
        { trackingNumber: "DELETED", waybillStatus: 4 },
        { trackingNumber: "TWO", carrier: "Carrier B", waybillStatus: 3 },
      ],
    });
    await syncOrderFromJetprint(
      makeOrder({ jetprintOrder: { orderNo: "remote-1", status: 2 } }),
    );
    expect(updateOrderFulfillment).toHaveBeenCalledWith(
      "order-1",
      "jetprint",
      expect.objectContaining({
        trackings: [
          { number: "ONE", carrier: "Carrier A", url: "https://track.test/1" },
          { number: "TWO", carrier: "Carrier B" },
        ],
        trackingNumber: "ONE",
      }),
    );
  });

  it("recognizes shipment on a waybill after the first one", async () => {
    vi.mocked(fetchJetprintOrder).mockResolvedValue({
      orderNo: "remote-1",
      customerOrderNo: "order-1",
      orderStatus: 1,
      waybills: [
        { trackingNumber: "ONE", waybillStatus: 1 },
        { trackingNumber: "TWO", waybillStatus: 3 },
      ],
    });
    await syncOrderFromJetprint(
      makeOrder({ jetprintOrder: { orderNo: "remote-1" } }),
    );
    expect(updateOrderStatus).toHaveBeenCalledWith("order-1", "shipped");
  });

  it("removes stale tracking fields when the waybill is deleted", async () => {
    const order = makeOrder({
      jetprintOrder: { orderNo: "remote-1", status: 2 },
    });
    order.fulfillments![0].trackingNumber = "OLD";
    order.fulfillments![0].trackingUrl = "https://track.test/old";
    vi.mocked(fetchJetprintOrder).mockResolvedValue({
      orderNo: "remote-1",
      customerOrderNo: "order-1",
      orderStatus: 2,
      waybills: [{ trackingNumber: "OLD", waybillStatus: 4 }],
    });
    await syncOrderFromJetprint(order);
    expect(updateOrderFulfillment).toHaveBeenCalledWith(
      "order-1",
      "jetprint",
      expect.objectContaining({
        trackings: [],
        trackingNumber: null,
        trackingUrl: null,
      }),
    );
  });
});
