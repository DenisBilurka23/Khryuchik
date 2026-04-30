import "server-only";

import type { Locale } from "@/i18n/config";
import type { CategoryDocument, LocalizedCategory } from "@/types/catalog";

export const localizeCategory = (
  category: CategoryDocument,
  locale: Locale,
): LocalizedCategory | null => {
  const translation = category.translations[locale];

  if (!translation) {
    return null;
  }

  return {
    key: category.key,
    label: translation.label,
    sortOrder: category.sortOrder,
  };
};

export const isLocalizedCategory = (
  category: LocalizedCategory | null,
): category is LocalizedCategory => category !== null;