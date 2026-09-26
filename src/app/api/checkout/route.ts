import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CHECKOUT_RATE_LIMIT } from "@/constants/rate-limit";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import { createStripeCheckoutSession } from "@/server/payments/stripe";
import { isShopClosed } from "@/server/shop/maintenance.service";
import {
  createOrder,
  OrderValidationError,
} from "@/server/orders/services/orders.service";
import { updateOrderPayment } from "@/server/orders/repositories/orders.repository";
import { isStoredCartItem } from "@/types/cart-guards";
import { BOOK_FORMAT } from "@/constants/catalog";
import {
  asOptionalString,
  getCountryPaymentMethods,
  getLocalizedPath,
} from "@/utils";

import {
  isPaymentMethod,
  isValidEmail,
  parseCustomer,
  parseSelectedShippingOptionIds,
  parseShippingAddress,
} from "./utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CheckoutErrorCode =
  | OrderValidationError["code"]
  | "invalid_payload"
  | "invalid_email"
  | "shop_closed"
  | "too_many_requests"
  | "payment_failed"
  | "stripe_session_missing_url";

const validationErrorResponse = (code: CheckoutErrorCode, status = 400) =>
  NextResponse.json({ error: code }, { status });

export const POST = async (request: NextRequest) => {
  const rateLimit = await consumeRateLimit({
    key: `checkout:${getClientIpKey(request.headers)}`,
    ...CHECKOUT_RATE_LIMIT,
  });

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  if (isShopClosed()) {
    return validationErrorResponse("shop_closed", 503);
  }

  const payload = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

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

  const rawItems = Array.isArray(payload.items) ? payload.items : [];
  const items = rawItems.filter(isStoredCartItem);

  const customer = parseCustomer(payload.customer);
  const shippingAddress = parseShippingAddress(payload.shippingAddress);
  const paymentMethod = payload.paymentMethod;

  const isDigitalOnly =
    items.length > 0 &&
    items.every((item) => item.selections?.format === BOOK_FORMAT.digital);

  if (
    items.length !== rawItems.length ||
    !customer ||
    (!isDigitalOnly && !shippingAddress) ||
    !isPaymentMethod(paymentMethod)
  ) {
    return validationErrorResponse("invalid_payload");
  }

  if (!getCountryPaymentMethods(country).includes(paymentMethod)) {
    return validationErrorResponse("unsupported_payment_method");
  }

  if (!isValidEmail(customer.email)) {
    return validationErrorResponse("invalid_email");
  }

  try {
    const order = await createOrder({
      locale,
      country,
      items,
      customer,
      shippingAddress: shippingAddress ?? undefined,
      paymentMethod,
      selectedShippingOptionIds: parseSelectedShippingOptionIds(
        payload.selectedShippingOptionIds,
      ),
      pickupPointIds: parseSelectedShippingOptionIds(payload.pickupPointIds),
      promoCode: asOptionalString(payload.promoCode),
      userId,
      notes:
        typeof payload.notes === "string" && payload.notes.length > 0
          ? payload.notes
          : undefined,
    });

    if (paymentMethod === "stripe") {
      const origin = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
      const successPath = getLocalizedPath(locale, "/checkout/success");
      const cancelPath = getLocalizedPath(locale, "/checkout/cancel");

      let session;
      try {
        session = await createStripeCheckoutSession(order, {
          successUrl: `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${origin}${cancelPath}?order_id=${order.id}`,
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
