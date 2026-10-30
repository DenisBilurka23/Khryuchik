import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async () => (key: string) => key),
}));
vi.mock("@/server/catalog/repositories/products.repository", () => ({
  findActiveProductsByIds: vi.fn(),
  findActiveProductBySlug: vi.fn(),
}));
vi.mock("@/server/catalog/repositories/product-details.repository", () => ({
  findProductDetailsByProductId: vi.fn(),
}));
vi.mock("@/server/localization/localization.service", () => ({
  getRegionPricing: vi.fn(),
}));
vi.mock("@/server/catalog/services/printed-stock.service", () => ({
  getPrintedStockAvailability: vi.fn(),
}));
vi.mock("@/server/reviews/services/reviews.service", () => ({
  getApprovedReviewsForProduct: vi.fn(),
}));

import {
  findActiveProductBySlug,
  findActiveProductsByIds,
} from "@/server/catalog/repositories/products.repository";
import { findProductDetailsByProductId } from "@/server/catalog/repositories/product-details.repository";
import {
  getProductDetails,
  resolveCartItems,
} from "@/server/catalog/services/catalog.service";
import { getPrintedStockAvailability } from "@/server/catalog/services/printed-stock.service";
import { getRegionPricing } from "@/server/localization/localization.service";
import { getApprovedReviewsForProduct } from "@/server/reviews/services/reviews.service";
import { localizeProductSummary } from "@/utils/product";
import { getVariantValueState } from "@/utils/variant-matrix";
import { jetprintDetails, jetprintProduct } from "../fixtures/jetprint";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getRegionPricing).mockResolvedValue({
    status: "native",
    currency: "USD",
  });
  vi.mocked(getPrintedStockAvailability).mockResolvedValue(new Map());
  vi.mocked(getApprovedReviewsForProduct).mockResolvedValue([]);
});

describe("JetPrint storefront availability", () => {
  it("shows an unavailable product as out of stock and recovers when its SKU returns", () => {
    const product = jetprintProduct();
    product.jetprint!.variants[0].isAvailable = false;
    expect(localizeProductSummary(product, "en", "europe")?.availability).toBe(
      "out_of_stock",
    );
    product.jetprint!.variants[0].isAvailable = true;
    expect(localizeProductSummary(product, "en", "europe")?.availability).toBe(
      "made_to_order",
    );
  });

  it("keeps a manual out-of-stock override even when JetPrint has stock", () => {
    expect(
      localizeProductSummary(
        jetprintProduct({
          inventory: { availability: "out_of_stock", quantity: null },
        }),
        "en",
        "europe",
      )?.availability,
    ).toBe("out_of_stock");
  });

  it("disables the unavailable size in the product page matrix", async () => {
    const product = jetprintProduct();
    product.jetprint!.variants = [
      { sku: "small", selections: { size: "s" }, isAvailable: true },
      { sku: "large", selections: { size: "l" }, isAvailable: false },
    ];
    const details = jetprintDetails();
    details.translations.en.sizes = [
      { label: "Small", value: "s" },
      { label: "Large", value: "l" },
    ];
    vi.mocked(findActiveProductBySlug).mockResolvedValue(product);
    vi.mocked(findProductDetailsByProductId).mockResolvedValue(details);
    const result = await getProductDetails("en", "europe", "bag");
    expect(result.status).toBe("ok");
    if (result.status !== "ok") throw new Error("Expected the product page");
    expect(result.product.variantMatrix).toEqual([
      { size: "s" },
      { size: "l", isSoldOut: true },
    ]);
    expect(
      getVariantValueState(
        result.product.variantMatrix,
        { sizes: result.product.sizes },
        "size",
        "l",
        { size: "s", color: "" },
      ),
    ).toEqual({ availability: "sold-out", isSelectable: false });
  });

  it("marks the unavailable selection already in a cart as out of stock", async () => {
    const product = jetprintProduct();
    product.jetprint!.variants = [
      { sku: "small", selections: { size: "s" }, isAvailable: true },
      { sku: "large", selections: { size: "l" }, isAvailable: false },
    ];
    vi.mocked(findActiveProductsByIds).mockResolvedValue([product]);
    vi.mocked(findProductDetailsByProductId).mockResolvedValue(
      jetprintDetails(),
    );
    const cart = await resolveCartItems("en", "europe", [
      { id: "small", productId: "bag", quantity: 1, selections: { size: "s" } },
      { id: "large", productId: "bag", quantity: 1, selections: { size: "l" } },
    ]);
    expect(cart.items.map((item) => item.availability)).toEqual([
      "made_to_order",
      "out_of_stock",
    ]);
  });
});
