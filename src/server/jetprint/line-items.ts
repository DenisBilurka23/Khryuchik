import "server-only";

import { findProductsByIds } from "@/server/catalog/repositories/products.repository";
import type { CartSelections } from "@/types/cart";
import type { OrderItemJetprintLink } from "@/types/order";
import { resolveSellableJetprintVariant } from "@/utils";

export type JetprintLineItemInput = {
  id: string;
  productId: string;
  selections?: CartSelections;
};

export const resolveJetprintLineItems = async (
  items: JetprintLineItemInput[],
): Promise<Map<string, OrderItemJetprintLink> | null> => {
  const products = await findProductsByIds(
    Array.from(new Set(items.map((item) => item.productId))),
  );
  const linkByProductId = new Map(
    products.map((product) => [product.productId, product.jetprint]),
  );
  const linkByItemId = new Map<string, OrderItemJetprintLink>();

  for (const item of items) {
    const link = linkByProductId.get(item.productId);

    if (!link) {
      continue;
    }

    const variant = resolveSellableJetprintVariant(link, {
      size: item.selections?.size,
      color: item.selections?.color,
    });

    if (!variant) {
      console.error(
        `No sellable JetPrint variant matches product ${item.productId} for the selected options`,
      );

      return null;
    }

    linkByItemId.set(item.id, {
      sku: variant.sku,
      printFiles: link.printFiles,
      previewFiles: link.previewFiles,
    });
  }

  return linkByItemId;
};
