import type { RegionDocument } from "@/types/localization";

import type { CurrencyCode } from "./country";

export type CurrencyRegionGroup = {
  currency: CurrencyCode;
  regionCodes: string[];
};

export const groupRegionsByCurrency = (
  regions: RegionDocument[],
): CurrencyRegionGroup[] => {
  const groups = new Map<CurrencyCode, CurrencyRegionGroup>();

  for (const region of regions) {
    const group = groups.get(region.currency);

    if (group) {
      group.regionCodes.push(region.code);
      continue;
    }

    groups.set(region.currency, {
      currency: region.currency,
      regionCodes: [region.code],
    });
  }

  return [...groups.values()];
};

export const toCurrencyCodes = (regions: RegionDocument[]): CurrencyCode[] =>
  groupRegionsByCurrency(regions).map((group) => group.currency);
