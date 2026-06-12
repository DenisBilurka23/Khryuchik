import type {
  CheckoutLabels,
  FieldErrors,
  FormState,
  OnCheckoutFieldChange,
} from "../../types";

export type ContactSectionProps = {
  form: FormState;
  fieldErrors: FieldErrors;
  onField: OnCheckoutFieldChange;
  labels: CheckoutLabels;
};
