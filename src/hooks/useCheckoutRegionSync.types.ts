import type { RegionCode } from "@/utils";

export type UseCheckoutRegionSyncParams = {
  region: RegionCode;
  country: string;
  availableRegions: RegionCode[];
};

export type UseCheckoutRegionSyncResult = {
  isSwitching: boolean;
  switchedRegion: RegionCode | null;
};
