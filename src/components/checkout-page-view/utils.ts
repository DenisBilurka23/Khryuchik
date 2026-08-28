import type { ShippingQuoteStatus } from "@/hooks/useShippingQuote.types";
import { isPostalCodeValid, isRegionRequired } from "@/utils";

import type { ShippingQuoteGroup } from "@/types/shipping";

import type {
  CheckoutLabels,
  CheckoutPageViewProps,
  FieldErrors,
  FormState,
} from "./types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "line1",
  "city",
  "postalCode",
  "country",
] as const;

export const formFromAddress = (
  initialCustomer: CheckoutPageViewProps["initialCustomer"],
  address?: NonNullable<
    CheckoutPageViewProps["initialShippingAddresses"]
  >[number],
): FormState => ({
  firstName: initialCustomer?.firstName ?? "",
  lastName: initialCustomer?.lastName ?? "",
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
  messages: {
    required: string;
    invalidEmail: string;
    invalidPostalCode: string;
  },
  options?: { skipAddress?: boolean },
): FieldErrors => {
  const errors: FieldErrors = {};

  for (const field of requiredFields) {
    if (
      options?.skipAddress &&
      field !== "firstName" &&
      field !== "lastName" &&
      field !== "email"
    ) {
      continue;
    }
    if (form[field].trim().length === 0) {
      errors[field] = messages.required;
    }
  }

  if (!errors.email && !emailPattern.test(form.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  if (
    !options?.skipAddress &&
    !errors.postalCode &&
    !isPostalCodeValid(form.postalCode)
  ) {
    errors.postalCode = messages.invalidPostalCode;
  }

  if (
    !options?.skipAddress &&
    isRegionRequired(form.country) &&
    form.region.trim().length === 0
  ) {
    errors.region = messages.required;
  }

  return errors;
};

export const shippingOptionLabel = (
  option: ShippingQuoteGroup["options"][number],
  labels: CheckoutLabels,
) =>
  option.deliveryType === "pickup-point"
    ? labels.shippingMethod.pickupPoint
    : labels.shippingMethod.toAddress;

export const isPickupPointOption = (
  option?: ShippingQuoteGroup["options"][number],
) => option?.deliveryType === "pickup-point";

export const shippingOptionTransit = (
  option: ShippingQuoteGroup["options"][number],
  labels: CheckoutLabels,
) =>
  option.transitDays
    ? labels.shippingMethod.transitDays.replace("{days}", option.transitDays)
    : undefined;

export const shippingGroupLabel = (
  group: ShippingQuoteGroup,
  labels: CheckoutLabels,
) =>
  group.source === "printify"
    ? labels.shippingMethod.parcels.printify
    : labels.shippingMethod.parcels.manual;

export const resolveSelectedOptionId = (
  group: ShippingQuoteGroup,
  selectedOptionIds: Record<string, string>,
) => {
  const preferredId = selectedOptionIds[group.id] ?? group.selectedOptionId;
  const isOffered = group.options.some((option) => option.id === preferredId);

  return isOffered ? preferredId : (group.options[0]?.id ?? "");
};

// The groups whose chosen option goes to a pickup point - normally at most one,
// since made-to-order merch always ships to an address.
export const resolvePickupGroupIds = (
  groups: ShippingQuoteGroup[],
  selectedOptionIds: Record<string, string>,
): string[] =>
  groups
    .filter((group) =>
      isPickupPointOption(
        group.options.find(
          (option) =>
            option.id === resolveSelectedOptionId(group, selectedOptionIds),
        ),
      ),
    )
    .map((group) => group.id);

export const resolveShippingTotal = (
  groups: ShippingQuoteGroup[],
  selectedOptionIds: Record<string, string>,
) =>
  groups.reduce((total, group) => {
    const selectedId = resolveSelectedOptionId(group, selectedOptionIds);
    const option = group.options.find(
      (candidate) => candidate.id === selectedId,
    );

    return total + (option?.amount ?? 0);
  }, 0);

export const resolveShippingSelection = (
  groups: ShippingQuoteGroup[],
  selectedOptionIds: Record<string, string>,
): Record<string, string> =>
  Object.fromEntries(
    groups
      .map((group) => [
        group.id,
        resolveSelectedOptionId(group, selectedOptionIds),
      ])
      .filter(([, optionId]) => Boolean(optionId)),
  );

const SHIPPING_ERROR_KEYS: Record<
  ShippingQuoteStatus,
  keyof CheckoutLabels["errors"] | null
> = {
  idle: null,
  loading: null,
  ok: null,
  unavailable: "shippingUnavailable",
  "unsupported-destination": "shippingUnsupportedDestination",
  "unsupported-variant": "unsupportedVariant",
  "unsupported-parcel": "shippingUnsupportedParcel",
  "missing-shipping-data": "shippingMissingData",
};

export const shippingErrorMessage = (
  status: ShippingQuoteStatus,
  labels: CheckoutLabels,
) => {
  const key = SHIPPING_ERROR_KEYS[status];

  return key ? labels.errors[key] : null;
};

export const isShippingBlocking = (status: ShippingQuoteStatus) =>
  status === "loading" || SHIPPING_ERROR_KEYS[status] !== null;
