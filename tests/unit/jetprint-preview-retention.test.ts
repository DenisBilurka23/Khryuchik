import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/users/services/users.service", () => ({}));
vi.mock("@/server/localization/localization.service", () => ({}));
vi.mock("@/server/catalog/repositories/categories.repository", () => ({}));
vi.mock("@/server/catalog/repositories/products.repository", () => ({
  findProductById: vi.fn(),
  upsertProduct: vi.fn(),
  deleteProductById: vi.fn(),
}));
vi.mock("@/server/catalog/repositories/product-details.repository", () => ({
  findProductDetailsByProductId: vi.fn(),
  upsertProductDetails: vi.fn(),
  deleteProductDetailsByProductId: vi.fn(),
  removeProductReferencesFromDetails: vi.fn(),
}));
vi.mock("@/server/orders/repositories/orders.repository", () => ({
  findOrderJetprintFileUrls: vi.fn(),
}));
vi.mock("@/server/storage/r2-assets.service", () => ({
  deleteProductGalleryObjects: vi.fn(),
  deleteBookAssetObjects: vi.fn(),
}));

import {
  deleteAdminProduct,
  saveAdminProduct,
} from "@/server/admin/catalog.service";
import { findProductById } from "@/server/catalog/repositories/products.repository";
import { findProductDetailsByProductId } from "@/server/catalog/repositories/product-details.repository";
import { findOrderJetprintFileUrls } from "@/server/orders/repositories/orders.repository";
import { deleteProductGalleryObjects } from "@/server/storage/r2-assets.service";
import { jetprintDetails, jetprintProduct } from "../fixtures/jetprint";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(findProductById).mockResolvedValue(jetprintProduct());
  vi.mocked(findProductDetailsByProductId).mockResolvedValue(jetprintDetails());
  vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([]);
});

describe("JetPrint preview retention", () => {
  it("retains the previous preview on gallery replacement and deletes unrelated images", async () => {
    const details = jetprintDetails();
    details.translations.en.images = [
      { id: "new", src: "https://cdn.test/new.png", objectKey: "new-key" },
    ];
    const saved = await saveAdminProduct({
      product: jetprintProduct(),
      details,
    });
    expect(saved.product.jetprint?.previewFiles).toEqual([
      { name: "preview", url: "https://cdn.test/new.png" },
    ]);
    expect(deleteProductGalleryObjects).toHaveBeenCalledWith(["unused-key"]);
  });

  it("protects files referenced by an older order even after unlinking JetPrint", async () => {
    vi.mocked(findProductById).mockResolvedValue(
      jetprintProduct({ jetprint: undefined }),
    );
    vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([
      "https://cdn.test/old.png",
    ]);
    const details = jetprintDetails();
    details.translations.en.images = [];
    await saveAdminProduct({
      product: jetprintProduct({ jetprint: undefined }),
      details,
    });
    expect(findOrderJetprintFileUrls).toHaveBeenCalledWith([
      "https://cdn.test/old.png",
      "https://cdn.test/unused.png",
    ]);
    expect(deleteProductGalleryObjects).toHaveBeenCalledWith(["unused-key"]);
  });

  it("retains a submitted preview when the product is deleted", async () => {
    await deleteAdminProduct("bag");
    expect(deleteProductGalleryObjects).toHaveBeenCalledWith(["unused-key"]);
  });
});
