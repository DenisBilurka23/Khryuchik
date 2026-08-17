"use client";

import {
  Box,
  Breadcrumbs,
  Container,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { submitCheckoutClient } from "@/client-api/checkout";
import { useCart } from "@/components/cart/store";
import { clearBuyNowItem } from "@/components/cart/buy-now-store";
import { EmptyCartState } from "@/components/cart";
import storefrontStyles from "@/components/storefront/storefront.module.css";
import { useBuyNowCheckoutItems } from "@/hooks/useBuyNowCheckoutItems";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import { useShippingQuote } from "@/hooks/useShippingQuote";
import {
  type CountryCode,
  getAllCountriesSorted,
  getCountryPaymentMethods,
  getLocalizedPath,
  isIsoCountryCode,
  type PaymentMethod,
} from "@/utils";

import {
  CheckoutContactSection,
  CheckoutOrderSummarySection,
  CheckoutPaymentSection,
  CheckoutSavedAddressesSection,
  CheckoutShippingAddressSection,
} from "./sections";
import type {
  CheckoutLabels,
  CheckoutPageViewProps,
  FieldErrors,
  FormFieldKey,
  FormState,
} from "./types";
import { formFromAddress, validateForm } from "./utils";

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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeHref = getLocalizedPath(locale, "/");
  const cartHref = getLocalizedPath(locale, "/cart");
  const shopHref = getLocalizedPath(locale, "/shop");
  const confirmationHref = getLocalizedPath(locale, "/checkout/confirmation");
  const isDigitalOnly =
    items.length > 0 && items.every((item) => item.isDigital);

  const checkoutItems = buyNowItems ?? cart.items;
  const shippingQuote = useShippingQuote({
    locale,
    items: checkoutItems,
    address: isIsoCountryCode(form.country)
      ? {
          country: form.country,
          region: form.region.trim() || undefined,
          city: form.city.trim() || undefined,
          postalCode: form.postalCode.trim() || undefined,
          line1: form.line1.trim() || undefined,
        }
      : null,
    isEnabled: !isDigitalOnly && checkoutItems.length > 0,
  });

  const shipping = shippingQuote.shipping ?? 0;
  const total = subtotal + shipping;
  const isShippingBlocking =
    shippingQuote.status === "loading" ||
    shippingQuote.status === "unavailable" ||
    shippingQuote.status === "unsupported-destination" ||
    shippingQuote.status === "unsupported-variant";
  const shippingErrorMessage =
    shippingQuote.status === "unsupported-destination"
      ? labels.errors.shippingUnsupportedDestination
      : shippingQuote.status === "unsupported-variant"
        ? labels.errors.unsupportedVariant
        : shippingQuote.status === "unavailable"
          ? labels.errors.shippingUnavailable
          : null;

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

  const handleCountryChange = (value: string) => {
    setForm((prev) => ({ ...prev, country: value }));
    clearFieldError("country");
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
      case "unsupported_variant":
        return labels.errors.unsupportedVariant;
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

    if (isShippingBlocking) {
      setError(shippingErrorMessage);
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

    setFieldErrors({});
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

      // Cart is cleared in CheckoutResultView on confirmation mount — clearing
      // here would empty the cart before the browser navigates, briefly
      // rendering the empty state on this page.
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
    <Box className={storefrontStyles.pageShell} sx={{ color: "text.primary" }}>
      <Box className={storefrontStyles.pageContent}>
        <Box sx={{ py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg">
            <Breadcrumbs sx={{ mb: 4 }}>
              <MuiLink
                component={Link}
                underline="hover"
                color="inherit"
                href={homeHref}
              >
                {labels.breadcrumbs.home}
              </MuiLink>
              <MuiLink
                component={Link}
                underline="hover"
                color="inherit"
                href={cartHref}
              >
                {labels.breadcrumbs.cart}
              </MuiLink>
              <Typography color="text.primary">
                {labels.breadcrumbs.current}
              </Typography>
            </Breadcrumbs>

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
                          : (shippingErrorMessage ?? error)
                      }
                      isSubmitting={isSubmitting}
                      isBlocked={isPricingUnavailable || isShippingBlocking}
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
