import {
  JETPRINT_FACTORY_DIRECT_DELIVERY,
  JETPRINT_STANDARD_LOGISTICS,
} from "@/constants/jetprint";
import type { JetprintFile } from "@/types/catalog";
import type { OrderDocument } from "@/types/order";
import { formatOrderNumber } from "@/utils/format-order-number";

import type {
  JetprintAddress,
  JetprintFilePayload,
  JetprintLineItemRequest,
  JetprintOrderRequest,
} from "./types";

export const jetprintOrderErrorCodes = {
  NoLineItems: "no-line-items",
  MissingAddress: "missing-address",
} as const;

export type JetprintOrderErrorCode =
  (typeof jetprintOrderErrorCodes)[keyof typeof jetprintOrderErrorCodes];

export class JetprintOrderError extends Error {
  constructor(readonly code: JetprintOrderErrorCode) {
    super(code);
    this.name = "JetprintOrderError";
  }
}

const toFilePayloads = (files: JetprintFile[]): JetprintFilePayload[] =>
  files.map(({ name, url }) => (name ? { name, url } : { url }));

const buildLineItems = (
  order: OrderDocument,
  customerOrderNo: string,
): JetprintLineItemRequest[] =>
  order.items.flatMap((item, index) =>
    item.jetprint
      ? [
          {
            customerItemNo: `${customerOrderNo}-${index + 1}`,
            quantity: item.quantity,
            sku: item.jetprint.sku,
            previewFiles: toFilePayloads(item.jetprint.previewFiles),
            printFiles: toFilePayloads(item.jetprint.printFiles),
          },
        ]
      : [],
  );

const buildAddressTo = (order: OrderDocument): JetprintAddress => {
  const address = order.shippingAddress;

  if (!address) {
    throw new JetprintOrderError(jetprintOrderErrorCodes.MissingAddress);
  }

  return {
    address1: address.line1,
    ...(address.line2 ? { address2: address.line2 } : {}),
    city: address.city,
    zip: address.postalCode ?? "",
    country: address.country,
    ...(address.region ? { region: address.region } : {}),
    firstName: order.customer.firstName,
    lastName: order.customer.lastName,
    ...(order.customer.phone ? { phone: order.customer.phone } : {}),
  };
};

export const buildJetprintOrderRequest = (
  order: OrderDocument,
  customerOrderNo: string,
): JetprintOrderRequest => {
  const lineItems = buildLineItems(order, customerOrderNo);

  if (lineItems.length === 0) {
    throw new JetprintOrderError(jetprintOrderErrorCodes.NoLineItems);
  }

  return {
    customerOrderNo,
    isUrgent: false,
    remark: formatOrderNumber(order.id) ?? order.id,
    addressTo: buildAddressTo(order),
    shipping: {
      logisticsType: JETPRINT_STANDARD_LOGISTICS,
      deliveryType: JETPRINT_FACTORY_DIRECT_DELIVERY,
    },
    lineItems,
  };
};
