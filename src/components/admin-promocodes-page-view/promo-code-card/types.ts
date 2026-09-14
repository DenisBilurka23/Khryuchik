import type { PromoCodeDocument } from "@/types/promo";

export type AdminPromoCodeCardProps = {
  promoCode: PromoCodeDocument;
  description: string;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};
