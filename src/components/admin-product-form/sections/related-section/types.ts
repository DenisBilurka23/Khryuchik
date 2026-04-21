import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductPayload } from "@/types/admin";

export type AdminProductRelatedSectionProps = {
  dictionary: AdminPageDictionary["productForm"];
  submitLabel: string;
  payload: AdminProductPayload;
};