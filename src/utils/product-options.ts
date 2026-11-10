import type { ProductOption } from "@/types/product-details";

export const toProductOptionValue = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const mergeProductOptions = (
  next: ProductOption[],
  current: ProductOption[] | undefined,
): ProductOption[] => {
  const nextValues = new Set(next.map((option) => option.value));
  const kept = (current ?? []).filter((option) => nextValues.has(option.value));
  const keptValues = new Set(kept.map((option) => option.value));

  return [...kept, ...next.filter((option) => !keptValues.has(option.value))];
};
