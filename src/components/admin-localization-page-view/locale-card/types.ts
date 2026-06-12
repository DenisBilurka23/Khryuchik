import type { AdminLocaleListItem } from "@/types/admin";

export type AdminLocaleCardProps = {
  locale: AdminLocaleListItem;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};
