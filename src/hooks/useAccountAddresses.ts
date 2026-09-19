"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  addAccountAddressClient,
  deleteAccountAddressClient,
  updateAccountAddressClient,
} from "@/client-api/account";
import {
  UserOperationErrorReason,
  type UserShippingAddress,
  type UserShippingAddressInput,
} from "@/types/users";
import { isIsoCountryCode, isPostalCodeValid } from "@/utils";

import { useShippingAddressSelection } from "./useShippingAddressSelection";

import type {
  AccountAddressFormMode,
  UseAccountAddressesParams,
  UseAccountAddressesResult,
} from "./useAccountAddresses.types";

export type {
  AccountAddressFormMode,
  UseAccountAddressesParams,
  UseAccountAddressesResult,
} from "./useAccountAddresses.types";

const emptyAddressForm = (): UserShippingAddressInput => ({
  title: "",
  line1: "",
  line2: undefined,
  city: "",
  region: undefined,
  postalCode: undefined,
  country: "",
});

const toAddressForm = (
  address: UserShippingAddress,
): UserShippingAddressInput => ({
  title: address.title,
  line1: address.line1,
  line2: address.line2,
  city: address.city,
  region: address.region,
  postalCode: address.postalCode,
  country: address.country,
});

export const useAccountAddresses = ({
  initialAddresses,
  initialSelectedId,
  onAddressesChange,
  autoOpenAddForm = false,
}: UseAccountAddressesParams): UseAccountAddressesResult => {
  const t = useTranslations("accountPage");

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(initialSelectedId);
  const [formMode, setFormMode] = useState<AccountAddressFormMode | null>(
    autoOpenAddForm ? { kind: "add" } : null,
  );
  const [form, setForm] = useState<UserShippingAddressInput>(emptyAddressForm);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getErrorMessage = (reason?: string) => {
    switch (reason) {
      case UserOperationErrorReason.MissingFields:
        return t("addressMissingFields");
      case UserOperationErrorReason.InvalidCountry:
        return t("addressInvalidCountry");
      case UserOperationErrorReason.InvalidPostalCode:
        return t("addressInvalidPostalCode");
      case UserOperationErrorReason.AddressNotFound:
        return t("addressNotFound");
      default:
        return t("unexpectedError");
    }
  };

  const { selectingAddressId, selectAddress, applyAddressResponse } =
    useShippingAddressSelection({
      onAddressesChange: (nextAddresses, nextSelectedId) => {
        setAddresses(nextAddresses);
        setSelectedAddressId(nextSelectedId);
        onAddressesChange?.(nextAddresses, nextSelectedId);
      },
      onError: (reason) =>
        setErrorMessage(reason ? getErrorMessage(reason) : null),
    });

  const sortedAddresses = [...addresses].sort((left, right) => {
    const leftSelected = left.id === selectedAddressId ? 1 : 0;
    const rightSelected = right.id === selectedAddressId ? 1 : 0;

    return rightSelected - leftSelected;
  });

  const closeForm = () => {
    setFormMode(null);
    setForm(emptyAddressForm());
  };

  const beginAdd = () => {
    setFormMode({ kind: "add" });
    setForm(emptyAddressForm());
    setErrorMessage(null);
  };

  const beginEdit = (address: UserShippingAddress) => {
    setFormMode({ kind: "edit", addressId: address.id });
    setForm(toAddressForm(address));
    setErrorMessage(null);
  };

  const cancelForm = () => {
    closeForm();
    setErrorMessage(null);
  };

  const setFormField = <TField extends keyof UserShippingAddressInput>(
    field: TField,
    value: UserShippingAddressInput[TField],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const setFormCountry = (country: string) => {
    setForm((prev) => ({ ...prev, country, region: undefined }));
    setErrorMessage(null);
  };

  const submitForm = async () => {
    if (isSaving || !formMode) return;

    if (!form.line1.trim() || !form.city.trim()) {
      setErrorMessage(t("addressMissingFields"));
      return;
    }

    if (!isIsoCountryCode(form.country)) {
      setErrorMessage(t("addressInvalidCountry"));
      return;
    }

    if (!isPostalCodeValid(form.postalCode ?? "")) {
      setErrorMessage(t("addressInvalidPostalCode"));
      return;
    }

    const payload: UserShippingAddressInput = {
      title: form.line1.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim() || undefined,
      city: form.city.trim(),
      region: form.region?.trim() || undefined,
      postalCode: form.postalCode?.trim() || undefined,
      country: form.country,
    };

    setIsSaving(true);
    setErrorMessage(null);

    const response =
      formMode.kind === "edit"
        ? await updateAccountAddressClient(formMode.addressId, payload)
        : await addAccountAddressClient(payload);

    setIsSaving(false);

    if (!applyAddressResponse(response)) {
      return;
    }

    closeForm();
  };

  const deleteAddress = async (addressId: string) => {
    if (deletingAddressId !== null) return;

    setDeletingAddressId(addressId);
    setErrorMessage(null);

    const response = await deleteAccountAddressClient(addressId);

    setDeletingAddressId(null);

    if (!applyAddressResponse(response)) {
      return;
    }

    if (formMode?.kind === "edit" && formMode.addressId === addressId) {
      closeForm();
    }
  };

  return {
    addresses: sortedAddresses,
    selectedAddressId,
    formMode,
    form,
    isSaving,
    selectingAddressId,
    deletingAddressId,
    errorMessage,
    beginAdd,
    beginEdit,
    cancelForm,
    setFormField,
    setFormCountry,
    submitForm,
    deleteAddress,
    selectAddress: (addressId: string) =>
      selectAddress(addressId, selectedAddressId),
  };
};
