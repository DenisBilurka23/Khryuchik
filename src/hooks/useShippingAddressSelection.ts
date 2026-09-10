import { useState } from "react";
import { useSession } from "next-auth/react";

import type { ClientApiResponse } from "@/client-api";
import {
  selectAccountAddressClient,
  type UpdateAccountAddressesResponse,
} from "@/client-api/account";

import type {
  UseShippingAddressSelectionOptions,
  UseShippingAddressSelectionReturn,
} from "./useShippingAddressSelection.types";

export type {
  UseShippingAddressSelectionOptions,
  UseShippingAddressSelectionReturn,
} from "./useShippingAddressSelection.types";

export const useShippingAddressSelection = ({
  onAddressesChange,
  onError,
}: UseShippingAddressSelectionOptions): UseShippingAddressSelectionReturn => {
  const { update } = useSession();
  const [selectingAddressId, setSelectingAddressId] = useState<string | null>(
    null,
  );

  const applyAddressResponse = (
    response: ClientApiResponse<UpdateAccountAddressesResponse>,
  ) => {
    if (!response.ok || !response.data?.user) {
      onError?.(response.data?.error);

      return false;
    }

    const nextUser = response.data.user;
    const nextAddresses = nextUser.shippingAddresses ?? [];
    const nextSelectedId =
      nextUser.selectedShippingAddressId ?? nextAddresses[0]?.id ?? null;

    onAddressesChange(nextAddresses, nextSelectedId);
    void update({
      user: {
        shippingAddresses: nextAddresses,
        selectedShippingAddressId: nextSelectedId,
      },
    });

    return true;
  };

  const selectAddress = async (
    addressId: string,
    currentSelectedId: string | null,
  ) => {
    if (addressId === currentSelectedId || selectingAddressId !== null) {
      return;
    }

    setSelectingAddressId(addressId);
    onError?.(undefined);

    const response = await selectAccountAddressClient(addressId);

    setSelectingAddressId(null);

    applyAddressResponse(response);
  };

  return { selectingAddressId, selectAddress, applyAddressResponse };
};
