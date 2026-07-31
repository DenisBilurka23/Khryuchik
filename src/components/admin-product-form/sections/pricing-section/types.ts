import type { AdminProductPayload } from "@/types/admin";
import type { RegionDocument } from "@/types/localization";

export type AdminProductPricingSectionProps = {
  payload: AdminProductPayload;
  regions: RegionDocument[];
  activeRegions: Record<string, boolean>;
  onToggleRegionAction: (code: string) => void;
};