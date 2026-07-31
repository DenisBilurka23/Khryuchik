import type {
  PrintifyVariantLink,
  PrintifyVariantSelections,
} from "@/types/catalog";
import type {
  ProductOption,
  ProductOptionPriceDelta,
} from "@/types/product-details";
import { normalizeIdentifierPart } from "@/utils/admin";

import type { PrintifyProduct, PrintifyProductOption } from "./types";

type SelectionKey = keyof PrintifyVariantSelections;

const SELECTION_KEY_BY_OPTION_TYPE: Record<string, SelectionKey> = {
  color: "color",
  size: "size",
};

type OptionValueEntry = {
  selectionKey: SelectionKey;
  value: string;
  label: string;
};

const getSelectionKey = (option: PrintifyProductOption) =>
  SELECTION_KEY_BY_OPTION_TYPE[option.type.trim().toLowerCase()];

// Printify option titles are free text ("2XL", "Heather Grey"), so they are
// slugged into stable values the cart can round-trip. Two titles can slug to
// the same value ("S/M" and "S-M"), which would make variants ambiguous, so
// collisions fall back to the Printify value id.
const buildOptionValueIndex = (options: PrintifyProductOption[]) => {
  const index = new Map<number, OptionValueEntry>();
  const takenValuesByKey = new Map<SelectionKey, Set<string>>();

  for (const option of options) {
    const selectionKey = getSelectionKey(option);

    if (!selectionKey) {
      continue;
    }

    const takenValues = takenValuesByKey.get(selectionKey) ?? new Set<string>();
    takenValuesByKey.set(selectionKey, takenValues);

    for (const optionValue of option.values) {
      const label = optionValue.title.trim();
      const slug = normalizeIdentifierPart(label);
      const value =
        !slug || takenValues.has(slug)
          ? `${slug || "option"}-${optionValue.id}`
          : slug;

      takenValues.add(value);
      index.set(optionValue.id, { selectionKey, value, label });
    }
  }

  return index;
};

export const buildPrintifyVariantLinks = (
  product: PrintifyProduct,
): PrintifyVariantLink[] => {
  const optionValueIndex = buildOptionValueIndex(product.options);

  return product.variants.map((variant) => {
    const selections: PrintifyVariantSelections = {};

    for (const optionValueId of variant.options) {
      const entry = optionValueIndex.get(optionValueId);

      if (entry) {
        selections[entry.selectionKey] = entry.value;
      }
    }

    return {
      variantId: variant.id,
      sku: variant.sku,
      title: variant.title,
      selections,
      costCents: variant.cost,
      retailPriceCents: variant.price,
      isEnabled: variant.is_enabled,
      isAvailable: variant.is_available,
    };
  });
};

export const getPrintifyBaseRetailCents = (product: PrintifyProduct) => {
  const enabledPrices = product.variants
    .filter((variant) => variant.is_enabled)
    .map((variant) => variant.price);

  return enabledPrices.length > 0 ? Math.min(...enabledPrices) : 0;
};

const buildOptionPriceDeltaCents = (
  product: PrintifyProduct,
  optionValueIndex: Map<number, OptionValueEntry>,
) => {
  const enabledVariants = product.variants.filter(
    (variant) => variant.is_enabled,
  );
  const baseCents = getPrintifyBaseRetailCents(product);
  const collect = (pick: (current: number, price: number) => number) => {
    const pricesByValueId = new Map<number, number>();

    for (const variant of enabledVariants) {
      for (const optionValueId of variant.options) {
        if (!optionValueIndex.has(optionValueId)) {
          continue;
        }

        const current = pricesByValueId.get(optionValueId);
        pricesByValueId.set(
          optionValueId,
          current === undefined ? variant.price : pick(current, variant.price),
        );
      }
    }

    return new Map(
      [...pricesByValueId].map(([optionValueId, price]) => [
        optionValueId,
        price - baseCents,
      ]),
    );
  };

  const deltaByValueId = collect(Math.min);
  const isAdditive = enabledVariants.every(
    (variant) =>
      baseCents +
        variant.options.reduce(
          (sum, optionValueId) =>
            sum + (deltaByValueId.get(optionValueId) ?? 0),
          0,
        ) ===
      variant.price,
  );

  if (isAdditive) {
    return deltaByValueId;
  }

  console.warn(
    `Printify product ${product.id} prices variants along more than one option; option deltas were seeded from the most expensive variant.`,
  );

  return collect(Math.max);
};

const toPriceDelta = (
  deltaCents: number,
  regionCodes: string[],
): ProductOptionPriceDelta | undefined => {
  if (deltaCents === 0 || regionCodes.length === 0) {
    return undefined;
  }

  return Object.fromEntries(
    regionCodes.map((code) => [code, deltaCents / 100]),
  );
};

export const buildPrintifyProductOptions = (
  product: PrintifyProduct,
  priceDeltaRegionCodes: string[] = [],
) => {
  const optionValueIndex = buildOptionValueIndex(product.options);
  const deltaByValueId = buildOptionPriceDeltaCents(product, optionValueIndex);
  const offeredValues = new Set(
    product.variants
      .filter((variant) => variant.is_enabled)
      .flatMap((variant) => variant.options),
  );
  const optionsByKey: Record<SelectionKey, ProductOption[]> = {
    size: [],
    color: [],
  };
  const seenValues = new Set<string>();

  for (const [optionValueId, entry] of optionValueIndex) {
    if (!offeredValues.has(optionValueId) || seenValues.has(entry.value)) {
      continue;
    }

    seenValues.add(entry.value);

    const priceDelta = toPriceDelta(
      deltaByValueId.get(optionValueId) ?? 0,
      priceDeltaRegionCodes,
    );

    optionsByKey[entry.selectionKey].push({
      label: entry.label,
      value: entry.value,
      ...(priceDelta ? { priceDelta } : {}),
    });
  }

  return optionsByKey;
};

export const findPrintifyVariant = (
  variants: PrintifyVariantLink[],
  selections: PrintifyVariantSelections,
) => {
  const matches = (variant: PrintifyVariantLink) =>
    variant.selections.size === selections.size &&
    variant.selections.color === selections.color;

  if (!selections.size && !selections.color && variants.length === 1) {
    return variants[0];
  }

  return variants.find(matches);
};
