import type { Locale } from "@/i18n/config";

export type FavoritesSectionProps = {
  locale: Locale;
  categoryLabels: Record<string, string>;
};