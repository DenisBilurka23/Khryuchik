import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/server/catalog/repositories/product-details.repository", () => ({
  findAllProductDetails: vi.fn(),
}));
vi.mock("@/server/catalog/repositories/products.repository", () => ({
  findAllProducts: vi.fn(),
}));
vi.mock("@/server/entertainment/repositories/entertainment.repository", () => ({
  findAllEntertainmentItems: vi.fn(),
}));
vi.mock("@/server/orders/repositories/orders.repository", () => ({
  findOrderJetprintFileUrls: vi.fn(),
}));
vi.mock("@/server/storage/r2", () => ({
  isR2Configured: true,
  buildPublicObjectUrl: vi.fn((key: string) => `https://cdn.test/${key}`),
  listObjects: vi.fn(),
  deletePublicObject: vi.fn(),
  deletePrivateObject: vi.fn(),
}));

import { findAllProductDetails } from "@/server/catalog/repositories/product-details.repository";
import { findAllProducts } from "@/server/catalog/repositories/products.repository";
import { findAllEntertainmentItems } from "@/server/entertainment/repositories/entertainment.repository";
import { findOrderJetprintFileUrls } from "@/server/orders/repositories/orders.repository";
import { sweepOrphanedObjects } from "@/server/storage/orphan-cleanup.service";
import {
  buildPublicObjectUrl,
  deletePublicObject,
  listObjects,
} from "@/server/storage/r2";
import { jetprintProduct } from "../fixtures/jetprint";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(buildPublicObjectUrl).mockImplementation(
    (key) => `https://cdn.test/${key}`,
  );
  vi.mocked(findAllEntertainmentItems).mockResolvedValue([]);
  vi.mocked(findAllProductDetails).mockResolvedValue([]);
  vi.mocked(findAllProducts).mockResolvedValue([jetprintProduct()]);
  vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([]);
});

describe("JetPrint files during the R2 orphan sweep", () => {
  it("retains current files, editable design assets, and snapshots from deleted products", async () => {
    const product = jetprintProduct();
    product.jetprint!.printFiles = [
      {
        name: "print",
        url: "https://cdn.test/products/bag/print.png",
        objectKey: "products/bag/print.png",
      },
    ];
    product.jetprint!.previewFiles = [
      { name: "preview", url: "https://cdn.test/products/bag/preview.png" },
    ];
    product.jetprint!.printDesign = {
      template: {
        width: 100,
        height: 100,
        dpi: 150,
        bleedBox: { x: 0, y: 0, width: 100, height: 100 },
        safeBox: { x: 10, y: 10, width: 80, height: 80 },
        guidesUrl: "https://cdn.test/products/bag/guides.png",
        cutMaskUrl: "https://cdn.test/products/bag/mask.png",
      },
      art: {
        width: 100,
        height: 100,
        url: "https://cdn.test/products/bag/art.png",
      },
      layout: { x: 0, y: 0, scale: 1 },
    };
    vi.mocked(findAllProducts).mockResolvedValue([product]);
    vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([
      "https://cdn.test/products/deleted/preview.png",
      "https://cdn.test/products/deleted/print.png",
    ]);
    vi.mocked(listObjects).mockImplementation(async ({ bucket, prefix }) =>
      bucket === "public" && prefix === "products/"
        ? [
            "products/bag/print.png",
            "products/bag/preview.png",
            "products/bag/guides.png",
            "products/bag/mask.png",
            "products/bag/art.png",
            "products/deleted/preview.png",
            "products/deleted/print.png",
            "products/abandoned.png",
          ].map((objectKey) => ({
            objectKey,
            lastModified: new Date(Date.now() - 48 * 60 * 60 * 1000),
            sizeBytes: 100,
          }))
        : [],
    );

    const result = await sweepOrphanedObjects({ dryRun: false });
    expect(result.deleted).toBe(1);
    expect(deletePublicObject).toHaveBeenCalledExactlyOnceWith(
      "products/abandoned.png",
    );
  });

  it("does not delete anything if order file references cannot be loaded", async () => {
    vi.mocked(findOrderJetprintFileUrls).mockRejectedValue(
      new Error("database unavailable"),
    );
    await expect(sweepOrphanedObjects({ dryRun: false })).rejects.toThrow(
      "database unavailable",
    );
    expect(deletePublicObject).not.toHaveBeenCalled();
    vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([]);
  });

  it("fails closed if order URLs cannot be mapped to the public R2 bucket", async () => {
    vi.mocked(findOrderJetprintFileUrls).mockResolvedValue([
      "https://cdn.test/products/old.png",
    ]);
    vi.mocked(buildPublicObjectUrl).mockReturnValue(undefined);
    await expect(sweepOrphanedObjects({ dryRun: false })).rejects.toThrow(
      "public R2 URL",
    );
    expect(deletePublicObject).not.toHaveBeenCalled();
  });
});
