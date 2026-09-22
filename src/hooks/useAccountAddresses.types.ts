import type {
  UserShippingAddress,
  UserShippingAddressInput,
} from "@/types/users";

export type AccountAddressFormMode =
  | { kind: "add" }
  | { kind: "edit"; addressId: string };

export type UseAccountAddressesParams = {
  initialAddresses: UserShippingAddress[];
  initialSelectedId: string | null;
  onAddressesChangeAction?: (
    addresses: UserShippingAddress[],
    selectedId: string | null,
  ) => void;
  autoOpenAddForm?: boolean;
};

export type UseAccountAddressesResult = {
  addresses: UserShippingAddress[];
  selectedAddressId: string | null;
  formMode: AccountAddressFormMode | null;
  form: UserShippingAddressInput;
  isSaving: boolean;
  selectingAddressId: string | null;
  deletingAddressId: string | null;
  errorMessage: string | null;
  beginAdd: () => void;
  beginEdit: (address: UserShippingAddress) => void;
  cancelForm: () => void;
  setFormField: <TField extends keyof UserShippingAddressInput>(
    field: TField,
    value: UserShippingAddressInput[TField],
  ) => void;
  setFormCountry: (country: string) => void;
  submitForm: () => Promise<void>;
  deleteAddress: (addressId: string) => Promise<void>;
  selectAddress: (addressId: string) => Promise<void>;
};
