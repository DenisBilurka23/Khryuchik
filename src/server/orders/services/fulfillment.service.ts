import "server-only";

import { updateOrderPrintifyOrder } from "@/server/orders/repositories/orders.repository";
import { notifyAdminPrintifyOrderFailed } from "@/server/payments/telegram";
import { createPrintifyOrder } from "@/server/printify/services/printify-order.service";
import type { OrderDocument } from "@/types/order";

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export const submitOrderToPrintify = async (
  order: OrderDocument,
): Promise<void> => {
  if (order.printifyOrder) {
    return;
  }

  if (!order.items.some((item) => item.printify)) {
    return;
  }

  try {
    const printifyOrderId = await createPrintifyOrder(order);

    await updateOrderPrintifyOrder(order.id, {
      printifyOrderId,
      createdAt: new Date().toISOString(),
      lastError: null,
    });
  } catch (error) {
    const reason = describeError(error);

    console.error(`Failed to submit order ${order.id} to Printify`, error);

    await updateOrderPrintifyOrder(order.id, { lastError: reason }).catch(
      (updateError) =>
        console.error(
          `Failed to record the Printify error on order ${order.id}`,
          updateError,
        ),
    );

    void notifyAdminPrintifyOrderFailed(order, reason);
  }
};
