import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";

export type AdminProductFormProps = {
  locale: Locale;
  dictionary: Dictionary["adminPage"]["productForm"];
  sharedDictionary: Dictionary["adminPage"]["shared"];
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  initialRelatedProductOptions: AdminProductOption[];
  selectedRelatedProductOptions: AdminProductOption[];
  selectedStoryProductOption?: AdminProductOption;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  isNew: boolean;
  errorCode?: string;
};