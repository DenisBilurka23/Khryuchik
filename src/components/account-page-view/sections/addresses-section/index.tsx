import { useState } from "react";
import { useSession } from "next-auth/react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import {
  addAccountAddressClient,
  selectAccountAddressClient,
} from "@/client-api/account";
import {
  UserOperationErrorReason,
  type UserShippingAddress,
  type UserShippingAddressInput,
} from "@/types/users";
import {
  getUserShippingAddressLines,
  getUserShippingAddressTitle,
} from "@/utils/account-page";
import { getAllCountriesSorted, isIsoCountryCode } from "@/utils";
import { scrollMenuToKeyChar } from "@/utils/menu";

import { SectionCard } from "../../shared";

import type { AddressesSectionProps } from "./types";

const emptyAddressForm = (): UserShippingAddressInput => ({
  title: "",
  line1: "",
  line2: undefined,
  city: "",
  region: undefined,
  postalCode: undefined,
  country: "",
});

export const AddressesSection = ({
  locale,
  initialAddresses,
  initialSelectedId,
  onAddressesChange,
}: AddressesSectionProps) => {
  const t = useTranslations("accountPage");
  const tCheckout = useTranslations("storefront.checkoutPage");
  const tCheckoutFields = useTranslations("storefront.checkoutPage.fields");

  const { update } = useSession();

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState(initialSelectedId);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSelectingAddressId, setIsSelectingAddressId] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<UserShippingAddressInput>(emptyAddressForm);
  const allCountries = getAllCountriesSorted(locale);

  const sortedAddresses = [...addresses].sort((left, right) => {
    const leftSelected = left.id === selectedShippingAddressId ? 1 : 0;
    const rightSelected = right.id === selectedShippingAddressId ? 1 : 0;

    return rightSelected - leftSelected;
  });

  const getAddressErrorMessage = (error?: string) => {
    switch (error) {
      case UserOperationErrorReason.MissingFields:
      case "missing_fields":
        return t("addressMissingFields");
      case UserOperationErrorReason.InvalidCountry:
      case "invalid_country":
        return t("addressInvalidCountry");
      case UserOperationErrorReason.AddressNotFound:
      case "address_not_found":
        return t("addressNotFound");
      default:
        return t("unexpectedError");
    }
  };

  const applyAddressesState = (nextAddresses: UserShippingAddress[], nextSelectedId: string | null) => {
    setAddresses(nextAddresses);
    setSelectedShippingAddressId(nextSelectedId);
    onAddressesChange?.(nextAddresses, nextSelectedId);
    void update({
      user: {
        shippingAddresses: nextAddresses,
        selectedShippingAddressId: nextSelectedId,
      },
    });
  };

  const handleBeginAddAddress = () => {
    setIsAddingAddress(true);
    setAddressError(null);
  };

  const handleCancelAddAddress = () => {
    setIsAddingAddress(false);
    setAddressError(null);
    setAddressForm(emptyAddressForm());
  };

  const handleAddressFieldChange = <TField extends keyof UserShippingAddressInput>(
    field: TField,
    value: UserShippingAddressInput[TField],
  ) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
    setAddressError(null);
  };

  const handleAddAddress = async () => {
    if (isSavingAddress) return;

    if (!addressForm.line1.trim() || !addressForm.city.trim()) {
      setAddressError(t("addressMissingFields"));
      return;
    }

    if (!isIsoCountryCode(addressForm.country)) {
      setAddressError(t("addressInvalidCountry"));
      return;
    }

    setIsSavingAddress(true);
    setAddressError(null);

    const response = await addAccountAddressClient({
      title: addressForm.line1.trim(),
      line1: addressForm.line1.trim(),
      line2: addressForm.line2?.trim() || undefined,
      city: addressForm.city.trim(),
      region: addressForm.region?.trim() || undefined,
      postalCode: addressForm.postalCode?.trim() || undefined,
      country: addressForm.country,
    });

    setIsSavingAddress(false);

    if (!response.ok || !response.data?.user) {
      setAddressError(getAddressErrorMessage(response.data?.error));
      return;
    }

    const nextUser = response.data.user;
    const nextAddresses = nextUser.shippingAddresses ?? [];
    const nextSelectedId =
      nextUser.selectedShippingAddressId ?? nextAddresses[0]?.id ?? null;

    applyAddressesState(nextAddresses, nextSelectedId);
    setIsAddingAddress(false);
    setAddressForm(emptyAddressForm());
  };

  const handleSelectAddress = async (addressId: string) => {
    if (addressId === selectedShippingAddressId || isSelectingAddressId !== null) return;

    setIsSelectingAddressId(addressId);
    setAddressError(null);

    const response = await selectAccountAddressClient(addressId);

    setIsSelectingAddressId(null);

    if (!response.ok || !response.data?.user) {
      setAddressError(getAddressErrorMessage(response.data?.error));
      return;
    }

    const nextUser = response.data.user;
    const nextAddresses = nextUser.shippingAddresses ?? [];
    const nextSelectedId =
      nextUser.selectedShippingAddressId ?? nextAddresses[0]?.id ?? null;

    applyAddressesState(nextAddresses, nextSelectedId);
  };

  return (
    <SectionCard
      title={tCheckout("shippingTitle")}
      action={
        isAddingAddress ? null : (
          <Button variant="contained" onClick={handleBeginAddAddress}>
            {t("addAddress")}
          </Button>
        )
      }
    >
      <Stack spacing={2.5}>
        {addressError ? <Alert severity="error">{addressError}</Alert> : null}

        {isAddingAddress ? (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "22px",
              border: "1px solid #F0DFC8",
              bgcolor: "#fff",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label={tCheckoutFields("line1")}
                  value={addressForm.line1}
                  onChange={(e) => handleAddressFieldChange("line1", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={tCheckoutFields("line2")}
                  value={addressForm.line2 ?? ""}
                  onChange={(e) =>
                    handleAddressFieldChange("line2", e.target.value || undefined)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  required
                  label={tCheckoutFields("city")}
                  value={addressForm.city}
                  onChange={(e) => handleAddressFieldChange("city", e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={tCheckoutFields("region")}
                  value={addressForm.region ?? ""}
                  onChange={(e) =>
                    handleAddressFieldChange("region", e.target.value || undefined)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={tCheckoutFields("postalCode")}
                  value={addressForm.postalCode ?? ""}
                  onChange={(e) =>
                    handleAddressFieldChange("postalCode", e.target.value || undefined)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>{t("addressCountryLabel")}</InputLabel>
                  <Select
                    value={addressForm.country}
                    label={t("addressCountryLabel")}
                    onChange={(e) => handleAddressFieldChange("country", e.target.value)}
                    MenuProps={{ disablePortal: true, PaperProps: { sx: { maxHeight: 280 } }, MenuListProps: { onKeyDown: scrollMenuToKeyChar } }}
                  >
                    {allCountries.map(({ code, label }) => (
                      <MenuItem key={code} value={code}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
              <Button
                variant="contained"
                onClick={() => void handleAddAddress()}
                loading={isSavingAddress}
              >
                {t("save")}
              </Button>
              <Button variant="outlined" color="inherit" onClick={handleCancelAddAddress}>
                {t("cancel")}
              </Button>
            </Stack>
          </Paper>
        ) : null}

        {sortedAddresses.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "22px",
              border: "1px solid #F0DFC8",
              bgcolor: "#fff",
            }}
          >
            <Typography color="text.secondary">{t("noAddressesYet")}</Typography>
          </Paper>
        ) : null}

        <Grid container spacing={2}>
          {sortedAddresses.map((address) => {
            const isCurrent = address.id === selectedShippingAddressId;
            const isSelecting = isSelectingAddressId === address.id;
            const lines = getUserShippingAddressLines(address, locale);

            return (
              <Grid key={address.id} size={{ xs: 12, md: 6 }}>
                <ButtonBase
                  onClick={() => {
                    if (!isCurrent) void handleSelectAddress(address.id);
                  }}
                  disabled={isCurrent || Boolean(isSelectingAddressId)}
                  sx={{
                    display: "block",
                    width: "100%",
                    borderRadius: "22px",
                    textAlign: "left",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: "22px",
                      border: isCurrent ? "1px solid #D9876C" : "1px solid #F0DFC8",
                      bgcolor: "#fff",
                      height: "100%",
                      opacity: isSelecting ? 0.72 : 1,
                      transition: "opacity 0.2s ease, border-color 0.2s ease",
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <LocationOnOutlinedIcon />
                      <Box sx={{ flex: 1 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          spacing={1}
                        >
                          <Typography sx={{ fontWeight: 700 }}>
                            {getUserShippingAddressTitle(address)}
                          </Typography>
                          {isCurrent ? (
                            <Chip label={t("currentAddress")} color="primary" size="small" />
                          ) : isSelecting ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : null}
                        </Stack>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.75, lineHeight: 1.8 }}
                        >
                          {lines.map((line) => (
                            <Box key={line} component="span" display="block">
                              {line}
                            </Box>
                          ))}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </ButtonBase>
              </Grid>
            );
          })}
        </Grid>
      </Stack>
    </SectionCard>
  );
};

export type { AddressesSectionProps } from "./types";
