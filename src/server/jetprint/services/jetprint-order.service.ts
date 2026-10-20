import "server-only";

import type { OrderDocument } from "@/types/order";

import { JetprintApiError, jetprintRequest } from "../client";
import { buildJetprintOrderRequest } from "../order-request";
import type {
  JetprintOrder,
  JetprintOrderEnvelope,
  JetprintOrderLookup,
} from "../types";

const ORDER_TIMEOUT_MS = 15_000;

export const fetchJetprintOrder = async (
  lookup: JetprintOrderLookup,
): Promise<JetprintOrder> => {
  const data = await jetprintRequest<JetprintOrderEnvelope>(
    "/order/query",
    lookup,
    { timeoutMs: ORDER_TIMEOUT_MS },
  );

  return data.order;
};

export const submitJetprintOrder = async (
  order: OrderDocument,
  customerOrderNo: string,
): Promise<JetprintOrder> => {
  const payload = buildJetprintOrderRequest(order, customerOrderNo);

  try {
    const data = await jetprintRequest<JetprintOrderEnvelope>(
      "/order/submit",
      payload,
      { timeoutMs: ORDER_TIMEOUT_MS },
    );

    return data.order;
  } catch (error) {
    if (error instanceof JetprintApiError && error.isDuplicateOrder) {
      return fetchJetprintOrder({ customerOrderNo });
    }

    throw error;
  }
};

export const cancelJetprintOrder = async (orderNo: string): Promise<void> => {
  await jetprintRequest<unknown>(
    "/order/cancel",
    { orderNo },
    { timeoutMs: ORDER_TIMEOUT_MS },
  );
};
