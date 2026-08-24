import { BPOST_ZONE, type BpostZone } from "@/constants/bpost";
import type { ShippingDeliveryType, ShippingRateRule } from "@/types/shipping";

const bpostRules = (
  zone: BpostZone,
  service: string,
  hasTracking: boolean,
  deliveryType: ShippingDeliveryType,
  bands: ReadonlyArray<readonly [maxWeightGrams: number, amount: number]>,
): ShippingRateRule[] =>
  bands.map(([maxWeightGrams, amount]) => ({
    zone,
    service,
    hasTracking,
    deliveryType,
    maxWeightGrams,
    amount,
    currency: "EUR",
  }));

export const BPOST_TARIFF_RULES: ShippingRateRule[] = [
  ...bpostRules(BPOST_ZONE.domestic, "pickupPoint", true, "pickup-point", [
    [2000, 5.4],
    [5000, 5.6],
    [10000, 6.0],
    [20000, 10.15],
    [30000, 12.8],
  ]),
  ...bpostRules(BPOST_ZONE.domestic, "standard", true, "address", [
    [2000, 7.1],
    [10000, 11.5],
  ]),

  ...bpostRules(
    BPOST_ZONE.franceNetherlands,
    "pickupPoint",
    true,
    "pickup-point",
    [
      [2000, 11.75],
      [5000, 16.5],
      [10000, 16.5],
      [20000, 23.5],
      [30000, 35.2],
    ],
  ),

  // Germany, France, Luxembourg, the Netherlands.
  ...bpostRules(BPOST_ZONE.neighbours, "economy", false, "address", [
    [2000, 11.6],
  ]),
  ...bpostRules(BPOST_ZONE.neighbours, "standard", true, "address", [
    [2000, 18.1],
    [5000, 18.1],
    [10000, 18.1],
    [20000, 43.8],
    [30000, 43.8],
  ]),

  // Spain, Italy, Poland, Austria and the rest of the union.
  ...bpostRules(BPOST_ZONE.restOfEu, "economy", false, "address", [
    [2000, 13.75],
  ]),
  ...bpostRules(BPOST_ZONE.restOfEu, "standard", true, "address", [
    [2000, 36.2],
    [5000, 36.2],
    [10000, 54.3],
    [20000, 87.6],
    [30000, 109.5],
  ]),

  // Non-EU Europe: the UK, Switzerland, Norway, Turkey, Ukraine, Belarus.
  ...bpostRules(BPOST_ZONE.restOfEurope, "economy", false, "address", [
    [2000, 17.7],
  ]),
  ...bpostRules(BPOST_ZONE.restOfEurope, "standard", true, "address", [
    [2000, 38.8],
    [5000, 38.8],
    [10000, 77.6],
    [20000, 116.4],
    [30000, 155.2],
  ]),

  // Canada and the United States land here. Priced for completeness only -
  // North America is served from Toronto, never from Liege.
  ...bpostRules(
    BPOST_ZONE.mediterraneanNorthAmerica,
    "economy",
    false,
    "address",
    [[2000, 22.5]],
  ),
  ...bpostRules(
    BPOST_ZONE.mediterraneanNorthAmerica,
    "standard",
    true,
    "address",
    [
      [2000, 58.2],
      [5000, 58.2],
      [10000, 97.0],
      [20000, 155.2],
      [30000, 213.4],
    ],
  ),

  ...bpostRules(BPOST_ZONE.restOfWorld, "economy", false, "address", [
    [2000, 31.9],
  ]),
  ...bpostRules(BPOST_ZONE.restOfWorld, "standard", true, "address", [
    [2000, 77.6],
    [5000, 77.6],
    [10000, 155.2],
    [20000, 232.8],
    [30000, 310.4],
  ]),
];
