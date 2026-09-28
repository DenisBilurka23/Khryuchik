import { POST } from "@/client-api";
import type { RegionCode } from "@/utils";

type UpdateRegionResponse = {
  ok: boolean;
  region: RegionCode;
};

export const updateRegionPreferenceClient = async (region: RegionCode) =>
  POST<UpdateRegionResponse>("/api/preferences/region", { region });
