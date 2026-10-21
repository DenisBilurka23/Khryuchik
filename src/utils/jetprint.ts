import {
  JETPRINT_DUPLICATE_ORDER_MARKER,
  JETPRINT_ORDER_STATUS,
  JETPRINT_ORDER_STATUS_MAP,
} from "@/constants/jetprint";
import { orderStatusRank } from "@/constants/order";
import type { JetprintOrderStatusKey, OrderStatus } from "@/types/order";
import type {
  JetprintBlank,
  JetprintBlankCatalog,
  JetprintShippingBand,
  JetprintShippingQuote,
  JetprintShippingQuoteLine,
  JetprintVariantLink,
  JetprintVariantSelections,
  ProductJetprintLink,
} from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";

import { toProductOptionValue } from "./product-options";

const pickBlankVariants = (blank: JetprintBlank, skus: string[]) => {
  const selected = new Set(skus);

  return blank.variants.filter((variant) => selected.has(variant.sku));
};

const collectProductOptions = (labels: (string | undefined)[]) => {
  const seen = new Set<string>();

  return labels.flatMap<ProductOption>((label) => {
    const value = label ? toProductOptionValue(label) : "";

    if (!label || !value || seen.has(value)) {
      return [];
    }

    seen.add(value);

    return [{ label, value }];
  });
};

export const buildJetprintVariantLinks = (
  blank: JetprintBlank,
  skus: string[],
): JetprintVariantLink[] =>
  pickBlankVariants(blank, skus).map((variant) => ({
    sku: variant.sku,
    selections: {
      ...(variant.size ? { size: toProductOptionValue(variant.size) } : {}),
      ...(variant.color ? { color: toProductOptionValue(variant.color) } : {}),
    },
    isAvailable: true,
  }));

export const buildJetprintProductOptions = (
  blank: JetprintBlank,
  skus: string[],
) => {
  const variants = pickBlankVariants(blank, skus);

  return {
    sizes: collectProductOptions(variants.map((variant) => variant.size)),
    colors: collectProductOptions(variants.map((variant) => variant.color)),
  };
};

export const resolveJetprintBlankId = (
  catalog: JetprintBlankCatalog,
  link: ProductJetprintLink | undefined,
) => {
  if (link?.blankId && catalog[link.blankId]) {
    return link.blankId;
  }

  const sku = link?.variants[0]?.sku;

  return sku ? findJetprintBlankBySku(catalog, sku)?.blankId : undefined;
};

export const findJetprintVariant = (
  variants: JetprintVariantLink[],
  selections: JetprintVariantSelections,
) => {
  const sellable = variants.filter((variant) => variant.isAvailable);
  const matches = (variant: JetprintVariantLink) =>
    (variant.selections.size || undefined) === (selections.size || undefined) &&
    (variant.selections.color || undefined) === (selections.color || undefined);

  if (!selections.size && !selections.color && sellable.length === 1) {
    return sellable[0];
  }

  return sellable.find(matches);
};

export const resolveSellableJetprintVariant = (
  link: ProductJetprintLink | undefined,
  selections: JetprintVariantSelections,
) =>
  link && link.printFiles.length > 0 && link.previewFiles.length > 0
    ? findJetprintVariant(link.variants, selections)
    : undefined;

const slowestDay = (transitDays: string) =>
  Math.max(0, ...(transitDays.match(/\d+/g) ?? []).map(Number));

export const pickSlowestTransitDays = (values: string[]) =>
  values.reduce<string | undefined>(
    (slowest, value) =>
      slowest === undefined || slowestDay(value) > slowestDay(slowest)
        ? value
        : slowest,
    undefined,
  );

const toDayRange = (value: string): [number, number] | null => {
  const numbers = (value.match(/\d+/g) ?? []).map(Number);

  return numbers.length > 0 ? [numbers[0], numbers[numbers.length - 1]] : null;
};

export const addDayRanges = (first: string, second: string) => {
  const left = toDayRange(first);
  const right = toDayRange(second);

  if (!left || !right) {
    return left ? first : second;
  }

  const from = left[0] + right[0];
  const to = left[1] + right[1];

  return from === to ? String(from) : `${from}-${to}`;
};

export const roundShippingCents = (amount: number) =>
  Math.round(Number((amount * 100).toFixed(6))) / 100;

export const findJetprintBlankBySku = (
  catalog: JetprintBlankCatalog,
  sku: string,
): { blankId: string; blank: JetprintBlank } | undefined => {
  const entry = Object.entries(catalog).find(([, blank]) => blank.skus[sku]);

  return entry ? { blankId: entry[0], blank: entry[1] } : undefined;
};

const findShippingBand = (bands: JetprintShippingBand[], weightKg: number) =>
  bands.find((band) => weightKg > band.minKg && weightKg <= band.maxKg);

export const quoteJetprintShipping = (
  lines: JetprintShippingQuoteLine[],
  country: string,
  catalog: JetprintBlankCatalog,
): JetprintShippingQuote => {
  const code = country.trim().toUpperCase();
  const gramsByBlank = new Map<
    string,
    { blank: JetprintBlank; grams: number }
  >();

  for (const line of lines) {
    const match = findJetprintBlankBySku(catalog, line.sku);

    if (!match) {
      return { status: "unsupported-variant" };
    }

    const current = gramsByBlank.get(match.blankId);

    gramsByBlank.set(match.blankId, {
      blank: match.blank,
      grams:
        (current?.grams ?? 0) +
        match.blank.skus[line.sku].weightGrams * line.quantity,
    });
  }

  let amount = 0;
  const transitDays: string[] = [];

  for (const { blank, grams } of gramsByBlank.values()) {
    const group = blank.standardShipping.find((candidate) =>
      candidate.countries.includes(code),
    );
    const weightKg = grams / 1000;
    const band = group && findShippingBand(group.bands, weightKg);

    if (!group || !band) {
      return { status: "unsupported-destination" };
    }

    amount += band.perKg * weightKg + band.fee;
    transitDays.push(addDayRanges(blank.productionDays, group.deliveryDays));
  }

  const slowest = pickSlowestTransitDays(transitDays);

  return {
    status: "quoted",
    amountUsd: roundShippingCents(amount),
    ...(slowest ? { transitDays: slowest } : {}),
  };
};

export const resolveNextJetprintOrderStatus = (
  current: OrderStatus,
  jetprintStatus: number,
  hasShippedWaybill: boolean,
): OrderStatus | undefined => {
  const candidate = hasShippedWaybill
    ? "shipped"
    : JETPRINT_ORDER_STATUS_MAP[jetprintStatus];

  if (!candidate || orderStatusRank[candidate] <= orderStatusRank[current]) {
    return undefined;
  }

  return candidate;
};

export const getJetprintOrderStatusKey = (
  status: number | undefined,
): JetprintOrderStatusKey => {
  const entry = Object.entries(JETPRINT_ORDER_STATUS).find(
    ([, code]) => code === status,
  );

  return entry ? (entry[0] as JetprintOrderStatusKey) : "unknown";
};

export const isJetprintDuplicateOrderMessage = (message: string | undefined) =>
  Boolean(message?.includes(JETPRINT_DUPLICATE_ORDER_MARKER));

export const nextJetprintCustomerOrderNo = (
  orderId: string,
  previous?: string,
) => {
  if (!previous) {
    return orderId;
  }

  const suffix = previous.startsWith(`${orderId}-`)
    ? Number(previous.slice(orderId.length + 1))
    : 1;

  return `${orderId}-${Number.isInteger(suffix) && suffix > 0 ? suffix + 1 : 2}`;
};

export const mergeJetprintLink = (
  next: ProductJetprintLink | undefined,
  previous: ProductJetprintLink | undefined,
): ProductJetprintLink | undefined => {
  if (!next) {
    return undefined;
  }

  const previousBySku = new Map(
    (previous?.variants ?? []).map((variant) => [variant.sku, variant]),
  );
  const variants = next.variants.map(({ sku, selections }) => {
    const known = previousBySku.get(sku);

    return {
      sku,
      selections,
      isAvailable: known?.isAvailable ?? true,
      ...(known?.checkedAt ? { checkedAt: known.checkedAt } : {}),
    };
  });

  return {
    ...(next.blankId ? { blankId: next.blankId } : {}),
    variants,
    printFiles: next.printFiles,
    previewFiles: next.previewFiles,
    ...(next.printDesign ? { printDesign: next.printDesign } : {}),
  };
};
