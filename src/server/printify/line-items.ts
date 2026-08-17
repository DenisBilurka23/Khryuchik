import "server-only";

import { findProductsByIds } from "@/server/catalog/repositories/products.repository";
import type { CartSelections } from "@/types/cart";
import type { OrderItemPrintifyLink } from "@/types/order";

import type { PrintifyLineItem } from "./types";
import { findPrintifyVariant } from "./variant-mapping";

export type PrintifyLineItemInput = {
  id: string;
  productId: string;
  quantity: number;
  selections?: CartSelections;
};

export type PrintifyLineItemsResolution = {
  lineItems: PrintifyLineItem[];
  linkByItemId: Map<string, OrderItemPrintifyLink>;
};

export const resolvePrintifyLineItems = async (
  items: PrintifyLineItemInput[],
): Promise<PrintifyLineItemsResolution | null> => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const products = await findProductsByIds(productIds);
  const productById = new Map(
    products.map((product) => [product.productId, product]),
  );
  const lineItems: PrintifyLineItem[] = [];
  const linkByItemId = new Map<string, OrderItemPrintifyLink>();

  for (const item of items) {
    const printify = productById.get(item.productId)?.printify;

    if (!printify) {
      continue;
    }

    const variant = findPrintifyVariant(printify.variants, {
      size: item.selections?.size,
      color: item.selections?.color,
    });

    if (!variant) {
      console.error(
        `No Printify variant matches product ${item.productId} for the selected options`,
      );

      return null;
    }

    lineItems.push({
      product_id: printify.printifyProductId,
      variant_id: variant.variantId,
      quantity: item.quantity,
    });
    linkByItemId.set(item.id, {
      printifyProductId: printify.printifyProductId,
      variantId: variant.variantId,
    });
  }

  return { lineItems, linkByItemId };
};
