import type { Locale } from "@/i18n/config";
import type { AdminProductOption } from "@/types/admin";

export type UseProductSearchArgs = {
  locale: Locale;
  query: string;
  excludeProductId: string;
  fallbackOptions: AdminProductOption[];
};

export type UseProductSearchResult = {
  options: AdminProductOption[];
  isLoading: boolean;
};
