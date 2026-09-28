import type { AdminProductPayload } from "@/types/admin";
import type { RegionCode } from "@/types/localization";

export type UseProductPublishTogglesArgs = {
  payload: AdminProductPayload;
  localeCodes: string[];
  regionCodes: RegionCode[];
  defaultLocale: string;
  isNew: boolean;
};

export type UseProductPublishTogglesResult = {
  activeLocales: Record<string, boolean>;
  activeRegions: Record<string, boolean>;
  toggleLocale: (code: string) => void;
  toggleRegion: (code: string) => void;
  toggleAllRegions: (isActive: boolean) => void;
  isLocaleActive: (code: string) => boolean;
};
