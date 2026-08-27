// No database and no network: the tariff is a table in the repository, so this
// is a pure lookup and stays importable from `scripts/` like the packing and
// dominance helpers next to it.

import {
  BPOST_PICKUP_POINT_COUNTRIES,
  BPOST_ZONE,
  resolveBpostZone,
} from "@/constants/bpost";
import type {
  ShippingDestination,
  ShippingOption,
  ShippingParcel,
  ShippingQuote,
  ShippingRateRule,
} from "@/types/shipping";

import { BPOST_TARIFF_RULES } from "../bpost-tariff";
import type { ShippingProvider } from "../types";

const MAX_LENGTH_MM = 1_500;

const optionId = (rule: ShippingRateRule) =>
  `bpost:${rule.zone}:${rule.service}:${rule.deliveryType}`;

const toOption = (rule: ShippingRateRule): ShippingOption => ({
  id: optionId(rule),
  provider: "bpost",
  service: rule.service,
  amount: rule.amount,
  currency: rule.currency,
  hasTracking: rule.hasTracking,
  deliveryType: rule.deliveryType,
  transitDays: rule.transitDays,
});

const pickBandPerService = (rules: ShippingRateRule[], weightGrams: number) => {
  const bestByService = new Map<string, ShippingRateRule>();

  for (const rule of rules) {
    if (rule.maxWeightGrams < weightGrams) {
      continue;
    }

    const key = optionId(rule);
    const current = bestByService.get(key);

    if (!current || rule.maxWeightGrams < current.maxWeightGrams) {
      bestByService.set(key, rule);
    }
  }

  return [...bestByService.values()];
};

const quote = async (
  parcel: ShippingParcel,
  destination: ShippingDestination,
): Promise<ShippingQuote> => {
  const longestSideMm = Math.max(
    parcel.lengthMm,
    parcel.widthMm,
    parcel.heightMm,
  );

  if (longestSideMm > MAX_LENGTH_MM) {
    return { status: "unsupported-parcel" };
  }

  const country = destination.country.toUpperCase();
  const zones: string[] = [resolveBpostZone(country)];

  if (BPOST_PICKUP_POINT_COUNTRIES.includes(country)) {
    zones.push(BPOST_ZONE.franceNetherlands);
  }

  const inZone = BPOST_TARIFF_RULES.filter((rule) => zones.includes(rule.zone));

  if (inZone.length === 0) {
    return { status: "unsupported-destination" };
  }

  const options = pickBandPerService(inZone, parcel.weightGrams).map(toOption);

  if (options.length === 0) {
    return { status: "unsupported-parcel" };
  }

  return { status: "quoted", options };
};

export const bpostProvider: ShippingProvider = { code: "bpost", quote };
