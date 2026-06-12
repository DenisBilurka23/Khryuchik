import type { AdminProductPayload } from "@/types/admin";

export type UseProductPublishTogglesArgs = {
  payload: AdminProductPayload;
  localeCodes: string[];
  regionCodes: string[];
  defaultLocale: string;
  isNew: boolean;
};

export type UseProductPublishTogglesResult = {
  activeLocales: Record<string, boolean>;
  activeRegions: Record<string, boolean>;
  toggleLocale: (code: string) => void;
  toggleRegion: (code: string) => void;
  isLocaleActive: (code: string) => boolean;
  isRegionActive: (code: string) => boolean;
};
