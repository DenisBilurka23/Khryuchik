import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { PrintifyWebhookEvent } from "./types";

export const PRINTIFY_SIGNATURE_HEADER = "x-pfy-signature";

const SIGNATURE_PREFIX = "sha256=";

export type PrintifyWebhookVerification = "verified" | "unverified";

export class PrintifyWebhookSignatureError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PrintifyWebhookSignatureError";
  }
}

const matchesDigest = (received: string, expected: string) => {
  const receivedBuffer = Buffer.from(received, "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
};

export const verifyPrintifyWebhookSignature = (
  rawBody: string,
  signature: string | null,
): PrintifyWebhookVerification => {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;

  if (!secret) {
    return "unverified";
  }

  if (!signature) {
    throw new PrintifyWebhookSignatureError(
      `Missing ${PRINTIFY_SIGNATURE_HEADER} header`,
    );
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = signature.startsWith(SIGNATURE_PREFIX)
    ? signature.slice(SIGNATURE_PREFIX.length)
    : signature;

  if (!matchesDigest(received, digest)) {
    throw new PrintifyWebhookSignatureError("Signature mismatch");
  }

  return "verified";
};

export const parsePrintifyWebhookEvent = (
  rawBody: string,
): PrintifyWebhookEvent | null => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody);
  } catch {
    return null;
  }

  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  const event = parsed as Partial<PrintifyWebhookEvent>;

  if (
    typeof event.type !== "string" ||
    typeof event.resource?.id !== "string"
  ) {
    return null;
  }

  return event as PrintifyWebhookEvent;
};
