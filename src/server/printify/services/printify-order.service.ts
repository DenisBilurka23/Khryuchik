import "server-only";

import {
  PRINTIFY_RESTRICTED_COUNTRIES,
  PRINTIFY_STANDARD_SHIPPING_METHOD,
} from "@/constants/printify";
import type { OrderDocument } from "@/types/order";
import { formatOrderNumber } from "@/utils";

import { getPrintifyConfig, printifyRequest } from "../client";
import type {
  PrintifyLineItem,
  PrintifyOrderCreatedResponse,
  PrintifyOrderRequest,
  PrintifyOrderResponse,
  PrintifyShippingAddress,
} from "../types";

const ORDER_TIMEOUT_MS = 15_000;

export const printifyOrderErrorCodes = {
  NotConfigured: "not-configured",
  NoLineItems: "no-line-items",
  MissingAddress: "missing-address",
  RestrictedDestination: "restricted-destination",
} as const;

export type PrintifyOrderErrorCode =
  (typeof printifyOrderErrorCodes)[keyof typeof printifyOrderErrorCodes];

export class PrintifyOrderError extends Error {
  constructor(readonly code: PrintifyOrderErrorCode) {
    super(code);
    this.name = "PrintifyOrderError";
  }
}

const requireShopId = () => {
  const config = getPrintifyConfig();

  if (!config?.shopId) {
    throw new PrintifyOrderError(printifyOrderErrorCodes.NotConfigured);
  }

  return config.shopId;
};

const buildPrintifyOrderLineItems = (
  order: OrderDocument,
): PrintifyLineItem[] =>
  order.items.flatMap((item) =>
    item.printify
      ? [
          {
            product_id: item.printify.printifyProductId,
            variant_id: item.printify.variantId,
            quantity: item.quantity,
          },
        ]
      : [],
  );

const buildAddressTo = (order: OrderDocument): PrintifyShippingAddress => {
  const address = order.shippingAddress;

  if (!address) {
    throw new PrintifyOrderError(printifyOrderErrorCodes.MissingAddress);
  }

  if (PRINTIFY_RESTRICTED_COUNTRIES.includes(address.country.toUpperCase())) {
    throw new PrintifyOrderError(printifyOrderErrorCodes.RestrictedDestination);
  }

  return {
    first_name: order.customer.firstName,
    last_name: order.customer.lastName,
    email: order.customer.email,
    phone: order.customer.phone ?? "",
    country: address.country,
    region: address.region ?? "",
    address1: address.line1,
    ...(address.line2 ? { address2: address.line2 } : {}),
    city: address.city,
    zip: address.postalCode ?? "",
  };
};

export const createPrintifyOrder = async (
  order: OrderDocument,
): Promise<string> => {
  const shopId = requireShopId();
  const lineItems = buildPrintifyOrderLineItems(order);

  if (lineItems.length === 0) {
    throw new PrintifyOrderError(printifyOrderErrorCodes.NoLineItems);
  }

  const payload: PrintifyOrderRequest = {
    external_id: order.id,
    label: formatOrderNumber(order.id) ?? order.id,
    line_items: lineItems,
    shipping_method: PRINTIFY_STANDARD_SHIPPING_METHOD,
    send_shipping_notification: false,
    address_to: buildAddressTo(order),
  };

  const response = await printifyRequest<PrintifyOrderCreatedResponse>(
    `/shops/${shopId}/orders.json`,
    { method: "POST", body: payload, timeoutMs: ORDER_TIMEOUT_MS },
  );

  return response.id;
};

export const fetchPrintifyOrder = async (
  printifyOrderId: string,
): Promise<PrintifyOrderResponse> => {
  const shopId = requireShopId();

  return printifyRequest<PrintifyOrderResponse>(
    `/shops/${shopId}/orders/${printifyOrderId}.json`,
    { timeoutMs: ORDER_TIMEOUT_MS },
  );
};

export const sendPrintifyOrderToProduction = async (
  printifyOrderId: string,
): Promise<void> => {
  const shopId = requireShopId();

  await printifyRequest(
    `/shops/${shopId}/orders/${printifyOrderId}/send_to_production.json`,
    { method: "POST", timeoutMs: ORDER_TIMEOUT_MS },
  );
};

export const cancelPrintifyOrder = async (
  printifyOrderId: string,
): Promise<void> => {
  const shopId = requireShopId();

  await printifyRequest(
    `/shops/${shopId}/orders/${printifyOrderId}/cancel.json`,
    { method: "POST", timeoutMs: ORDER_TIMEOUT_MS },
  );
};
