import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductOption, AdminProductPayload } from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";

export type AdminProductFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  locale: Locale;
  dictionary: AdminPageDictionary["productForm"];
  sharedDictionary: AdminPageDictionary["shared"];
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  initialRelatedProductOptions: AdminProductOption[];
  selectedRelatedProductOptions: AdminProductOption[];
  action: (formData: FormData) => Promise<void>;
  isNew: boolean;
  errorMessage?: string;
};