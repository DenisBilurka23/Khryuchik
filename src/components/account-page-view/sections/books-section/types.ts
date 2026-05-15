import type { AccountDownloadMock } from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";

export type BooksSectionProps = {
  locale: Locale;
  downloads: AccountDownloadMock[];
};