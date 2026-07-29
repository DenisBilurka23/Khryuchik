import type {
  PrintifyVariantLink,
  PrintifyVariantSelections,
} from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";
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

/**
 * Storefront options for the product detail page, built from the same slugs as
 * the variant links so a cart selection always resolves to a variant. Only
 * values backed by an enabled variant are offered.
 */
export const buildPrintifyProductOptions = (product: PrintifyProduct) => {
  const optionValueIndex = buildOptionValueIndex(product.options);
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
    optionsByKey[entry.selectionKey].push({
      label: entry.label,
      value: entry.value,
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

  // A product with a single variant has no options to select, so an empty
  // selection still resolves.
  if (!selections.size && !selections.color && variants.length === 1) {
    return variants[0];
  }

  return variants.find(matches);
};
