import type { Locale } from "@/i18n/config";
import type { UserShippingAddressInput } from "@/types/users";

export type AddressFormProps = {
  locale: Locale;
  title: string;
  value: UserShippingAddressInput;
  isSaving: boolean;
  onFieldChange: <TField extends keyof UserShippingAddressInput>(
    field: TField,
    value: UserShippingAddressInput[TField],
  ) => void;
  onCountryChange: (country: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
};
