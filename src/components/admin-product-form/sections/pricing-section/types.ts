import type { AdminProductPayload } from "@/types/admin";
import type { RegionDocument } from "@/types/localization";

export type AdminProductPricingSectionProps = {
  payload: AdminProductPayload;
  regions: RegionDocument[];
  isRegionActive: (code: string) => boolean;
  onToggleRegion: (code: string) => void;
};