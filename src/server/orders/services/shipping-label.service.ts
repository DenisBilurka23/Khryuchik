import "server-only";

import { updateOrderFulfillment } from "@/server/orders/repositories/orders.repository";
import { findShippingProvider } from "@/server/shipping/providers/registry";
import type { OrderDocument } from "@/types/order";
import { formatCustomerName, isIsoCountryCode } from "@/utils";

export type BuyOrderLabelResult =
  | { status: "ok" }
  | { status: "unknown_parcel" }
  | { status: "unsupported" }
  | { status: "already_tracked" }
  | { status: "missing_parcel" }
  | { status: "missing_address" }
  | { status: "failed"; reason: string };

export const buyOrderLabel = async (
  order: OrderDocument,
  fulfillmentId: string,
): Promise<BuyOrderLabelResult> => {
  const fulfillment = order.fulfillments?.find(
    (candidate) => candidate.id === fulfillmentId,
  );

  if (!fulfillment) {
    return { status: "unknown_parcel" };
  }

  if (fulfillment.trackingNumber) {
    return { status: "already_tracked" };
  }

  const provider = findShippingProvider(fulfillment.provider);

  if (!provider?.buyLabel) {
    return { status: "unsupported" };
  }

  // Orders placed before parcels carried their own dimensions cannot be bought
  // for: re-deriving the parcel could quietly disagree with what was paid.
  if (!fulfillment.parcel) {
    return { status: "missing_parcel" };
  }

  const address = order.shippingAddress;

  if (!address || !isIsoCountryCode(address.country)) {
    return { status: "missing_address" };
  }

  const result = await provider.buyLabel({
    orderId: order.id,
    service: fulfillment.service,
    externalId: fulfillment.externalId,
    parcel: fulfillment.parcel,
    valueCurrency: order.currency,
    recipient: {
      name: formatCustomerName(order.customer),
      email: order.customer.email,
      phone: order.customer.phone,
      destination: {
        country: address.country,
        region: address.region,
        city: address.city,
        postalCode: address.postalCode,
        line1: address.line1,
      },
    },
  });

  if (result.status === "failed") {
    await updateOrderFulfillment(order.id, fulfillmentId, {
      lastError: result.reason,
    });

    return { status: "failed", reason: result.reason };
  }

  // Postage was paid for but the response carried no tracking number. Record the
  // carrier's id regardless: the money is gone, and that id is the only way to
  // find the label by hand.
  if (result.status === "bought-unparsed") {
    const reason = `Label bought as ${result.externalId}, but no tracking number came back (${result.detail})`;

    await updateOrderFulfillment(order.id, fulfillmentId, {
      labelExternalId: result.externalId,
      lastError: reason,
    });

    return { status: "failed", reason };
  }

  await updateOrderFulfillment(order.id, fulfillmentId, {
    labelExternalId: result.externalId,
    carrier: result.label.carrier ?? null,
    trackingNumber: result.label.trackingNumber ?? null,
    trackingUrl: result.label.trackingUrl ?? null,
    labelAmount: result.label.amount ?? null,
    labelUrl: result.label.labelUrl ?? null,
    shippedAt: fulfillment.shippedAt ?? new Date().toISOString(),
    lastError: null,
  });

  return { status: "ok" };
};
