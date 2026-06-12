import type { ChangeEvent } from "react";

import type { Locale } from "@/i18n/config";
import type { CheckoutPageLabels } from "@/i18n/types";
import type { UserShippingAddress } from "@/types/users";
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
  initialShippingAddresses?: UserShippingAddress[];
  initialSelectedAddressId?: string | null;
};

export type FormState = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  notes: string;
};

export type FormFieldKey = keyof FormState;

export type FieldErrors = Partial<Record<FormFieldKey, string>>;

export type CheckoutFieldChangeHandler = (
  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
) => void;

export type OnCheckoutFieldChange = (
  key: FormFieldKey,
) => CheckoutFieldChangeHandler;

export type CheckoutLabels = {
  eyebrow: string;
  title: string;
  lead: string;
  breadcrumbs: CheckoutPageLabels["breadcrumbs"];
  contactTitle: string;
  shippingTitle: string;
  paymentTitle: string;
  summaryTitle: string;
  fields: CheckoutPageLabels["fields"];
  savedAddressesTitle: string;
  newAddressOption: string;
  paymentMethods: CheckoutPageLabels["paymentMethods"];
  summary: CheckoutPageLabels["summary"];
  submit: CheckoutPageLabels["submit"];
  errors: CheckoutPageLabels["errors"];
  fieldErrors: CheckoutPageLabels["fieldErrors"];
  emptyState: CheckoutPageLabels["emptyState"];
};
