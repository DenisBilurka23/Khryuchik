import type { Locale } from "@/i18n/config";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";
import type { LocaleDocument, RegionDocument } from "@/types/localization";

import type { AdminPrintifyAction } from "./sections/printify-section";

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
  syncPrintifyAction?: AdminPrintifyAction;
  relinkPrintifyAction?: AdminPrintifyAction;
  isNew: boolean;
  errorCode?: string;
};
