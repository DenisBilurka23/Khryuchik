import type { Locale } from "@/i18n/config";

import type { CurrencyCode } from "./country";

export const formatCurrency = (
  value: number,
  locale: Locale,
  currency: CurrencyCode = "BYN",
) =>
  new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);

export type CurrencyOption = {
  code: string;
  symbol: string;
  name: string;
  label: string;
};

export const getAllCurrenciesSorted = (locale: string): CurrencyOption[] => {
  const localeTag = locale === "ru" ? "ru-RU" : "en-US";
  const names = new Intl.DisplayNames([localeTag], { type: "currency" });

  return Intl.supportedValuesOf("currency")
    .map((code) => {
      const symbol =
        new Intl.NumberFormat(localeTag, { style: "currency", currency: code })
          .formatToParts(0)
          .find((part) => part.type === "currency")?.value ?? code;
      const name = names.of(code) ?? code;
      const prefix = symbol === code ? code : `${symbol} ${code}`;

      return { code, symbol, name, label: `${prefix} — ${name}` };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
};
