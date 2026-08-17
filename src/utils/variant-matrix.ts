import type { PrintifyVariantLink } from "@/types/catalog";
import type {
  ProductOption,
  ProductVariantAvailability,
  ProductVariantAxis,
  ProductVariantCombination,
  ProductVariantOptions,
  ProductVariantValueState,
} from "@/types/product-details";

type VariantSelections = Record<ProductVariantAxis, string>;

const OPPOSITE_AXIS: Record<ProductVariantAxis, ProductVariantAxis> = {
  size: "color",
  color: "size",
};

const AXIS_OPTIONS: Record<ProductVariantAxis, keyof ProductVariantOptions> = {
  size: "sizes",
  color: "colors",
};

const toCombinationKey = (combination: ProductVariantCombination) =>
  `${combination.size ?? ""}|${combination.color ?? ""}`;

const matchesAxis = (
  combination: ProductVariantCombination,
  axis: ProductVariantAxis,
  value: string | undefined,
) => (combination[axis] ?? "") === (value ?? "");

const isOffered = (
  options: ProductOption[] | undefined,
  value: string | undefined,
) => !value || Boolean(options?.some((option) => option.value === value));

const isSellable = (combination: ProductVariantCombination) =>
  !combination.isSoldOut;

const toAvailability = (
  candidates: ProductVariantCombination[],
): ProductVariantAvailability => {
  if (candidates.some(isSellable)) {
    return "available";
  }

  return candidates.length > 0 ? "sold-out" : "unavailable";
};

const matchesSelections = (
  combination: ProductVariantCombination,
  selections: VariantSelections,
) =>
  matchesAxis(combination, "size", selections.size) &&
  matchesAxis(combination, "color", selections.color);

export const isProductVariantAxis = (key: string): key is ProductVariantAxis =>
  key === "size" || key === "color";

export const buildProductVariantMatrix = (
  variants: PrintifyVariantLink[] | undefined,
): ProductVariantCombination[] | undefined => {
  if (!variants?.length) {
    return undefined;
  }

  const byKey = new Map<string, ProductVariantCombination>();

  for (const variant of variants) {
    if (!variant.isEnabled) {
      continue;
    }

    const combination: ProductVariantCombination = {
      ...(variant.selections.size ? { size: variant.selections.size } : {}),
      ...(variant.selections.color ? { color: variant.selections.color } : {}),
      ...(variant.isAvailable ? {} : { isSoldOut: true }),
    };
    const key = toCombinationKey(combination);
    const stored = byKey.get(key);

    if (!stored || (stored.isSoldOut && !combination.isSoldOut)) {
      byKey.set(key, combination);
    }
  }

  return byKey.size > 0 ? [...byKey.values()] : undefined;
};

export const filterOfferedVariantOptions = (
  matrix: ProductVariantCombination[] | undefined,
  options: ProductVariantOptions,
): ProductVariantOptions => {
  if (!matrix) {
    return options;
  }

  const filterAxis = (axis: ProductVariantAxis) => {
    const values = options[AXIS_OPTIONS[axis]];

    if (!values?.length) {
      return values;
    }

    const offered = new Set(
      matrix.flatMap((combination) =>
        combination[axis] ? [combination[axis]] : [],
      ),
    );

    return values.filter((option) => offered.has(option.value));
  };

  return { sizes: filterAxis("size"), colors: filterAxis("color") };
};

export const getVariantValueState = (
  matrix: ProductVariantCombination[] | undefined,
  options: ProductVariantOptions,
  axis: ProductVariantAxis,
  value: string,
  selections: VariantSelections,
): ProductVariantValueState => {
  if (!matrix) {
    return { availability: "available", isSelectable: true };
  }

  const opposite = OPPOSITE_AXIS[axis];
  const pairs = matrix.filter(
    (combination) =>
      matchesAxis(combination, axis, value) &&
      isOffered(options[AXIS_OPTIONS[opposite]], combination[opposite]),
  );
  const isSelectable = pairs.some(isSellable);
  const scope = isSelectable
    ? pairs.filter((combination) =>
        matchesAxis(combination, opposite, selections[opposite]),
      )
    : pairs;

  return {
    availability: toAvailability(scope),
    isSelectable,
  };
};

export const getVariantSelectionAvailability = (
  matrix: ProductVariantCombination[] | undefined,
  selections: VariantSelections,
): ProductVariantAvailability =>
  matrix
    ? toAvailability(
        matrix.filter((combination) =>
          matchesSelections(combination, selections),
        ),
      )
    : "available";

export const resolveVariantSelections = (
  matrix: ProductVariantCombination[] | undefined,
  options: ProductVariantOptions,
  selections: VariantSelections,
  preferredAxis: ProductVariantAxis,
): VariantSelections => {
  if (!matrix) {
    return selections;
  }

  const selectable = matrix.filter(
    (combination) =>
      isSellable(combination) &&
      isOffered(options.sizes, combination.size) &&
      isOffered(options.colors, combination.color),
  );

  if (selectable.length === 0) {
    return selections;
  }

  if (
    selectable.some((combination) => matchesSelections(combination, selections))
  ) {
    return selections;
  }

  const fallback =
    selectable.find((combination) =>
      matchesAxis(combination, preferredAxis, selections[preferredAxis]),
    ) ?? selectable[0];

  return {
    size: fallback.size ?? "",
    color: fallback.color ?? "",
  };
};
