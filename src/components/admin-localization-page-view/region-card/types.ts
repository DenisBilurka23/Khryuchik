import type { Locale } from "@/i18n/config";
import type { AdminRegionListItem } from "@/types/admin";

export type AdminRegionCardProps = {
  region: AdminRegionListItem;
  locale: Locale;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};
