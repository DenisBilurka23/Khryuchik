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
  selectedStoryProductOption?: AdminProductOption;
  action: (formData: FormData) => Promise<void>;
  deleteAction?: (formData: FormData) => Promise<void>;
  deleteDialogTitle?: string;
  deleteDialogDescription?: string;
  confirmDeleteLabel?: string;
  cancelDeleteLabel?: string;
  isNew: boolean;
  errorMessage?: string;
};