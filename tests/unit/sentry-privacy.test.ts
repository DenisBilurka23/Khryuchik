import type { ErrorEvent } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";

import { scrubSentryError } from "@/sentry.privacy";

describe("scrubSentryError", () => {
  it("removes request data and redacts sensitive values while retaining the stack", () => {
    const event: ErrorEvent = {
      type: undefined,
      message: "Failure for ada@example.com",
      transaction: "/checkout/success?session_id=cs_test_123",
      request: {
        url: "https://example.com/checkout?email=ada@example.com",
        data: { address: "123 Main Street" },
        headers: { authorization: "Bearer secret" },
      },
      user: { email: "ada@example.com" },
      extra: { address: "123 Main Street" },
      breadcrumbs: [{ message: "Checkout for ada@example.com" }],
      contexts: { device: { name: "Denis's PC" } },
      server_name: "Denis's PC",
      exception: {
        values: [
          {
            type: "Error",
            value: "Stripe cs_test_123 failed for ada@example.com",
            stacktrace: { frames: [{ filename: "checkout.ts", lineno: 42 }] },
          },
        ],
      },
      tags: { operation: "checkout" },
    };

    expect(scrubSentryError(event)).toEqual({
      type: undefined,
      message: "Failure for [redacted email]",
      transaction: "/checkout/success",
      exception: {
        values: [
          {
            type: "Error",
            value: "Stripe [redacted token] failed for [redacted email]",
            stacktrace: { frames: [{ filename: "checkout.ts", lineno: 42 }] },
          },
        ],
      },
      tags: { operation: "checkout" },
    });
  });

  it("redacts credentials embedded in connection strings", () => {
    const event: ErrorEvent = {
      type: undefined,
      message:
        "connect failed: mongodb+srv://admin:s3cret@cluster0.example.net/shop",
      exception: {
        values: [
          {
            type: "Error",
            value: "fetch https://user:pass@api.example.com/v1 failed",
          },
        ],
      },
    };

    expect(scrubSentryError(event)).toEqual({
      type: undefined,
      message:
        "connect failed: mongodb+srv://[redacted credentials]@cluster0.example.net/shop",
      exception: {
        values: [
          {
            type: "Error",
            value:
              "fetch https://[redacted credentials]@api.example.com/v1 failed",
          },
        ],
      },
    });
  });
});
