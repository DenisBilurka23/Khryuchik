import type { OrderPromoCode } from "@/types/order";

export type PromoCodeStatus =
  | "idle"
  | "loading"
  | "applied"
  | "not-found"
  | "inactive"
  | "error";

export type UsePromoCodeParams = {
  subtotal: number;
};

export type UsePromoCodeResult = {
  code: string;
  appliedPromo: OrderPromoCode | null;
  discount: number;
  status: PromoCodeStatus;
  setCode: (value: string) => void;
  applyCode: () => void;
  removeCode: () => void;
};
