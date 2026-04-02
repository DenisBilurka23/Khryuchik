import type { AccountDownloadMock } from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";

export type BooksSectionProps = {
  locale: Locale;
  dictionary: AccountPageDictionary;
  downloads: AccountDownloadMock[];
};