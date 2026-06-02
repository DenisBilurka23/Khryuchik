"use client";

import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Link as MuiLink,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { submitCheckoutClient } from "@/client-api/checkout";
import { useCart } from "@/components/cart/store";
import { EmptyCartState } from "@/components/cart";
import storefrontStyles from "@/components/storefront/storefront.module.css";
import { useResolvedCart } from "@/hooks/useResolvedCart";
import type { CheckoutPageLabels } from "@/i18n/types";
import {
  countryShippingConfig,
  formatCurrency,
  getCountryCurrency,
  getCountryPaymentMethods,
  getLocalizedPath,
  type PaymentMethod,
} from "@/utils";

import type { CheckoutPageViewProps } from "./types";

type FormState = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  notes: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requiredFields = ["name", "line1", "city"] as const;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const initialFormState = (
  initialCustomer: CheckoutPageViewProps["initialCustomer"],
): FormState => ({
  name: initialCustomer?.name ?? "",
  email: initialCustomer?.email ?? "",
  phone: initialCustomer?.phone ?? "",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  notes: "",
});

const validateForm = (
  form: FormState,
  messages: { required: string; invalidEmail: string },
): FieldErrors => {
  const errors: FieldErrors = {};

  for (const field of requiredFields) {
    if (form[field].trim().length === 0) {
      errors[field] = messages.required;
    }
  }

  if (form.email.trim().length > 0 && !emailPattern.test(form.email.trim())) {
    errors.email = messages.invalidEmail;
  }

  return errors;
};

export const CheckoutPageView = ({
  locale,
  country,
  initialCustomer,
}: CheckoutPageViewProps) => {
  const t = useTranslations("storefront.checkoutPage");
  const labels = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    lead: t("lead"),
    breadcrumbs: t.raw("breadcrumbs") as CheckoutPageLabels["breadcrumbs"],
    contactTitle: t("contactTitle"),
    shippingTitle: t("shippingTitle"),
    paymentTitle: t("paymentTitle"),
    summaryTitle: t("summaryTitle"),
    fields: t.raw("fields") as CheckoutPageLabels["fields"],
    paymentMethods: t.raw(
      "paymentMethods",
    ) as CheckoutPageLabels["paymentMethods"],
    summary: t.raw("summary") as CheckoutPageLabels["summary"],
    submit: t.raw("submit") as CheckoutPageLabels["submit"],
    errors: t.raw("errors") as CheckoutPageLabels["errors"],
    fieldErrors: t.raw("fieldErrors") as CheckoutPageLabels["fieldErrors"],
    emptyState: t.raw("emptyState") as CheckoutPageLabels["emptyState"],
  };

  const cart = useCart();
  const { items, subtotal, isLoading, hasStoredItems } = useResolvedCart(
    locale,
    country,
  );

  const availableMethods = useMemo(
    () => getCountryPaymentMethods(country),
    [country],
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(
    availableMethods[0],
  );
  const paymentMethod = availableMethods.includes(selectedMethod)
    ? selectedMethod
    : availableMethods[0];

  const [form, setForm] = useState<FormState>(() =>
    initialFormState(initialCustomer),
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const homeHref = getLocalizedPath(locale, "/");
  const cartHref = getLocalizedPath(locale, "/cart");
  const shopHref = getLocalizedPath(locale, "/shop");
  const confirmationHref = getLocalizedPath(locale, "/checkout/confirmation");

  const shippingConfig = countryShippingConfig[country];
  const shipping =
    subtotal === 0 || subtotal >= shippingConfig.freeShippingThreshold
      ? 0
      : shippingConfig.shippingPrice;
  const total = subtotal + shipping;
  const currency = getCountryCurrency(country);

  const handleField =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setFieldErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
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
      case "payment_failed":
      case "stripe_session_missing_url":
        return labels.errors.paymentFailed;
      default:
        return labels.errors.generic;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm(form, labels.fieldErrors);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setError(null);
      return;
    }

    setFieldErrors({});
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await submitCheckoutClient({
        locale,
        items: cart.items,
        customer: {
          name: form.name.trim(),
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
        },
        shippingAddress: {
          line1: form.line1.trim(),
          line2: form.line2.trim() || undefined,
          city: form.city.trim(),
          region: form.region.trim() || undefined,
          postalCode: form.postalCode.trim() || undefined,
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

  const renderEmptyState = () => (
    <EmptyCartState
      title={labels.emptyState.title}
      text={labels.emptyState.text}
      actionLabel={labels.emptyState.action}
      actionHref={shopHref}
    />
  );

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
              <Typography variant="h1" sx={{ mt: 2, fontSize: { xs: 36, md: 56 } }}>
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
              renderEmptyState()
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={4} alignItems="flex-start">
                  <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                    <Stack spacing={4}>
                      <Card sx={{ border: "1px solid #F0DFC8" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 2 }}>
                            {labels.contactTitle}
                          </Typography>
                          <Stack spacing={2}>
                            <TextField
                              fullWidth
                              required
                              label={labels.fields.name}
                              value={form.name}
                              onChange={handleField("name")}
                              error={Boolean(fieldErrors.name)}
                              helperText={fieldErrors.name}
                            />
                            <TextField
                              fullWidth
                              type="email"
                              label={labels.fields.email}
                              value={form.email}
                              onChange={handleField("email")}
                              error={Boolean(fieldErrors.email)}
                              helperText={fieldErrors.email}
                            />
                            <TextField
                              fullWidth
                              label={labels.fields.phone}
                              value={form.phone}
                              onChange={handleField("phone")}
                            />
                          </Stack>
                        </CardContent>
                      </Card>

                      <Card sx={{ border: "1px solid #F0DFC8" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 2 }}>
                            {labels.shippingTitle}
                          </Typography>
                          <Stack spacing={2}>
                            <TextField
                              fullWidth
                              required
                              label={labels.fields.line1}
                              value={form.line1}
                              onChange={handleField("line1")}
                              error={Boolean(fieldErrors.line1)}
                              helperText={fieldErrors.line1}
                            />
                            <TextField
                              fullWidth
                              label={labels.fields.line2}
                              value={form.line2}
                              onChange={handleField("line2")}
                            />
                            <Grid container spacing={2}>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  required
                                  label={labels.fields.city}
                                  value={form.city}
                                  onChange={handleField("city")}
                                  error={Boolean(fieldErrors.city)}
                                  helperText={fieldErrors.city}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  label={labels.fields.region}
                                  value={form.region}
                                  onChange={handleField("region")}
                                />
                              </Grid>
                              <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                  fullWidth
                                  label={labels.fields.postalCode}
                                  value={form.postalCode}
                                  onChange={handleField("postalCode")}
                                />
                              </Grid>
                            </Grid>
                            <TextField
                              fullWidth
                              multiline
                              minRows={2}
                              label={labels.fields.notes}
                              value={form.notes}
                              onChange={handleField("notes")}
                            />
                          </Stack>
                        </CardContent>
                      </Card>

                      <Card sx={{ border: "1px solid #F0DFC8" }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 2 }}>
                            {labels.paymentTitle}
                          </Typography>
                          <FormControl fullWidth>
                            <RadioGroup
                              value={paymentMethod}
                              onChange={(event) =>
                                setSelectedMethod(
                                  event.target.value as PaymentMethod,
                                )
                              }
                            >
                              <Stack spacing={1.5}>
                                {availableMethods.map((method) => {
                                  const methodLabel = labels.paymentMethods[method];
                                  return (
                                    <Box
                                      key={method}
                                      sx={{
                                        border: "1px solid",
                                        borderColor:
                                          paymentMethod === method
                                            ? "primary.main"
                                            : "#F0DFC8",
                                        borderRadius: 2,
                                        p: 2,
                                        transition: "border-color .2s ease",
                                      }}
                                    >
                                      <FormControlLabel
                                        value={method}
                                        control={<Radio />}
                                        sx={{ alignItems: "flex-start", m: 0 }}
                                        label={
                                          <Box sx={{ ml: 1 }}>
                                            <Typography sx={{ fontWeight: 700 }}>
                                              {methodLabel.title}
                                            </Typography>
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              sx={{ mt: 0.5 }}
                                            >
                                              {methodLabel.description}
                                            </Typography>
                                          </Box>
                                        }
                                      />
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </RadioGroup>
                          </FormControl>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                    <Card
                      sx={{
                        border: "1px solid #F0DFC8",
                        position: { md: "sticky" },
                        top: { md: 100 },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 800, mb: 2 }}>
                          {labels.summaryTitle}
                        </Typography>

                        <Stack spacing={1} sx={{ mb: 2 }}>
                          {items.map((item) => (
                            <Stack
                              key={item.id}
                              direction="row"
                              justifyContent="space-between"
                              gap={2}
                            >
                              <Typography color="text.secondary">
                                {item.title}
                                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                              </Typography>
                              <Typography>
                                {formatCurrency(
                                  item.price * item.quantity,
                                  locale,
                                  currency,
                                )}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">
                              {labels.summary.itemsLabel}
                            </Typography>
                            <Typography>
                              {formatCurrency(subtotal, locale, currency)}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
                            {labels.summary.totalLabel}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 28,
                              fontWeight: 800,
                              color: "primary.main",
                            }}
                          >
                            {formatCurrency(total, locale, currency)}
                          </Typography>
                        </Stack>

                        {error ? (
                          <Alert severity="error" sx={{ mt: 3 }}>
                            {error}
                          </Alert>
                        ) : null}

                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="large"
                          disabled={isSubmitting || !hasStoredItems}
                          sx={{ mt: 3 }}
                        >
                          {isSubmitting
                            ? labels.submit.loading
                            : labels.submit[paymentMethod]}
                        </Button>
                      </CardContent>
                    </Card>
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
