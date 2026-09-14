import { POST } from "@/client-api";
import type { PromoValidation } from "@/types/promo";

export const validatePromoCodeClient = async (
  code: string,
  options?: Omit<RequestInit, "method" | "body">,
) => POST<PromoValidation>("/api/promo/validate", { code }, options);
