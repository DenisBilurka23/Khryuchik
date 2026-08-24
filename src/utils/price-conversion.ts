import type { CurrencyCode } from "./country";

// Money is stored and charged in whole cents. Floating point multiplication -
// by an exchange rate, by a quantity - drifts past that almost immediately, so
// anything that survives arithmetic gets pulled back onto the grid.
export const roundToCents = (value: number) => Math.round(value * 100) / 100;

export const convertFromUsd = (amountUsd: number, rate: number) =>
  Math.ceil(amountUsd * rate);

export const convertShippingAmount = ({
  amount,
  fromCurrency,
  toCurrency,
  fromUsdRate,
  toUsdRate,
}: {
  amount: number;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  fromUsdRate: number;
  toUsdRate: number;
}) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  return Math.round((amount / fromUsdRate) * toUsdRate * 100) / 100;
};
