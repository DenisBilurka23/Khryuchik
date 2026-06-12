import type { AdminRegionListItem } from "@/types/admin";

export type AdminRegionCardProps = {
  region: AdminRegionListItem;
  saveAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};
