import type { Locale } from "@/i18n/config";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";
import type { LocaleDocument, RegionDocument } from "@/types/localization";

export type AdminProductFormProps = {
  locale: Locale;
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  activeLocales: LocaleDocument[];
  activeRegions: RegionDocument[];
  initialRelatedProductOptions: AdminProductOption[];
  selectedRelatedProductOptions: AdminProductOption[];
  selectedStoryProductOption?: AdminProductOption;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  isNew: boolean;
  errorCode?: string;
};