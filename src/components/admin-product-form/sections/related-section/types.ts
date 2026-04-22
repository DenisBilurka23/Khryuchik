import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";

export type AdminProductRelatedSectionProps = {
  locale: Locale;
  dictionary: AdminPageDictionary["productForm"];
  submitLabel: string;
  payload: AdminProductPayload;
  initialProductOptions: AdminProductOption[];
  selectedProductOptions: AdminProductOption[];
};