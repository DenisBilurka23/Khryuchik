import type { CheckoutPageViewProps, FieldErrors, FormState } from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requiredFields = ["name", "line1", "city", "country"] as const;

export const formFromAddress = (
  initialCustomer: CheckoutPageViewProps["initialCustomer"],
  address?: NonNullable<CheckoutPageViewProps["initialShippingAddresses"]>[number],
): FormState => ({
  name: initialCustomer?.name ?? "",
  email: initialCustomer?.email ?? "",
  phone: initialCustomer?.phone ?? "",
  line1: address?.line1 ?? "",
  line2: address?.line2 ?? "",
  city: address?.city ?? "",
  region: address?.region ?? "",
  postalCode: address?.postalCode ?? "",
  country: address?.country ?? "",
  notes: "",
});

export const validateForm = (
  form: FormState,
  messages: { required: string; invalidEmail: string },
): FieldErrors => {
  const errors: FieldErrors = {};

  for (const field of requiredFields) {
    if (form[field].trim().length === 0) {
      errors[field] = messages.required;
    }
  }

  if (form.email.trim().length > 0 && !emailPattern.test(form.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  return errors;
};
