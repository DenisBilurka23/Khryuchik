import type { Locale } from "@/i18n/config";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";

export type AdminProductRelatedSectionProps = {
  locale: Locale;
  payload: AdminProductPayload;
  initialProductOptions: AdminProductOption[];
  selectedProductOptions: AdminProductOption[];
  selectedStoryProductOption?: AdminProductOption;
};