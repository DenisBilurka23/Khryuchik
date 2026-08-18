import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { syncOrderFromPrintify } from "@/server/orders/services/fulfillment.service";
import { notifyAdminPrintifyShopDisconnected } from "@/server/payments/telegram";
import {
  parsePrintifyWebhookEvent,
  PRINTIFY_SIGNATURE_HEADER,
  verifyPrintifyWebhookSignature,
} from "@/server/printify/webhook";
import type { PrintifyWebhookEvent } from "@/server/printify/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const handleEvent = async (event: PrintifyWebhookEvent) => {
  if (event.type === "shop:disconnected") {
    await notifyAdminPrintifyShopDisconnected(event.resource.id);
    return;
  }

  if (event.type.startsWith("order:")) {
    await syncOrderFromPrintify(event.resource.id);
    return;
  }

  console.info(`Ignoring Printify webhook topic ${event.type}`);
};

export const POST = async (request: NextRequest) => {
  const rawBody = await request.text();

  try {
    const verification = verifyPrintifyWebhookSignature(
      rawBody,
      request.headers.get(PRINTIFY_SIGNATURE_HEADER),
    );

    // The secret is per-subscription: until the webhooks are re-registered with
    // it, Printify keeps sending unsigned deliveries.
    if (verification === "unverified") {
      console.warn(
        "[printify-webhook] accepted an unsigned delivery — PRINTIFY_WEBHOOK_SECRET is not set",
      );
    }
  } catch (error) {
    console.error("Printify webhook signature verification failed", error);
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  const event = parsePrintifyWebhookEvent(rawBody);

  if (!event) {
    console.warn(
      "[printify-webhook] unreadable payload",
      rawBody.slice(0, 500),
    );
    return NextResponse.json({ received: false });
  }

  try {
    await handleEvent(event);
  } catch (error) {
    console.error(`Failed to process Printify event ${event.type}`, error);
  }

  return NextResponse.json({ received: true });
};
