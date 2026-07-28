import type { Locale } from "@/i18n/config";
import type { CountLabelForms } from "@/i18n/types";

export const getCountLabel = (
  count: number,
  locale: Locale,
  labels?: CountLabelForms,
) => {
  const pluralRules = new Intl.PluralRules(locale === "ru" ? "ru-RU" : "en-US");
  const category = pluralRules.select(count);

  if (!labels) {
    return String(count);
  }

  const fallbackLabel = labels.other ?? labels.one;

  if (category === "one") {
    return `${count} ${labels.one ?? fallbackLabel}`;
  }

  if (category === "few") {
    return `${count} ${labels.few ?? fallbackLabel}`;
  }

  if (category === "many") {
    return `${count} ${labels.many ?? fallbackLabel}`;
  }

  return `${count} ${fallbackLabel}`;
};
