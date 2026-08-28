import "server-only";

import {
  decrementPrintedStock,
  findProductsByIds,
  restorePrintedStock,
} from "@/server/catalog/repositories/products.repository";
import {
  claimPrintedStockApplication,
  releasePrintedStockApplication,
  savePrintedStockMovements,
} from "@/server/orders/repositories/orders.repository";
import { hubForProvider } from "@/server/shipping/providers/registry";
import { chooseHubs } from "@/server/shipping/utils";
import { BOOK_FORMAT } from "@/constants/catalog";
import type { ProductDocument } from "@/types/catalog";
import type { OrderDocument, OrderPrintedStockMovement } from "@/types/order";
import type { ShippingHubCode } from "@/types/shipping";
import type { CountryCode } from "@/utils";
import { getStockedHubs, hasPrintedStock } from "@/utils";

export type PrintedStockLine = {
  id: string;
  productId: string;
  quantity: number;
  isDigital: boolean;
  language?: string;
};

const shippingHubsFor = (
  product: ProductDocument,
  language: string | undefined,
  destinationCountry: CountryCode,
) => {
  const stocked = getStockedHubs(product.shipping?.stockByLanguage, language);

  return chooseHubs(
    destinationCountry,
    stocked.length > 0 ? stocked : (product.shipping?.hubs ?? []),
  );
};

const isShelfLine = (line: PrintedStockLine, product?: ProductDocument) =>
  !line.isDigital &&
  Boolean(line.language) &&
  !product?.printify &&
  Boolean(product?.shipping);

type ShelfGroup = {
  productId: string;
  language: string;
  quantity: number;
  lineIds: string[];
};

const groupShelfLines = (
  lines: PrintedStockLine[],
  productById: Map<string, ProductDocument>,
): ShelfGroup[] => {
  const grouped = new Map<string, ShelfGroup>();

  for (const line of lines) {
    if (!isShelfLine(line, productById.get(line.productId)) || !line.language) {
      continue;
    }

    const key = `${line.productId}|${line.language}`;
    const stored = grouped.get(key);

    grouped.set(key, {
      productId: line.productId,
      language: line.language,
      quantity: (stored?.quantity ?? 0) + line.quantity,
      lineIds: [...(stored?.lineIds ?? []), line.id],
    });
  }

  return [...grouped.values()];
};

const loadProducts = async (lines: PrintedStockLine[]) => {
  const products = await findProductsByIds(
    Array.from(new Set(lines.map((line) => line.productId))),
  );

  return new Map(products.map((product) => [product.productId, product]));
};

export const findUnstockedPrintedLines = async (
  lines: PrintedStockLine[],
  destinationCountry: CountryCode,
): Promise<Set<string>> => {
  const candidates = lines.filter((line) => !line.isDigital);
  const unstocked = new Set<string>();

  if (candidates.length === 0) {
    return unstocked;
  }

  const productById = await loadProducts(candidates);

  for (const group of groupShelfLines(candidates, productById)) {
    const product = productById.get(group.productId);

    if (!product) {
      continue;
    }

    const hubs = shippingHubsFor(product, group.language, destinationCountry);

    if (
      !hasPrintedStock(
        product.shipping?.stockByLanguage,
        group.language,
        hubs,
        group.quantity,
      )
    ) {
      for (const lineId of group.lineIds) {
        unstocked.add(lineId);
      }
    }
  }

  return unstocked;
};

const pickHub = (
  hubs: ShippingHubCode[],
  order: OrderDocument,
): ShippingHubCode | undefined => {
  if (hubs.length <= 1) {
    return hubs[0];
  }

  const fulfillment = order.fulfillments?.find(
    (entry) => entry.id === `manual:${hubs.join("-")}`,
  );
  const shipped = fulfillment && hubForProvider(fulfillment.provider);

  return shipped ?? hubs[0];
};

const toOrderLines = (order: OrderDocument): PrintedStockLine[] =>
  order.items.map((item, index) => ({
    id: `${item.productId}-${index}`,
    productId: item.productId,
    quantity: item.quantity,
    isDigital:
      Boolean(item.printify) || item.formatSelection === BOOK_FORMAT.digital,
    language: item.languageSelection,
  }));

export const applyOrderPrintedStock = async (order: OrderDocument) => {
  const lines = toOrderLines(order).filter((line) => !line.isDigital);

  if (lines.length === 0) {
    return;
  }

  const productById = await loadProducts(lines);
  const groups = groupShelfLines(lines, productById);

  if (groups.length === 0) {
    return;
  }

  if (!(await claimPrintedStockApplication(order.id))) {
    return;
  }

  const destinationCountry = (order.shippingAddress?.country ??
    order.country) as CountryCode;
  const applied: OrderPrintedStockMovement[] = [];

  for (const group of groups) {
    const product = productById.get(group.productId);
    const hub =
      product &&
      pickHub(
        shippingHubsFor(product, group.language, destinationCountry),
        order,
      );

    if (!hub) {
      continue;
    }

    const movement = {
      productId: group.productId,
      language: group.language,
      hub,
      quantity: group.quantity,
    };

    if (
      await decrementPrintedStock(
        movement.productId,
        movement.language,
        movement.hub,
        movement.quantity,
      )
    ) {
      applied.push(movement);
      continue;
    }

    console.error(
      `Order ${order.id}: not enough printed stock of ${group.productId} (${group.language}) in ${hub}`,
    );
  }

  await savePrintedStockMovements(order.id, applied);
};

export const restoreOrderPrintedStock = async (order: OrderDocument) => {
  const movements = await releasePrintedStockApplication(order.id);

  if (!movements) {
    return;
  }

  for (const movement of movements) {
    await restorePrintedStock(
      movement.productId,
      movement.language,
      movement.hub,
      movement.quantity,
    );
  }
};
