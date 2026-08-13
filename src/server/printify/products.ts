import { PrintifyApiError, printifyRequest } from "./client";
import type {
  PrintifyExternalLink,
  PrintifyPaginatedResponse,
  PrintifyProduct,
  PrintifyPublishScope,
  PrintifyShop,
} from "./types";

const PRODUCTS_PAGE_SIZE = 50;

const INTEGRATED_SALES_CHANNELS = new Set([
  "big_cartel",
  "bigcommerce",
  "ebay",
  "etsy",
  "prestashop",
  "shopify",
  "squarespace",
  "tiktok",
  "walmart",
  "wix",
  "woocommerce",
]);

export const isIntegratedSalesChannel = (salesChannel: string) =>
  INTEGRATED_SALES_CHANNELS.has(salesChannel.trim().toLowerCase());

const FULL_PUBLISH_SCOPE: PrintifyPublishScope = {
  title: true,
  description: true,
  images: true,
  variants: true,
  tags: true,
  keyFeatures: true,
  shipping_template: true,
};

export const fetchPrintifyShops = (options?: { token?: string }) =>
  printifyRequest<PrintifyShop[]>("/shops.json", options);

export const fetchPrintifyProductsPage = (
  shopId: string,
  page: number,
  options?: { token?: string },
) =>
  printifyRequest<PrintifyPaginatedResponse<PrintifyProduct>>(
    `/shops/${shopId}/products.json?page=${page}&limit=${PRODUCTS_PAGE_SIZE}`,
    options,
  );

export const fetchAllPrintifyProducts = async (
  shopId: string,
  options?: { token?: string },
): Promise<PrintifyProduct[]> => {
  const products: PrintifyProduct[] = [];
  let page = 1;
  let lastPage = 1;

  do {
    const response = await fetchPrintifyProductsPage(shopId, page, options);

    products.push(...response.data);
    lastPage = response.last_page;
    page += 1;
  } while (page <= lastPage);

  return products;
};

export const fetchPrintifyProduct = (
  shopId: string,
  printifyProductId: string,
  options?: { token?: string },
) =>
  printifyRequest<PrintifyProduct>(
    `/shops/${shopId}/products/${printifyProductId}.json`,
    options,
  );

export const startPrintifyPublish = (
  shopId: string,
  printifyProductId: string,
  options?: { token?: string },
) =>
  printifyRequest<Record<string, never>>(
    `/shops/${shopId}/products/${printifyProductId}/publish.json`,
    { ...options, method: "POST", body: FULL_PUBLISH_SCOPE },
  );

export const setPrintifyPublishSucceeded = (
  shopId: string,
  printifyProductId: string,
  external: Required<PrintifyExternalLink>,
  options?: { token?: string },
) =>
  printifyRequest<unknown>(
    `/shops/${shopId}/products/${printifyProductId}/publishing_succeeded.json`,
    { ...options, method: "POST", body: { external } },
  );

export const markPrintifyProductPublished = async (
  shopId: string,
  printifyProductId: string,
  external: Required<PrintifyExternalLink>,
  options?: { token?: string },
): Promise<{ requiredPublishRestart: boolean }> => {
  try {
    await setPrintifyPublishSucceeded(
      shopId,
      printifyProductId,
      external,
      options,
    );

    return { requiredPublishRestart: false };
  } catch (error) {
    const isRejected =
      error instanceof PrintifyApiError &&
      error.status >= 400 &&
      error.status < 500;

    if (!isRejected) {
      throw error;
    }

    await startPrintifyPublish(shopId, printifyProductId, options);
    await setPrintifyPublishSucceeded(
      shopId,
      printifyProductId,
      external,
      options,
    );

    return { requiredPublishRestart: true };
  }
};
