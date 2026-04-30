import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminCategoryListItem } from "@/types/admin";

export type AdminCategoryCardProps = {
  category: AdminCategoryListItem;
  title: string;
  labels: AdminPageDictionary["categories"];
  sharedStatus: AdminPageDictionary["shared"]["status"];
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};