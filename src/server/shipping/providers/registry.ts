import "server-only";

import type { ShippingHubCode, ShippingProviderCode } from "@/types/shipping";

import type { ShippingProvider } from "../types";
import { bpostProvider } from "./bpost.provider";
import { chitchatsProvider } from "./chitchats.provider";
import { easyshipProvider } from "./easyship.provider";

const PROVIDERS: ShippingProvider[] = [
  bpostProvider,
  chitchatsProvider,
  easyshipProvider,
];

export const PROVIDERS_BY_HUB: Record<ShippingHubCode, ShippingProvider[]> = {
  europe: [bpostProvider, easyshipProvider],
  northAmerica: [chitchatsProvider],
};

export const findShippingProvider = (
  code: ShippingProviderCode,
): ShippingProvider | undefined =>
  PROVIDERS.find((provider) => provider.code === code);

export const canBuyShippingLabel = (code: ShippingProviderCode): boolean =>
  Boolean(findShippingProvider(code)?.buyLabel);
