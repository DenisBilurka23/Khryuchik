import type { ClientApiResponse } from "@/client-api";
import type { UpdateAccountAddressesResponse } from "@/client-api/account";
import type { UserShippingAddress } from "@/types/users";

export type UseShippingAddressSelectionOptions = {
  onAddressesChange: (
    addresses: UserShippingAddress[],
    selectedId: string | null,
  ) => void;
  onError?: (reason?: string) => void;
};

export type UseShippingAddressSelectionReturn = {
  selectingAddressId: string | null;
  selectAddress: (
    addressId: string,
    currentSelectedId: string | null,
  ) => Promise<void>;
  applyAddressResponse: (
    response: ClientApiResponse<UpdateAccountAddressesResponse>,
  ) => boolean;
};
