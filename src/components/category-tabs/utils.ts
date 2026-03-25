import type { LocalizedCategory } from "@/types/catalog";

import type { CategoryTabOption } from "./types";

export const createCategoryTabOptions = ({
  categories,
  allLabel,
  includeAll = true,
}: {
  categories: LocalizedCategory[];
  allLabel?: string;
  includeAll?: boolean;
}): CategoryTabOption[] => [
  ...(includeAll && allLabel ? [{ value: "all", label: allLabel }] : []),
  ...categories.map((category) => ({
    value: category.key,
    label: category.label,
  })),
];