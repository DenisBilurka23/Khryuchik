import { Alert, Button, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Plate } from "@/components/primitives";
import { useAccountAddresses } from "@/hooks/useAccountAddresses";

import { SectionCard } from "../../shared";
import { AddressCard } from "./address-card";
import { AddressForm } from "./address-form";

import type { AddressesSectionProps } from "./types";

export const AddressesSection = ({
  locale,
  initialAddresses,
  initialSelectedId,
  onAddressesChangeAction,
  autoOpenAddForm = false,
}: AddressesSectionProps) => {
  const t = useTranslations("accountPage");
  const tCheckout = useTranslations("storefront.checkoutPage");

  const {
    addresses,
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
    selectAddress,
  } = useAccountAddresses({
    initialAddresses,
    initialSelectedId,
    onAddressesChangeAction,
    autoOpenAddForm,
  });

  return (
    <SectionCard
      title={tCheckout("shippingTitle")}
      action={
        formMode ? null : (
          <Button variant="contained" onClick={beginAdd}>
            {t("addAddress")}
          </Button>
        )
      }
    >
      <Stack spacing={2.5}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {formMode ? (
          <AddressForm
            locale={locale}
            title={
              formMode.kind === "edit" ? t("editAddressTitle") : t("addAddress")
            }
            value={form}
            isSaving={isSaving}
            onFieldChange={setFormField}
            onCountryChange={setFormCountry}
            onSubmit={() => void submitForm()}
            onCancel={cancelForm}
          />
        ) : null}

        {addresses.length === 0 ? (
          <Plate pad="sm">
            <Typography color="text.secondary">
              {t("noAddressesYet")}
            </Typography>
          </Plate>
        ) : null}

        <Grid container spacing={2}>
          {addresses.map((address) => (
            <Grid key={address.id} size={{ xs: 12, md: 6 }}>
              <AddressCard
                address={address}
                locale={locale}
                isCurrent={address.id === selectedAddressId}
                isSelecting={selectingAddressId === address.id}
                isBusy={
                  selectingAddressId === address.id ||
                  deletingAddressId === address.id
                }
                onSelect={() => void selectAddress(address.id)}
                onEdit={() => beginEdit(address)}
                onDelete={() => deleteAddress(address.id)}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </SectionCard>
  );
};

export type { AddressesSectionProps } from "./types";
