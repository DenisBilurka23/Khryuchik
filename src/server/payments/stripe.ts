import "server-only";

import Stripe from "stripe";

import type { OrderDocument } from "@/types/order";

const secretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

declare global {
  var __khryuchikStripeClient: Stripe | undefined;
}

const stripeClient = global.__khryuchikStripeClient ?? new Stripe(secretKey);

if (process.env.NODE_ENV !== "production") {
  global.__khryuchikStripeClient = stripeClient;
}

export const getStripeClient = () => stripeClient;

export type StripeCheckoutUrls = {
  successUrl: string;
  cancelUrl: string;
};

const toStripeAmount = (value: number) => Math.round(value * 100);

const buildItemName = (title: string, variant: string | undefined) =>
  variant ? `${title} — ${variant}` : title;

export const createStripeCheckoutSession = async (
  order: OrderDocument,
  urls: StripeCheckoutUrls,
): Promise<Stripe.Checkout.Session> => {
  const currency = order.currency.toLowerCase();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    order.items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: toStripeAmount(item.unitPrice),
        product_data: {
          name: buildItemName(item.title, item.variant),
          metadata: { productId: item.productId },
        },
      },
    }));

  if (order.shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: toStripeAmount(order.shipping),
        product_data: { name: "Shipping" },
      },
    });
  }

  return stripeClient.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: order.customer.email,
    success_url: urls.successUrl,
    cancel_url: urls.cancelUrl,
    metadata: { orderId: order.id },
    payment_intent_data: { metadata: { orderId: order.id } },
  });
};

export const retrieveStripeCheckoutSession = (
  sessionId: string,
): Promise<Stripe.Checkout.Session> =>
  stripeClient.checkout.sessions.retrieve(sessionId);

export const verifyStripeWebhook = (
  rawBody: string,
  signature: string | null,
): Stripe.Event => {
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set");
  }

  if (!signature) {
    throw new Error("Missing stripe-signature header");
  }

  return stripeClient.webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecret,
  );
};
