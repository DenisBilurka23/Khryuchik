import type { Locale } from "@/i18n/config";
import type { AccountDownload } from "@/types/download";

export type BooksSectionProps = {
  locale: Locale;
  downloads: AccountDownload[];
};
