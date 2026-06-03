import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type Stripe from "stripe";

import {
  findOrderById,
  updateOrderPayment,
} from "@/server/orders/repositories/orders.repository";
import { verifyStripeWebhook } from "@/server/payments/stripe";
import { notifyAdminOrderPaid } from "@/server/payments/telegram";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.warn("checkout.session.completed without orderId metadata");
    return;
  }

  const existing = await findOrderById(orderId);

  if (!existing) {
    console.warn(`Order ${orderId} not found for Stripe session ${session.id}`);
    return;
  }

  if (existing.payment.status === "paid") {
    return;
  }

  const paymentIntent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  await updateOrderPayment(orderId, {
    status: "paid",
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntent,
    paidAt: new Date().toISOString(),
  });

  // Re-fetch so the notification reflects the updated payment status.
  const updated = await findOrderById(orderId);
  if (updated) {
    void notifyAdminOrderPaid(updated);
  }
};

export const POST = async (request: NextRequest) => {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = verifyStripeWebhook(rawBody, signature);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object);
    }
  } catch (error) {
    console.error(`Failed to process Stripe event ${event.type}`, error);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
};
