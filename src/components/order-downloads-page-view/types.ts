import type { Locale } from "@/i18n/config";
import type { OrderDownload } from "@/types/download";

export type OrderDownloadsPageViewProps = {
  locale: Locale;
  orderId?: string;
  downloads?: OrderDownload[];
};
