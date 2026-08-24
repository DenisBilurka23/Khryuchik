import {
  COMPARED_SHIPPING_HUBS,
  EUROPE_HUB_COUNTRIES,
  NORTH_AMERICA_HUB_COUNTRIES,
} from "@/constants/shipping";
import type { ShippingHubCode, ShippingOption } from "@/types/shipping";
import type { CountryCode } from "@/utils";

const CONVENIENCE_RANK = { address: 1, "pickup-point": 0 } as const;

const dominates = (a: ShippingOption, b: ShippingOption) => {
  const notWorse =
    a.amount <= b.amount &&
    Number(a.hasTracking) >= Number(b.hasTracking) &&
    CONVENIENCE_RANK[a.deliveryType] >= CONVENIENCE_RANK[b.deliveryType];
  const strictlyBetter =
    a.amount < b.amount ||
    Number(a.hasTracking) > Number(b.hasTracking) ||
    CONVENIENCE_RANK[a.deliveryType] > CONVENIENCE_RANK[b.deliveryType];

  return notWorse && strictlyBetter;
};

export const dropDominatedOptions = (options: ShippingOption[]) =>
  options.filter(
    (option) => !options.some((other) => dominates(other, option)),
  );

export const serviceableHubs = (country: CountryCode): ShippingHubCode[] => {
  const code = country.toUpperCase();

  if (NORTH_AMERICA_HUB_COUNTRIES.includes(code)) {
    return ["northAmerica"];
  }

  if (EUROPE_HUB_COUNTRIES.includes(code)) {
    return ["europe"];
  }

  return [...COMPARED_SHIPPING_HUBS];
};

export const chooseHubs = (
  country: CountryCode,
  stockedHubs: ShippingHubCode[],
): ShippingHubCode[] => {
  const serviceable = serviceableHubs(country);

  if (stockedHubs.length === 0) {
    return serviceable;
  }

  const inStock = serviceable.filter((hub) => stockedHubs.includes(hub));

  return inStock.length > 0 ? inStock : stockedHubs;
};
