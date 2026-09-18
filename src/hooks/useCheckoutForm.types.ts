import type {
  CheckoutInitialCustomer,
  FieldErrors,
  FormState,
  OnCheckoutFieldChange,
} from "@/components/checkout-page-view/types";
import type { UserShippingAddress } from "@/types/users";

export type UseCheckoutFormParams = {
  initialCustomer?: CheckoutInitialCustomer;
  initialShippingAddresses?: UserShippingAddress[];
  initialSelectedAddressId?: string | null;
};

export type UseCheckoutFormResult = {
  form: FormState;
  fieldErrors: FieldErrors;
  hasSavedAddresses: boolean;
  selectedSavedAddressId: string;
  showAddressForm: boolean;
  setFieldErrors: (errors: FieldErrors) => void;
  handleField: OnCheckoutFieldChange;
  handleCountryChange: (value: string) => void;
  handleRegionChange: (value: string) => void;
  handleSavedAddressSelect: (addressId: string) => void;
};
