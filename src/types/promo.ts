export type PromoCodeDocument = {
  code: string;
  percentOff: number;
  isActive: boolean;
  createdAt: string;
};

export type PromoValidation =
  | { status: "ok"; code: string; percentOff: number }
  | { status: "not-found" }
  | { status: "inactive" };

export type PromoValidationStatus = PromoValidation["status"];
