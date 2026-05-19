import type { AdminCategoryListItem } from "@/types/admin";

export type AdminCategoryCardProps = {
  category: AdminCategoryListItem;
  title: string;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};