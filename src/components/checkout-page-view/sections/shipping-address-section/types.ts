import type {
  CheckoutLabels,
  FieldErrors,
  FormState,
  OnCheckoutFieldChange,
} from "../../types";

export type CheckoutCountryOption = {
  code: string;
  label: string;
};

export type ShippingAddressSectionProps = {
  form: FormState;
  fieldErrors: FieldErrors;
  onField: OnCheckoutFieldChange;
  countries: CheckoutCountryOption[];
  onCountryChange: (value: string) => void;
  labels: CheckoutLabels;
};
