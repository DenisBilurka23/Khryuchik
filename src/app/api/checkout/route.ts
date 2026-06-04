import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import {
  createStripeCheckoutSession,
} from "@/server/payments/stripe";
import {
  OrderValidationError,
  createOrder,
} from "@/server/orders/services/orders.service";
import { updateOrderPayment } from "@/server/orders/repositories/orders.repository";
import type {
  OrderCustomer,
  OrderShippingAddress,
} from "@/types/order";
import { isStoredCartItem } from "@/types/cart-guards";
import {
  getCountryPaymentMethods,
  type PaymentMethod,
} from "@/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isPaymentMethod = (value: unknown): value is PaymentMethod =>
  value === "stripe" || value === "cod" || value === "telegram_transfer";

const parseCustomer = (value: unknown): OrderCustomer | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;

  if (typeof raw.name !== "string" || raw.name.trim().length === 0) {
    return null;
  }

  const optionalString = (key: string) =>
    typeof raw[key] === "string" && (raw[key] as string).length > 0
      ? (raw[key] as string)
      : undefined;

  return {
    name: raw.name.trim(),
    email: optionalString("email"),
    phone: optionalString("phone"),
    telegram: optionalString("telegram"),
  };
};

const parseShippingAddress = (
  value: unknown,
  country: OrderShippingAddress["country"],
): OrderShippingAddress | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;

  if (
    typeof raw.line1 !== "string" ||
    raw.line1.trim().length === 0 ||
    typeof raw.city !== "string" ||
    raw.city.trim().length === 0
  ) {
    return null;
  }

  const optional = (key: string) =>
    typeof raw[key] === "string" && (raw[key] as string).length > 0
      ? (raw[key] as string)
      : undefined;

  return {
    line1: raw.line1.trim(),
    line2: optional("line2"),
    city: raw.city.trim(),
    region: optional("region"),
    postalCode: optional("postalCode"),
    country,
  };
};

type CheckoutErrorCode =
  | OrderValidationError["code"]
  | "invalid_payload"
  | "invalid_email"
  | "payment_failed"
  | "stripe_session_missing_url";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value: string) => emailPattern.test(value);

const validationErrorResponse = (code: CheckoutErrorCode, status = 400) =>
  NextResponse.json({ error: code }, { status });

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | Record<string, unknown>
    | null;

  if (!payload) {
    return validationErrorResponse("invalid_payload");
  }

  const locale =
    typeof payload.locale === "string" && isLocale(payload.locale)
      ? payload.locale
      : defaultLocale;
  const [country, session] = await Promise.all([
    getRequestCountry(),
    getServerAuthSession(),
  ]);
  const userId = session?.user?.id || undefined;

  const items = Array.isArray(payload.items)
    ? payload.items.filter(isStoredCartItem)
    : [];

  const customer = parseCustomer(payload.customer);
  const shippingAddress = parseShippingAddress(payload.shippingAddress, country);
  const paymentMethod = payload.paymentMethod;

  if (
    !customer ||
    !shippingAddress ||
    !isPaymentMethod(paymentMethod)
  ) {
    return validationErrorResponse("invalid_payload");
  }

  if (!getCountryPaymentMethods(country).includes(paymentMethod)) {
    return validationErrorResponse("unsupported_payment_method");
  }

  if (customer.email && !isValidEmail(customer.email)) {
    return validationErrorResponse("invalid_email");
  }

  try {
    const order = await createOrder({
      locale,
      country,
      items,
      customer,
      shippingAddress,
      paymentMethod,
      userId,
      notes:
        typeof payload.notes === "string" && payload.notes.length > 0
          ? payload.notes
          : undefined,
    });

    if (paymentMethod === "stripe") {
      const origin =
        process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;

      let session;
      try {
        session = await createStripeCheckoutSession(order, {
          successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}/checkout/cancel?order_id=${order.id}`,
        });
      } catch (stripeError) {
        console.error("Stripe session creation failed", stripeError);
        await updateOrderPayment(order.id, { status: "failed" });
        return validationErrorResponse("payment_failed", 502);
      }

      await updateOrderPayment(order.id, { stripeSessionId: session.id });

      if (!session.url) {
        await updateOrderPayment(order.id, { status: "failed" });
        return validationErrorResponse("stripe_session_missing_url", 500);
      }

      return NextResponse.json({ orderId: order.id, redirectUrl: session.url });
    }

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    if (error instanceof OrderValidationError) {
      return validationErrorResponse(error.code);
    }

    console.error("Checkout failed", error);

    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
};
