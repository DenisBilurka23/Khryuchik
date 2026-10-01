"use client";

import { Alert, Box, Container, Grid, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { submitCheckoutClient } from "@/client-api/checkout";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyCartState } from "@/components/cart";
import { clearBuyNowItem } from "@/stores/buy-now";
import { useCart } from "@/stores/cart";
import { PageShell } from "@/components/page-shell";
import { useBuyNowCheckoutItems } from "@/hooks/useBuyNowCheckoutItems";
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import { useCheckoutLabels } from "@/hooks/useCheckoutLabels";
import { useCheckoutRegionSync } from "@/hooks/useCheckoutRegionSync";
import { useCheckoutShippingSelection } from "@/hooks/useCheckoutShippingSelection";
import { usePickupPoints } from "@/hooks/usePickupPoints";
import { usePromoCode } from "@/hooks/usePromoCode";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import { useShippingQuote } from "@/hooks/useShippingQuote";
import {
  getAllCountriesSorted,
  getLocalizedPath,
  getRegionPaymentMethods,
  isIsoCountryCode,
  isPurchasableAvailability,
  isQuotableShippingAddress,
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
import { CheckoutHero } from "./hero";
import type { CheckoutPageViewProps } from "./types";
import {
  buildCheckoutRequest,
  checkoutErrorMessage,
  isShippingBlocking,
  resolveShippingTotal,
  shippingErrorMessage,
  shippingGroupIssueMessage,
  unshippableGroups,
  validateForm,
} from "./utils";

export const CheckoutPageView = ({
  locale,
  region,
  availableRegions,
  currency,
  initialCustomer,
  initialShippingAddresses,
  initialSelectedAddressId,
}: CheckoutPageViewProps) => {
  const labels = useCheckoutLabels();
  const tRegions = useTranslations("storefront.regions");

  const cart = useCart();
  const buyNowItems = useBuyNowCheckoutItems();

  const {
    items,
    subtotal,
    isLoading,
    isPricingUnavailable,
    regionBlockedCount,
    hasStoredItems,
  } = useResolvedCart(locale, region, buyNowItems ?? undefined);
  const hasUnavailableItems = items.some(
    (item) => !isPurchasableAvailability(item.availability),
  );

  const availableMethods = useMemo(
    () => getRegionPaymentMethods(region),
    [region],
  );
  const allCountries = useMemo(() => getAllCountriesSorted(locale), [locale]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    availableMethods[0],
  );
  const paymentMethod = availableMethods.includes(selectedMethod)
    ? selectedMethod
    : availableMethods[0];

  const {
    form,
    fieldErrors,
    hasSavedAddresses,
    selectedSavedAddressId,
    showAddressForm,
    setFieldErrors,
    handleField,
    handleCountryChange,
    handleRegionChange,
    handleSavedAddressSelect,
  } = useCheckoutForm({
    initialCustomer,
    initialShippingAddresses,
    initialSelectedAddressId,
  });

  const [isLocationFieldFocused, setIsLocationFieldFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeHref = getLocalizedPath(locale, "/");
  const cartHref = getLocalizedPath(locale, "/cart");
  const loginHref = getLocalizedPath(locale, "/login");
  const addressesHref = getLocalizedPath(locale, "/account?section=addresses");
  const shopHref = getLocalizedPath(locale, "/shop");
  const confirmationHref = getLocalizedPath(locale, "/checkout/confirmation");
  const isDigitalOnly =
    items.length > 0 && items.every((item) => item.isDigital);

  const checkoutItems = buyNowItems ?? cart.items;
  const regionSync = useCheckoutRegionSync({
    region,
    country: items.length > 0 && !isDigitalOnly ? form.country : "",
    availableRegions,
  });
  const quoteAddress = isIsoCountryCode(form.country)
    ? {
        country: form.country,
        region: form.region.trim() || undefined,
        city: form.city.trim() || undefined,
        postalCode: form.postalCode.trim() || undefined,
        line1: form.line1.trim() || undefined,
      }
    : null;
  const isSelectedAddressIncomplete =
    !isDigitalOnly &&
    selectedSavedAddressId !== "" &&
    !isQuotableShippingAddress(quoteAddress);
  const shippingQuote = useShippingQuote({
    locale,
    currency,
    items: checkoutItems,
    address: quoteAddress,
    isEnabled:
      !isDigitalOnly && checkoutItems.length > 0 && !regionSync.isSwitching,
    isLocationFieldFocused,
  });

  const shippingSelection = useCheckoutShippingSelection({
    groups: shippingQuote.groups,
    pickupPointRequiredMessage: labels.fieldErrors.pickupPointRequired,
  });
  const pickupPoints = usePickupPoints({
    address: quoteAddress,
    isEnabled: shippingSelection.pickupGroupIds.length > 0,
  });

  const {
    code: promoCodeValue,
    appliedPromo,
    discount,
    status: promoStatus,
    isGuest: isPromoGuest,
    setCode: setPromoCode,
    applyCode: applyPromoCode,
    removeCode: removePromoCode,
  } = usePromoCode({ subtotal, isPersistent: buyNowItems === null });

  const shipping =
    shippingQuote.groups.length > 0
      ? resolveShippingTotal(
          shippingQuote.groups,
          shippingSelection.selectedOptionIds,
        )
      : (shippingQuote.shipping ?? 0);
  const total = subtotal + shipping - discount;
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

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (regionSync.isSwitching) {
      return;
    }

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

    if (!shippingSelection.validatePickupPoints()) {
      setError(null);
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await submitCheckoutClient(
        buildCheckoutRequest({
          locale,
          items: buyNowItems ?? cart.items,
          form,
          isDigitalOnly,
          paymentMethod,
          groups: shippingQuote.groups,
          selectedOptionIds: shippingSelection.selectedOptionIds,
          pickupPointIds: shippingSelection.resolvePickupPointIds(),
          promoCode: appliedPromo?.code,
        }),
      );

      if (!response.ok || !response.data || "error" in response.data) {
        const code =
          response.data && "error" in response.data
            ? response.data.error
            : "generic";
        setError(checkoutErrorMessage(code, labels));
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

  return (
    <PageShell>
      <Box>
        <Container maxWidth="lg">
          <Breadcrumbs
            items={[
              { label: labels.breadcrumbs.home, href: homeHref },
              { label: labels.breadcrumbs.cart, href: cartHref },
              { label: labels.breadcrumbs.current },
            ]}
          />

          <CheckoutHero
            eyebrow={labels.eyebrow}
            title={labels.title}
            lead={labels.lead}
          />

          {regionSync.switchedRegion && !regionSync.isSwitching ? (
            <Alert
              severity="info"
              sx={{ mb: 4, borderRadius: "var(--radius-field)" }}
            >
              {labels.regionSwitched.replace(
                "{region}",
                tRegions(`${regionSync.switchedRegion}.label`),
              )}
            </Alert>
          ) : null}

          {regionBlockedCount > 0 && !isPricingUnavailable ? (
            <Alert
              severity="info"
              sx={{ mb: 4, borderRadius: "var(--radius-field)" }}
            >
              {labels.regionUnavailable}
            </Alert>
          ) : null}

          {items.length === 0 && !isLoading ? (
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
                        isSelectedAddressIncomplete={
                          isSelectedAddressIncomplete
                        }
                        accountHref={addressesHref}
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
                        country={form.country}
                        items={items}
                        isLoading={shippingQuote.status === "loading"}
                        errorMessage={globalShippingError ?? undefined}
                        selectedOptionIds={shippingSelection.selectedOptionIds}
                        onOptionChange={shippingSelection.selectOption}
                        onRemoveGroup={handleRemoveGroup}
                        pickupPoints={pickupPoints.points}
                        pickupPointsStatus={pickupPoints.status}
                        selectedPickupPoints={
                          shippingSelection.selectedPickupPoints
                        }
                        onPickupPointChange={
                          shippingSelection.selectPickupPoint
                        }
                        pickupPointErrorMessage={
                          shippingSelection.pickupPointError ?? undefined
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
                    promo={{
                      code: promoCodeValue,
                      appliedPromo,
                      status: promoStatus,
                      isGuest: isPromoGuest,
                      loginHref,
                      onCodeChange: setPromoCode,
                      onApply: applyPromoCode,
                      onRemove: removePromoCode,
                    }}
                    discount={discount}
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
                      isBlockedByShipping ||
                      regionSync.isSwitching
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
    </PageShell>
  );
};

export { CheckoutPageSkeleton } from "./skeleton";
export type { CheckoutPageSkeletonProps, CheckoutPageViewProps } from "./types";
