import "server-only";

import jetprintBlanks from "@/data/jetprint-blanks.json";
import { findProductsByIds } from "@/server/catalog/repositories/products.repository";
import type { CartSelections } from "@/types/cart";
import type {
  JetprintBlankCatalog,
  JetprintShippingQuote,
  JetprintShippingQuoteLine,
} from "@/types/catalog";
import { quoteJetprintShipping, resolveSellableJetprintVariant } from "@/utils";

export type JetprintShippingQuoteItem = {
  productId: string;
  quantity: number;
  selections?: CartSelections;
};

const blankCatalog: JetprintBlankCatalog = jetprintBlanks;

export const getJetprintShippingQuote = async (
  items: JetprintShippingQuoteItem[],
  country: string,
): Promise<JetprintShippingQuote> => {
  const products = await findProductsByIds(
    Array.from(new Set(items.map((item) => item.productId))),
  );
  const linkByProductId = new Map(
    products.map((product) => [product.productId, product.jetprint]),
  );
  const lines: JetprintShippingQuoteLine[] = [];

  for (const item of items) {
    const variant = resolveSellableJetprintVariant(
      linkByProductId.get(item.productId),
      { size: item.selections?.size, color: item.selections?.color },
    );

    if (!variant) {
      return { status: "unsupported-variant" };
    }

    lines.push({ sku: variant.sku, quantity: item.quantity });
  }

  return quoteJetprintShipping(lines, country, blankCatalog);
};
