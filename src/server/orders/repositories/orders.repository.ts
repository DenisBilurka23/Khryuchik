import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  OrderDocument,
  OrderPaymentInfo,
  OrderPrintifyInfo,
  OrderStatus,
} from "@/types/order";

const collectionName = "orders";

const getOrdersCollection = async () => {
  const db = await getMongoDb();

  return db.collection<OrderDocument>(collectionName);
};

export const insertOrder = async (
  order: OrderDocument,
): Promise<OrderDocument> => {
  const collection = await getOrdersCollection();

  await collection.insertOne(order);

  return order;
};

export const findOrderById = async (
  id: string,
): Promise<OrderDocument | null> => {
  const collection = await getOrdersCollection();

  return collection.findOne({ id }, { projection: { _id: 0 } });
};

export const findOrderByStripeSessionId = async (
  stripeSessionId: string,
): Promise<OrderDocument | null> => {
  const collection = await getOrdersCollection();

  return collection.findOne(
    { "payment.stripeSessionId": stripeSessionId },
    { projection: { _id: 0 } },
  );
};

export const findOrderByStripePaymentIntentId = async (
  stripePaymentIntentId: string,
): Promise<OrderDocument | null> => {
  const collection = await getOrdersCollection();

  return collection.findOne(
    { "payment.stripePaymentIntentId": stripePaymentIntentId },
    { projection: { _id: 0 } },
  );
};

export type FindOrdersOptions = {
  limit?: number | null;
};

export const findOrdersForUser = async (
  userId: string | undefined,
  email: string | undefined,
  options: FindOrdersOptions = {},
): Promise<OrderDocument[]> => {
  const conditions: Record<string, unknown>[] = [];

  if (userId) {
    conditions.push({ userId });
  }
  if (email) {
    conditions.push({ "customer.email": email });
  }

  if (conditions.length === 0) {
    return [];
  }

  const collection = await getOrdersCollection();
  const { limit = 50 } = options;

  const cursor = collection
    .find(conditions.length === 1 ? conditions[0] : { $or: conditions }, {
      projection: { _id: 0 },
    })
    .sort({ createdAt: -1 });

  if (typeof limit === "number") {
    cursor.limit(limit);
  }

  return cursor.toArray();
};

export const findOrders = async (
  options: FindOrdersOptions = {},
): Promise<OrderDocument[]> => {
  const collection = await getOrdersCollection();
  const { limit = 100 } = options;

  const cursor = collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 });

  if (typeof limit === "number") {
    cursor.limit(limit);
  }

  return cursor.toArray();
};

export const updateOrderPayment = async (
  id: string,
  patch: Partial<OrderPaymentInfo>,
): Promise<void> => {
  const collection = await getOrdersCollection();
  const $set: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) {
      $set[`payment.${key}`] = value;
    }
  }

  if (Object.keys($set).length === 0) {
    return;
  }

  await collection.updateOne({ id }, { $set });
};

export type OrderPrintifyInfoPatch = {
  [Key in keyof OrderPrintifyInfo]?: OrderPrintifyInfo[Key] | null;
};

export const updateOrderPrintifyOrder = async (
  id: string,
  patch: OrderPrintifyInfoPatch,
): Promise<void> => {
  const collection = await getOrdersCollection();
  const $set: Record<string, unknown> = {};
  const $unset: Record<string, "" | 1 | true> = {};

  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) {
      continue;
    }

    if (value === null) {
      $unset[`printifyOrder.${key}`] = "";
    } else {
      $set[`printifyOrder.${key}`] = value;
    }
  }

  if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
    return;
  }

  await collection.updateOne(
    { id },
    {
      ...(Object.keys($set).length > 0 ? { $set } : {}),
      ...(Object.keys($unset).length > 0 ? { $unset } : {}),
    },
  );
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<void> => {
  const collection = await getOrdersCollection();

  await collection.updateOne({ id }, { $set: { status } });
};

export const deleteOrder = async (id: string): Promise<void> => {
  const collection = await getOrdersCollection();

  await collection.deleteOne({ id });
};
