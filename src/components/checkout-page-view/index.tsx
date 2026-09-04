"use client";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { submitCheckoutClient } from "@/client-api/checkout";
import { useCart } from "@/components/cart/store";
import { clearBuyNowItem } from "@/components/cart/buy-now-store";
import { EmptyCartState } from "@/components/cart";
import storefrontStyles from "@/components/storefront/storefront.module.css";
import { useBuyNowCheckoutItems } from "@/hooks/useBuyNowCheckoutItems";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import { usePickupPoints } from "@/hooks/usePickupPoints";
import type { ShippingPickupPoint } from "@/types/shipping";
import { useShippingQuote } from "@/hooks/useShippingQuote";
import {
  type CountryCode,
  getAllCountriesSorted,
  getCountryPaymentMethods,
  getLocalizedPath,
  isIsoCountryCode,
  isPurchasableAvailability,
  type PaymentMethod,
} from "@/utils";

import {
  CheckoutContactSection,
  CheckoutOrderSummarySection,
  CheckoutPaymentSection,
  CheckoutSavedAddressesSection,
  CheckoutShippingAddressSection,
  CheckoutShippingMethodSection,
} from "./sections";
import type {
  CheckoutLabels,
  CheckoutPageViewProps,
  FieldErrors,
  FormFieldKey,
  FormState,
} from "./types";
import {
  formFromAddress,
  isShippingBlocking,
  resolvePickupGroupIds,
  resolveShippingSelection,
  resolveShippingTotal,
  shippingErrorMessage,
  shippingGroupIssueMessage,
  unshippableGroups,
  validateForm,
} from "./utils";

export const CheckoutPageView = ({
  locale,
  country,
  currency,
  initialCustomer,
  initialShippingAddresses,
  initialSelectedAddressId,
}: CheckoutPageViewProps) => {
  const t = useTranslations("storefront.checkoutPage");
  const labels: CheckoutLabels = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    breadcrumbs: t.raw("breadcrumbs") as CheckoutLabels["breadcrumbs"],
    contactTitle: t("contactTitle"),
    shippingTitle: t("shippingTitle"),
    paymentTitle: t("paymentTitle"),
    summaryTitle: t("summaryTitle"),
    shippingMethod: t.raw("shippingMethod") as CheckoutLabels["shippingMethod"],
    fields: t.raw("fields") as CheckoutLabels["fields"],
    savedAddressesTitle: t("savedAddressesTitle"),
    newAddressOption: t("newAddressOption"),
    paymentMethods: t.raw("paymentMethods") as CheckoutLabels["paymentMethods"],
    summary: t.raw("summary") as CheckoutLabels["summary"],
    submit: t.raw("submit") as CheckoutLabels["submit"],
    errors: t.raw("errors") as CheckoutLabels["errors"],
    fieldErrors: t.raw("fieldErrors") as CheckoutLabels["fieldErrors"],
    emptyState: t.raw("emptyState") as CheckoutLabels["emptyState"],
  };

  const cart = useCart();
  const buyNowItems = useBuyNowCheckoutItems();

  const { items, subtotal, isLoading, isPricingUnavailable, hasStoredItems } =
    useResolvedCart(locale, country, buyNowItems ?? undefined);
  const hasUnavailableItems = items.some(
    (item) => !isPurchasableAvailability(item.availability),
  );

  const availableMethods = useMemo(
    () => getCountryPaymentMethods(country),
    [country],
  );
  const allCountries = useMemo(() => getAllCountriesSorted(locale), [locale]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    availableMethods[0],
  );
  const paymentMethod = availableMethods.includes(selectedMethod)
    ? selectedMethod
    : availableMethods[0];

  const hasSavedAddresses =
    initialShippingAddresses !== undefined &&
    initialShippingAddresses.length > 0;

  const defaultSelectedAddressId = hasSavedAddresses
    ? (initialSelectedAddressId ?? initialShippingAddresses![0]?.id ?? "")
    : "";

  const defaultAddress = hasSavedAddresses
    ? initialShippingAddresses!.find((a) => a.id === defaultSelectedAddressId)
    : undefined;

  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState<string>(
    defaultSelectedAddressId,
  );
  const [form, setForm] = useState<FormState>(() =>
    formFromAddress(initialCustomer, defaultAddress),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [selectedShippingOptionIds, setSelectedShippingOptionIds] = useState<
    Record<string, string>
  >({});
  const [selectedPickupPoints, setSelectedPickupPoints] = useState<
    Record<string, ShippingPickupPoint>
  >({});
  const [pickupPointError, setPickupPointError] = useState<string | null>(null);
  const [isLocationFieldFocused, setIsLocationFieldFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeHref = getLocalizedPath(locale, "/");
  const cartHref = getLocalizedPath(locale, "/cart");
  const shopHref = getLocalizedPath(locale, "/shop");
  const confirmationHref = getLocalizedPath(locale, "/checkout/confirmation");
  const isDigitalOnly =
    items.length > 0 && items.every((item) => item.isDigital);

  const checkoutItems = buyNowItems ?? cart.items;
  const quoteAddress = isIsoCountryCode(form.country)
    ? {
        country: form.country,
        region: form.region.trim() || undefined,
        city: form.city.trim() || undefined,
        postalCode: form.postalCode.trim() || undefined,
        line1: form.line1.trim() || undefined,
      }
    : null;
  const shippingQuote = useShippingQuote({
    locale,
    items: checkoutItems,
    address: quoteAddress,
    isEnabled: !isDigitalOnly && checkoutItems.length > 0,
    isLocationFieldFocused,
  });

  const pickupGroupIds = resolvePickupGroupIds(
    shippingQuote.groups,
    selectedShippingOptionIds,
  );
  const pickupPoints = usePickupPoints({
    address: quoteAddress,
    isEnabled: pickupGroupIds.length > 0,
  });

  const shipping =
    shippingQuote.groups.length > 0
      ? resolveShippingTotal(shippingQuote.groups, selectedShippingOptionIds)
      : (shippingQuote.shipping ?? 0);
  const total = subtotal + shipping;
  const blockedGroups = unshippableGroups(shippingQuote.groups);
  const blockedGroupIssue = blockedGroups[0]?.issue;
  const isBlockedByShipping =
    isShippingBlocking(shippingQuote.status) || blockedGroups.length > 0;
  const globalShippingError = shippingErrorMessage(
    shippingQuote.status,
    labels,
  );
  const shippingError =
    globalShippingError ??
    (blockedGroupIssue
      ? shippingGroupIssueMessage(blockedGroupIssue, labels)
      : null);

  const handleRemoveGroup = buyNowItems
    ? undefined
    : (groupId: string) => {
        const group = shippingQuote.groups.find(
          (candidate) => candidate.id === groupId,
        );

        group?.itemIds.forEach((itemId) => cart.removeItem(itemId));
      };

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
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      clearFieldError(key);
    };

  const handleShippingOptionChange = (groupId: string, optionId: string) => {
    setSelectedShippingOptionIds((prev) => ({ ...prev, [groupId]: optionId }));
    setPickupPointError(null);
  };

  const handlePickupPointChange = (
    groupId: string,
    point: ShippingPickupPoint,
  ) => {
    setSelectedPickupPoints((prev) => ({ ...prev, [groupId]: point }));
    setPickupPointError(null);
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

  const errorForCode = (code: string): string => {
    switch (code) {
      case "empty_cart":
      case "unresolved_items":
        return labels.errors.emptyCart;
      case "invalid_payload":
        return labels.errors.invalidPayload;
      case "invalid_email":
        return labels.errors.invalidEmail;
      case "unsupported_payment_method":
        return labels.errors.unsupportedMethod;
      case "pricing_unavailable":
        return labels.errors.pricingUnavailable;
      case "shipping_unavailable":
        return labels.errors.shippingUnavailable;
      case "shipping_unsupported_destination":
        return labels.errors.shippingUnsupportedDestination;
      case "shipping_unsupported_parcel":
        return labels.errors.shippingUnsupportedParcel;
      case "shipping_missing_data":
        return labels.errors.shippingMissingData;
      case "unsupported_variant":
        return labels.errors.unsupportedVariant;
      case "item_out_of_stock":
        return labels.errors.itemOutOfStock;
      case "pickup_point_required":
        return labels.fieldErrors.pickupPointRequired;
      case "shop_closed":
        return labels.errors.shopClosed;
      case "payment_failed":
      case "stripe_session_missing_url":
        return labels.errors.paymentFailed;
      default:
        return labels.errors.generic;
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isPricingUnavailable) {
      setError(labels.errors.pricingUnavailable);
      return;
    }

    if (hasUnavailableItems) {
      setError(labels.errors.itemOutOfStock);
      return;
    }

    if (isBlockedByShipping) {
      setError(shippingError);
      return;
    }

    const validationErrors = validateForm(form, labels.fieldErrors, {
      skipAddress: isDigitalOnly,
    });
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError(null);
      return;
    }

    if (!isDigitalOnly && !isIsoCountryCode(form.country)) {
      setFieldErrors({ country: labels.fieldErrors.required });
      return;
    }

    const missingPickupPoint = pickupGroupIds.some(
      (groupId) => !selectedPickupPoints[groupId],
    );

    if (missingPickupPoint) {
      setPickupPointError(labels.fieldErrors.pickupPointRequired);
      setError(null);
      return;
    }

    setFieldErrors({});
    setPickupPointError(null);
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await submitCheckoutClient({
        locale,
        items: buyNowItems ?? cart.items,
        customer: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
        },
        shippingAddress: isDigitalOnly
          ? undefined
          : {
              line1: form.line1.trim(),
              line2: form.line2.trim() || undefined,
              city: form.city.trim(),
              region: form.region.trim() || undefined,
              postalCode: form.postalCode.trim() || undefined,
              country: form.country as CountryCode,
            },
        paymentMethod,
        selectedShippingOptionIds: isDigitalOnly
          ? undefined
          : resolveShippingSelection(
              shippingQuote.groups,
              selectedShippingOptionIds,
            ),
        pickupPointIds:
          pickupGroupIds.length > 0
            ? Object.fromEntries(
                pickupGroupIds.map((groupId) => [
                  groupId,
                  selectedPickupPoints[groupId].id,
                ]),
              )
            : undefined,
        notes: form.notes.trim() || undefined,
      });

      if (!response.ok || !response.data || "error" in response.data) {
        const code =
          response.data && "error" in response.data
            ? response.data.error
            : "generic";
        setError(errorForCode(code));
        setIsSubmitting(false);
        return;
      }

      const { orderId, redirectUrl } = response.data;

      clearBuyNowItem();

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      const params = new URLSearchParams({ order_id: orderId });
      window.location.assign(`${confirmationHref}?${params.toString()}`);
    } catch (submitError) {
      console.error("Checkout submit failed", submitError);
      setError(labels.errors.generic);
      setIsSubmitting(false);
    }
  };

  const showAddressForm = selectedSavedAddressId === "" || !hasSavedAddresses;

  return (
    <Box className={storefrontStyles.pageShell}>
      <Box className={storefrontStyles.pageContent}>
        <Box sx={{ pb: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs
              items={[
                { label: labels.breadcrumbs.home, href: homeHref },
                { label: labels.breadcrumbs.cart, href: cartHref },
                { label: labels.breadcrumbs.current },
              ]}
            />

            <Box
              sx={{
                borderRadius: "32px",
                p: { xs: 3, md: 5 },
                background:
                  "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.45), transparent 28%), #FFF8F0",
                border: "1px solid #F0DFC8",
                mb: 5,
              }}
            >
              <Typography
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "primary.main",
                }}
              >
                {labels.eyebrow}
              </Typography>
              <Typography
                variant="h1"
                sx={{ mt: 2, fontSize: { xs: 36, md: 56 } }}
              >
                {labels.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{
                  mt: 2,
                  maxWidth: 760,
                  lineHeight: 1.8,
                  fontSize: { xs: 16, md: 18 },
                }}
              >
                {labels.lead}
              </Typography>
            </Box>

            {!hasStoredItems && !isLoading ? (
              <EmptyCartState
                title={labels.emptyState.title}
                text={labels.emptyState.text}
                actionLabel={labels.emptyState.action}
                actionHref={shopHref}
              />
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={4} alignItems="flex-start">
                  <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                    <Stack spacing={4}>
                      <CheckoutContactSection
                        form={form}
                        fieldErrors={fieldErrors}
                        onField={handleField}
                        labels={labels}
                      />

                      {!isDigitalOnly && hasSavedAddresses ? (
                        <CheckoutSavedAddressesSection
                          addresses={initialShippingAddresses!}
                          selectedAddressId={selectedSavedAddressId}
                          onSelect={handleSavedAddressSelect}
                          locale={locale}
                          labels={labels}
                        />
                      ) : null}

                      {!isDigitalOnly && showAddressForm ? (
                        <CheckoutShippingAddressSection
                          form={form}
                          fieldErrors={fieldErrors}
                          onField={handleField}
                          countries={allCountries}
                          onCountryChange={handleCountryChange}
                          onRegionChange={handleRegionChange}
                          onLocationFieldFocusChange={setIsLocationFieldFocused}
                          labels={labels}
                        />
                      ) : null}

                      {!isDigitalOnly ? (
                        <CheckoutShippingMethodSection
                          groups={shippingQuote.groups}
                          items={items}
                          isLoading={shippingQuote.status === "loading"}
                          errorMessage={globalShippingError ?? undefined}
                          selectedOptionIds={selectedShippingOptionIds}
                          onOptionChange={handleShippingOptionChange}
                          onRemoveGroup={handleRemoveGroup}
                          pickupPoints={pickupPoints.points}
                          pickupPointsStatus={pickupPoints.status}
                          selectedPickupPoints={selectedPickupPoints}
                          onPickupPointChange={handlePickupPointChange}
                          pickupPointErrorMessage={
                            pickupPointError ?? undefined
                          }
                          currency={currency}
                          locale={locale}
                          labels={labels}
                        />
                      ) : null}

                      <CheckoutPaymentSection
                        availableMethods={availableMethods}
                        selectedMethod={paymentMethod}
                        onMethodChange={setSelectedMethod}
                        labels={labels}
                      />
                    </Stack>
                  </Grid>

                  {/* Order summary */}
                  <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <CheckoutOrderSummarySection
                      items={items}
                      subtotal={subtotal}
                      shipping={shipping}
                      shippingStatus={shippingQuote.status}
                      isDigitalOnly={isDigitalOnly}
                      total={total}
                      currency={currency}
                      locale={locale}
                      error={
                        isPricingUnavailable
                          ? labels.errors.pricingUnavailable
                          : hasUnavailableItems
                            ? labels.errors.itemOutOfStock
                            : error
                      }
                      isSubmitting={isSubmitting}
                      isBlocked={
                        isPricingUnavailable ||
                        hasUnavailableItems ||
                        isBlockedByShipping
                      }
                      hasStoredItems={hasStoredItems}
                      paymentMethod={paymentMethod}
                      labels={labels}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export type { CheckoutPageViewProps } from "./types";
