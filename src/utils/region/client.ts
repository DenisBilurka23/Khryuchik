import { REGION_CHANGE_EVENT } from "@/constants/region";
import type { RegionCode } from "@/types/localization";

export const setClientRegion = (region: RegionCode) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.region = region;

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(REGION_CHANGE_EVENT, {
        detail: { region },
      }),
    );
  }
};
