import "server-only";

import { BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { defaultLocale } from "@/i18n/config";
import { saveAdminProduct } from "@/server/admin/catalog.service";
import { populateAdminProductIdentifiers } from "@/server/admin/product-identifiers";
import { findAllCategories } from "@/server/catalog/repositories/categories.repository";
import {
  findProductDetailsByProductId,
  upsertProductDetails,
} from "@/server/catalog/repositories/product-details.repository";
import {
  findAllProducts,
  findProductById,
  upsertProduct,
} from "@/server/catalog/repositories/products.repository";
import { getActiveRegions } from "@/server/localization/localization.service";
import { uploadProductGalleryFiles } from "@/server/storage/r2-assets.service";
import type { AdminPrintifyImportItem } from "@/types/admin";
import type { ProductDocument, ProductPrintifyLink } from "@/types/catalog";
import type { RegionDocument } from "@/types/localization";
import type { ProductImage } from "@/types/product-details";
import { createEmptyAdminProductPayload } from "@/utils/admin";

import { getPrintifyConfig } from "../client";
import {
  fetchAllPrintifyProducts,
  fetchPrintifyProduct,
  markPrintifyProductPublished,
} from "../products";
import type { PrintifyProduct } from "../types";
import {
  buildPrintifyProductOptions,
  buildPrintifyVariantLinks,
  getPrintifyBaseRetailCents,
} from "../variant-mapping";

const MAX_IMPORTED_IMAGES = 6;
const SHORT_DESCRIPTION_MAX_LENGTH = 160;

// Printify quotes every product in USD regardless of the billing currency.
const PRINTIFY_CURRENCY = "USD";

export const printifyImportErrorCodes = {
  NotConfigured: "not-configured",
  NotFound: "not-found",
  AlreadyImported: "already-imported",
  NoCategory: "no-category",
  NotLinked: "not-linked",
} as const;

export type PrintifyImportErrorCode =
  (typeof printifyImportErrorCodes)[keyof typeof printifyImportErrorCodes];

export class PrintifyImportError extends Error {
  constructor(readonly code: PrintifyImportErrorCode) {
    super(code);
    this.name = "PrintifyImportError";
  }
}

const requireShopId = () => {
  const config = getPrintifyConfig();

  if (!config?.shopId) {
    throw new PrintifyImportError(printifyImportErrorCodes.NotConfigured);
  }

  return config.shopId;
};

const htmlToPlainText = (html: string) =>
  html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();

const hasBalancedQuotes = (value: string) =>
  (value.match(/"/g) ?? []).length % 2 === 0 &&
  (value.match(/[“«]/g) ?? []).length === (value.match(/[”»]/g) ?? []).length;

const buildSummaryLine = (value: string, maxLength: number) => {
  const singleLine = value.replace(/\s+/g, " ").trim();

  if (!singleLine) {
    return "";
  }

  for (const match of singleLine.matchAll(/[.!?][”"»]?(?=\s|$)/g)) {
    const end = (match.index ?? 0) + match[0].length;

    if (end > maxLength) {
      break;
    }

    const candidate = singleLine.slice(0, end);

    if (hasBalancedQuotes(candidate)) {
      return candidate;
    }
  }

  if (singleLine.length <= maxLength) {
    return singleLine;
  }

  const clipped = singleLine.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
};

const pickImageSources = (product: PrintifyProduct) => {
  const enabledVariantIds = new Set(
    product.variants
      .filter((variant) => variant.is_enabled)
      .map((variant) => variant.id),
  );
  const relevant = product.images.filter((image) =>
    image.variant_ids.some((variantId) => enabledVariantIds.has(variantId)),
  );
  const ordered = [
    ...relevant.filter((image) => image.is_default),
    ...relevant.filter((image) => !image.is_default),
  ];

  return [...new Set(ordered.map((image) => image.src))].slice(
    0,
    MAX_IMPORTED_IMAGES,
  );
};

const downloadGalleryImages = async (
  productId: string,
  sources: string[],
): Promise<ProductImage[]> => {
  const files = await Promise.all(
    sources.map(async (src, index) => {
      const response = await fetch(src, { cache: "no-store" });

      if (!response.ok) {
        return null;
      }

      const blob = await response.blob();
      const extension = new URL(src).pathname.split(".").pop() || "png";

      return new File([blob], `printify-${index + 1}.${extension}`, {
        type: blob.type || "image/png",
      });
    }),
  );

  const downloaded = files.filter((file): file is File => file !== null);

  if (downloaded.length === 0) {
    return [];
  }

  return uploadProductGalleryFiles({
    productId,
    locale: defaultLocale,
    files: downloaded,
  });
};

const buildPrintifyLink = (
  shopId: string,
  product: PrintifyProduct,
): ProductPrintifyLink => ({
  shopId,
  printifyProductId: product.id,
  blueprintId: product.blueprint_id,
  printProviderId: product.print_provider_id,
  variants: buildPrintifyVariantLinks(product),
  syncedAt: new Date().toISOString(),
});

const getPrintifyRegionCodes = (regions: RegionDocument[]) =>
  regions
    .filter((region) => region.currency === PRINTIFY_CURRENCY)
    .map((region) => region.code);

const buildSeedPricing = (
  baseRetailCents: number,
  regionCodes: string[],
): ProductDocument["pricing"] => {
  if (baseRetailCents === 0) {
    return {};
  }

  return Object.fromEntries(
    regionCodes.map((code) => [
      code,
      { price: baseRetailCents / 100, currency: PRINTIFY_CURRENCY },
    ]),
  );
};

const getAvailability = (link: ProductPrintifyLink) =>
  link.variants.some((variant) => variant.isEnabled && variant.isAvailable)
    ? ("made_to_order" as const)
    : ("out_of_stock" as const);

const getStorefrontProductUrl = (slug: string) => {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "");

  return appUrl ? `${appUrl}/products/${slug}` : undefined;
};

const linkToStorefront = async (
  shopId: string,
  printifyProductId: string,
  productId: string,
  slug: string,
) => {
  const handle = getStorefrontProductUrl(slug);

  if (!handle) {
    return;
  }

  try {
    await markPrintifyProductPublished(shopId, printifyProductId, {
      id: productId,
      handle,
    });
  } catch (error) {
    console.error(`Failed to link ${printifyProductId} in Printify`, error);
  }
};

export const getImportablePrintifyProducts = async (): Promise<
  AdminPrintifyImportItem[]
> => {
  const shopId = requireShopId();
  const [printifyProducts, products] = await Promise.all([
    fetchAllPrintifyProducts(shopId),
    findAllProducts(),
  ]);
  const importedByPrintifyId = new Map(
    products
      .filter((product) => product.printify)
      .map((product) => [product.printify!.printifyProductId, product]),
  );

  return printifyProducts.map((printifyProduct) => {
    const imported = importedByPrintifyId.get(printifyProduct.id);

    return {
      printifyProductId: printifyProduct.id,
      title: printifyProduct.title,
      enabledVariantsCount: printifyProduct.variants.filter(
        (variant) => variant.is_enabled,
      ).length,
      previewImageSrc: printifyProduct.images.find((image) => image.is_default)
        ?.src,
      importedProductId: imported?.productId,
      importedSlug: imported?.slug,
    };
  });
};

export const importPrintifyProduct = async (printifyProductId: string) => {
  const shopId = requireShopId();
  const [printifyProduct, products, categories] = await Promise.all([
    fetchPrintifyProduct(shopId, printifyProductId).catch(() => null),
    findAllProducts(),
    findAllCategories(),
  ]);

  if (!printifyProduct) {
    throw new PrintifyImportError(printifyImportErrorCodes.NotFound);
  }

  if (
    products.some(
      (product) => product.printify?.printifyProductId === printifyProductId,
    )
  ) {
    throw new PrintifyImportError(printifyImportErrorCodes.AlreadyImported);
  }

  const category = categories.find(
    (item) => item.key !== BOOKS_CATEGORY_KEY && item.isActive,
  );

  if (!category) {
    throw new PrintifyImportError(printifyImportErrorCodes.NoCategory);
  }

  const description = htmlToPlainText(printifyProduct.description);
  const title = printifyProduct.title.trim();
  const regionCodes = getPrintifyRegionCodes(await getActiveRegions());
  const options = buildPrintifyProductOptions(printifyProduct, regionCodes);
  const link = buildPrintifyLink(shopId, printifyProduct);
  const basePayload = createEmptyAdminProductPayload([defaultLocale]);

  basePayload.product.classification = {
    type: "merch",
    category: category.key,
  };
  basePayload.product.inventory = {
    quantity: null,
    availability: getAvailability(link),
  };
  basePayload.product.status = {
    isActive: false,
    visibleInShop: false,
    visibleOnHome: false,
    notifySubscribers: false,
  };
  basePayload.product.availableRegions = [];
  basePayload.product.pricing = buildSeedPricing(
    getPrintifyBaseRetailCents(printifyProduct),
    regionCodes,
  );
  basePayload.product.printify = link;
  basePayload.product.slug = title;
  basePayload.product.translations[defaultLocale] = {
    ...basePayload.product.translations[defaultLocale],
    title,
    shortDescription: buildSummaryLine(
      description,
      SHORT_DESCRIPTION_MAX_LENGTH,
    ),
    emoji: "🎁",
  };
  basePayload.details.translations[defaultLocale] = {
    ...basePayload.details.translations[defaultLocale],
    subtitle:
      buildSummaryLine(description, SHORT_DESCRIPTION_MAX_LENGTH) || title,
    description,
    sizes: options.size,
    colors: options.color,
  };

  const payload = await populateAdminProductIdentifiers(basePayload);
  const images = await downloadGalleryImages(
    payload.product.productId,
    pickImageSources(printifyProduct),
  );

  payload.details.translations[defaultLocale].images = images;

  const saved = await saveAdminProduct(payload);

  await linkToStorefront(
    shopId,
    printifyProductId,
    saved.product.productId,
    saved.product.slug,
  );

  return { productId: saved.product.productId, slug: saved.product.slug };
};

export const syncPrintifyProduct = async (productId: string) => {
  const shopId = requireShopId();
  const product = await findProductById(productId);

  if (!product?.printify) {
    throw new PrintifyImportError(printifyImportErrorCodes.NotLinked);
  }

  const printifyProduct = await fetchPrintifyProduct(
    shopId,
    product.printify.printifyProductId,
  ).catch(() => null);

  if (!printifyProduct) {
    throw new PrintifyImportError(printifyImportErrorCodes.NotFound);
  }

  const link = buildPrintifyLink(shopId, printifyProduct);
  const options = buildPrintifyProductOptions(
    printifyProduct,
    getPrintifyRegionCodes(await getActiveRegions()),
  );
  const details = await findProductDetailsByProductId(productId);

  const nextProduct: ProductDocument = {
    ...product,
    inventory: { ...product.inventory, availability: getAvailability(link) },
    printify: link,
  };

  await upsertProduct(nextProduct);

  if (details) {
    await upsertProductDetails({
      ...details,
      translations: Object.fromEntries(
        Object.entries(details.translations).map(([locale, translation]) => [
          locale,
          { ...translation, sizes: options.size, colors: options.color },
        ]),
      ) as typeof details.translations,
    });
  }

  return { variantsCount: link.variants.length };
};

export const relinkPrintifyProduct = async (productId: string) => {
  const shopId = requireShopId();
  const product = await findProductById(productId);

  if (!product?.printify) {
    throw new PrintifyImportError(printifyImportErrorCodes.NotLinked);
  }

  await linkToStorefront(
    shopId,
    product.printify.printifyProductId,
    product.productId,
    product.slug,
  );
};
