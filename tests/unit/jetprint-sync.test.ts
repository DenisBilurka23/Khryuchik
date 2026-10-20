import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/catalog/repositories/products.repository", () => ({
  findJetprintLinkedProducts: vi.fn(),
  updateProductJetprintVariantStatus: vi.fn(),
}));
vi.mock("@/server/payments/telegram", () => ({
  notifyAdminJetprintVariantUnavailable: vi.fn(),
}));
vi.mock("@/server/jetprint/client", () => ({ jetprintRequest: vi.fn() }));

import { findJetprintLinkedProducts } from "@/server/catalog/repositories/products.repository";
import { jetprintRequest } from "@/server/jetprint/client";
import { syncJetprintVariantAvailability } from "@/server/jetprint/services/jetprint-catalog.service";
import {
  decodeJetprintVariantCursor,
  encodeJetprintVariantCursor,
} from "@/server/jetprint/variant-sync-cursor";
import { jetprintProduct } from "../fixtures/jetprint";

const product = (id: string, skus: string[]) => {
  const value = jetprintProduct({ productId: id, slug: id });
  value.jetprint!.variants = skus.map((sku) => ({
    sku,
    selections: {},
    isAvailable: true,
  }));
  return value;
};

let elapsed = 0;

beforeEach(() => {
  vi.clearAllMocks();
  elapsed = 0;
  vi.spyOn(Date, "now").mockImplementation(() => elapsed);
  vi.mocked(jetprintRequest).mockImplementation(async () => {
    elapsed += 9_000;
    return { status: 1 };
  });
});
afterEach(() => vi.restoreAllMocks());

describe("JetPrint variant sync pagination", () => {
  it("stops within a product and resumes every remaining SKU without repeats", async () => {
    const products = [
      product(
        "p1",
        Array.from({ length: 20 }, (_, i) => `sku-${i}`),
      ),
      product("p2", ["last"]),
    ];
    vi.mocked(findJetprintLinkedProducts).mockImplementation(
      async (id, inclusive) =>
        products.filter(
          (p) => !id || (inclusive ? p.productId >= id : p.productId > id),
        ),
    );
    let cursor: string | undefined;
    let batches = 0;

    do {
      elapsed = 0;
      const result = await syncJetprintVariantAvailability(cursor);
      expect(elapsed).toBeLessThanOrEqual(40_000);
      if (batches === 0)
        expect(decodeJetprintVariantCursor(result.nextCursor!)).toEqual({
          productId: "p1",
          sku: "sku-3",
        });
      cursor = result.nextCursor ?? undefined;
      batches += 1;
      expect(batches).toBeLessThan(15);
    } while (cursor);

    expect(
      vi.mocked(jetprintRequest).mock.calls.map((call) => call[1]),
    ).toEqual([
      ...Array.from({ length: 20 }, (_, i) => ({ sku: `sku-${i}` })),
      { sku: "last" },
    ]);
  });

  it("keeps the legacy product cursor exclusive", async () => {
    vi.mocked(findJetprintLinkedProducts).mockResolvedValue([]);
    await syncJetprintVariantAvailability("p1");
    expect(findJetprintLinkedProducts).toHaveBeenCalledWith("p1", false);
  });

  it("restarts the product safely when the cursor SKU has been removed", async () => {
    vi.mocked(findJetprintLinkedProducts).mockResolvedValue([
      product("p1", ["new-sku"]),
    ]);
    await syncJetprintVariantAvailability(
      encodeJetprintVariantCursor({ productId: "p1", sku: "removed" }),
    );
    expect(jetprintRequest).toHaveBeenCalledWith(
      "/product/variant/status/query",
      { sku: "new-sku" },
      expect.anything(),
    );
  });
});
