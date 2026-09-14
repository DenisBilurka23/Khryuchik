import type { OrderPromoCode } from "@/types/order";

export type PromoCodeStatus =
  | "idle"
  | "loading"
  | "applied"
  | "not-found"
  | "inactive"
  | "unauthorized"
  | "already-used"
  | "error";

export type UsePromoCodeParams = {
  subtotal: number;
  isPersistent?: boolean;
};

export type UsePromoCodeResult = {
  code: string;
  appliedPromo: OrderPromoCode | null;
  discount: number;
  status: PromoCodeStatus;
  isGuest: boolean;
  setCode: (value: string) => void;
  applyCode: () => void;
  removeCode: () => void;
};
