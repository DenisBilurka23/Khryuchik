import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductPayload } from "@/types/admin";

export type AdminProductPricingSectionProps = {
  dictionary: AdminPageDictionary["productForm"];
  payload: AdminProductPayload;
};