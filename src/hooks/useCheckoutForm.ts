"use client";

import { type ChangeEvent, useState } from "react";

import { formFromAddress } from "@/components/checkout-page-view/utils";
import type {
  FieldErrors,
  FormFieldKey,
  FormState,
} from "@/components/checkout-page-view/types";

import type {
  UseCheckoutFormParams,
  UseCheckoutFormResult,
} from "./useCheckoutForm.types";

export const useCheckoutForm = ({
  initialCustomer,
  initialShippingAddresses,
  initialSelectedAddressId,
}: UseCheckoutFormParams): UseCheckoutFormResult => {
  const hasSavedAddresses =
    initialShippingAddresses !== undefined &&
    initialShippingAddresses.length > 0;

  const defaultSelectedAddressId = hasSavedAddresses
    ? (initialSelectedAddressId ?? initialShippingAddresses![0]?.id ?? "")
    : "";

  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>(
    defaultSelectedAddressId,
  );
  const [form, setForm] = useState<FormState>(() =>
    formFromAddress(
      initialCustomer,
      hasSavedAddresses
        ? initialShippingAddresses!.find(
            (address) => address.id === defaultSelectedAddressId,
          )
        : undefined,
    ),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = (key: FormFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleField =
    (key: FormFieldKey) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      clearFieldError(key);
    };

  const handleCountryChange = (value: string) => {
    setForm((prev) => ({ ...prev, country: value, region: "" }));
    clearFieldError("country");
    clearFieldError("region");
  };

  const handleRegionChange = (value: string) => {
    setForm((prev) => ({ ...prev, region: value }));
    clearFieldError("region");
  };

  const handleSavedAddressSelect = (addressId: string) => {
    setSelectedSavedAddressId(addressId);
    setFieldErrors({});

    if (addressId === "") {
      setForm((prev) => ({
        ...prev,
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      }));
      return;
    }

    const address = initialShippingAddresses?.find((a) => a.id === addressId);

    if (address) {
      setForm((prev) => ({
        ...prev,
        line1: address.line1,
        line2: address.line2 ?? "",
        city: address.city,
        region: address.region ?? "",
        postalCode: address.postalCode ?? "",
        country: address.country,
      }));
    }
  };

  return {
    form,
    fieldErrors,
    hasSavedAddresses,
    selectedSavedAddressId,
    showAddressForm: selectedSavedAddressId === "" || !hasSavedAddresses,
    setFieldErrors,
    handleField,
    handleCountryChange,
    handleRegionChange,
    handleSavedAddressSelect,
  };
};
