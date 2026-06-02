import "server-only";

import { getMongoDb } from "@/server/db/mongodb";
import type {
  OrderDocument,
  OrderPaymentInfo,
  OrderStatus,
} from "@/types/order";

const collectionName = "orders";

const getOrdersCollection = async () => {
  const db = await getMongoDb();

  return db.collection<OrderDocument>(collectionName);
};

export const insertOrder = async (order: OrderDocument): Promise<OrderDocument> => {
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

export type FindOrdersOptions = {
  limit?: number;
};

export const findOrders = async (
  options: FindOrdersOptions = {},
): Promise<OrderDocument[]> => {
  const collection = await getOrdersCollection();
  const { limit = 100 } = options;

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
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

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
): Promise<void> => {
  const collection = await getOrdersCollection();

  await collection.updateOne({ id }, { $set: { status } });
};
