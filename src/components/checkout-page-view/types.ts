import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";

export type CheckoutInitialCustomer = {
  name?: string;
  email?: string;
  phone?: string;
};

export type CheckoutPageViewProps = {
  locale: Locale;
  country: CountryCode;
  initialCustomer?: CheckoutInitialCustomer;
};
