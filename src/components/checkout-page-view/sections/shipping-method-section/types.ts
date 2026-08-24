import type { Locale } from "@/i18n/config";
import type { ShippingQuoteGroup } from "@/types/shipping";
import type { CurrencyCode } from "@/utils";

import type { CheckoutLabels } from "../../types";

export type ShippingMethodSectionProps = {
  groups: ShippingQuoteGroup[];
  isLoading: boolean;
  errorMessage?: string;
  selectedOptionIds: Record<string, string>;
  onOptionChange: (groupId: string, optionId: string) => void;
  currency: CurrencyCode;
  locale: Locale;
  labels: CheckoutLabels;
};
