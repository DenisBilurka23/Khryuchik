import {
  GENERATED_PROMO_CODE_LENGTH,
  PROMO_CODE_ALPHABET,
  PROMO_CODE_GENERATION_ATTEMPTS,
} from "@/constants/promo";

import { roundToCents } from "./price-conversion";

export const normalizePromoCode = (value: string) =>
  value.trim().toUpperCase().replace(/\s+/g, "");

export const calculatePromoDiscount = (percentOff: number, subtotal: number) =>
  roundToCents((subtotal * percentOff) / 100);

const createPromoCodeCandidate = () => {
  const bytes = crypto.getRandomValues(
    new Uint8Array(GENERATED_PROMO_CODE_LENGTH),
  );

  return Array.from(
    bytes,
    (byte) => PROMO_CODE_ALPHABET[byte % PROMO_CODE_ALPHABET.length],
  ).join("");
};

export const generatePromoCode = (
  existingCodes: ReadonlySet<string> = new Set(),
): string => {
  let code = createPromoCodeCandidate();

  for (
    let attempt = 1;
    attempt < PROMO_CODE_GENERATION_ATTEMPTS && existingCodes.has(code);
    attempt += 1
  ) {
    code = createPromoCodeCandidate();
  }

  return code;
};
