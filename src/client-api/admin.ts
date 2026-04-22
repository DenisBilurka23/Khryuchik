import type { Locale } from "@/i18n/config";

import { GET } from "@/client-api";

type AdminProductSearchItem = {
  id: string;
  title: string;
  slug: string;
};

export type AdminProductSearchResponse = {
  items?: AdminProductSearchItem[];
};

export const searchAdminProductsClient = async (params: {
  locale: Locale;
  query: string;
  excludeProductId?: string;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams({
    locale: params.locale,
    q: params.query,
    limit: String(params.limit ?? 10),
  });

  if (params.excludeProductId) {
    searchParams.set("excludeProductId", params.excludeProductId);
  }

  return GET<AdminProductSearchResponse>(
    `/api/admin/products/search?${searchParams.toString()}`,
  );
};