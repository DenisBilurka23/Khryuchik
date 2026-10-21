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
  const currentByValue = new Map(
    (current ?? []).map((option) => [option.value, option]),
  );

  return next.map((option) => currentByValue.get(option.value) ?? option);
};
