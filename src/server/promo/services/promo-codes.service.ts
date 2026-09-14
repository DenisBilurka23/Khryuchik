import "server-only";

import {
  MAX_PROMO_CODE_LENGTH,
  MAX_PROMO_PERCENT,
  MIN_PROMO_PERCENT,
} from "@/constants/promo";
import type { AdminPromoCodeUpsertInput } from "@/types/admin";
import type { PromoCodeDocument, PromoValidation } from "@/types/promo";
import { normalizePromoCode } from "@/utils";

import {
  deletePromoCodeByCode,
  findAllPromoCodes,
  findPromoCodeByCode,
  upsertPromoCode,
} from "../repositories/promo-codes.repository";

export const promoCodeErrorCodes = {
  InvalidCode: "invalid-code",
  InvalidPercent: "invalid-percent",
} as const;

export type PromoCodeErrorCode =
  (typeof promoCodeErrorCodes)[keyof typeof promoCodeErrorCodes];

export class PromoCodeError extends Error {
  code: PromoCodeErrorCode;

  constructor(code: PromoCodeErrorCode) {
    super(code);
    this.code = code;
    this.name = "PromoCodeError";
  }
}

export const validatePromoCode = async (
  code: string,
): Promise<PromoValidation> => {
  const normalizedCode = normalizePromoCode(code);

  if (normalizedCode.length === 0) {
    return { status: "not-found" };
  }

  const promoCode = await findPromoCodeByCode(normalizedCode);

  if (!promoCode) {
    return { status: "not-found" };
  }

  if (!promoCode.isActive) {
    return { status: "inactive" };
  }

  return {
    status: "ok",
    code: promoCode.code,
    percentOff: promoCode.percentOff,
  };
};

export const getAdminPromoCodes = async (): Promise<PromoCodeDocument[]> =>
  findAllPromoCodes();

export const saveAdminPromoCode = async (input: AdminPromoCodeUpsertInput) => {
  const code = normalizePromoCode(input.code);

  if (code.length === 0 || code.length > MAX_PROMO_CODE_LENGTH) {
    throw new PromoCodeError(promoCodeErrorCodes.InvalidCode);
  }

  if (
    !Number.isInteger(input.percentOff) ||
    input.percentOff < MIN_PROMO_PERCENT ||
    input.percentOff > MAX_PROMO_PERCENT
  ) {
    throw new PromoCodeError(promoCodeErrorCodes.InvalidPercent);
  }

  const existing = await findPromoCodeByCode(code);

  return upsertPromoCode({
    code,
    percentOff: input.percentOff,
    isActive: input.isActive,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
  });
};

export const deleteAdminPromoCode = async (code: string) => {
  const normalizedCode = normalizePromoCode(code);

  if (normalizedCode.length === 0) {
    throw new PromoCodeError(promoCodeErrorCodes.InvalidCode);
  }

  await deletePromoCodeByCode(normalizedCode);
};
