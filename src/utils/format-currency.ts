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
