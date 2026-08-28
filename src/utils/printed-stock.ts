import { SHIPPING_HUB_CODES } from "@/constants/shipping";
import type { ProductHubStock, ProductPrintedStock } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";

const countInHubs = (
  hubStock: ProductHubStock | undefined,
  hubs: readonly ShippingHubCode[],
) => hubs.reduce((sum, hub) => sum + (hubStock?.[hub] ?? 0), 0);

const isTracked = (stock?: ProductPrintedStock) =>
  Boolean(stock && Object.keys(stock).length > 0);

export const toPrintedLanguages = (stock?: ProductPrintedStock): string[] =>
  Object.entries(stock ?? {})
    .filter(([, hubStock]) => countInHubs(hubStock, SHIPPING_HUB_CODES) > 0)
    .map(([language]) => language);

export const getStockedHubs = (
  stock: ProductPrintedStock | undefined,
  language: string | undefined,
): ShippingHubCode[] => {
  if (!isTracked(stock) || !language) {
    return [];
  }

  return SHIPPING_HUB_CODES.filter(
    (hub) => (stock?.[language]?.[hub] ?? 0) > 0,
  );
};

export const getPrintedStockCount = (
  stock: ProductPrintedStock | undefined,
  language: string | undefined,
  hubs: readonly ShippingHubCode[] = SHIPPING_HUB_CODES,
) => (language ? countInHubs(stock?.[language], hubs) : 0);

export const hasPrintedStock = (
  stock: ProductPrintedStock | undefined,
  language: string | undefined,
  hubs: readonly ShippingHubCode[],
  quantity: number,
) => {
  if (!isTracked(stock)) {
    return true;
  }

  return getPrintedStockCount(stock, language, hubs) >= quantity;
};

export const isPrintedOffered = (
  printedLanguages: string[] | undefined,
  language: string | undefined,
) => {
  if (!printedLanguages || printedLanguages.length === 0) {
    return true;
  }

  return !language || printedLanguages.includes(language);
};
