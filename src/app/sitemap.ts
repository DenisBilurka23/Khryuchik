import type { MetadataRoute } from "next";

import {
  SITEMAP_ENTERTAINMENT_CHANGE_FREQUENCY,
  SITEMAP_ENTERTAINMENT_PRIORITY,
  SITEMAP_PRODUCT_CHANGE_FREQUENCY,
  SITEMAP_PRODUCT_PRIORITY,
  SITEMAP_STATIC_ROUTES,
} from "@/constants/seo";
import { getSitemapProductSlugs } from "@/server/catalog/services/catalog.service";
import { getAppOrigin } from "@/server/email/transport";
import { getSitemapEntertainmentEntries } from "@/server/entertainment/services/entertainment.service";
import { getSitemapRegionCode } from "@/server/localization/localization.service";
import { createSitemapEntry } from "@/utils";

export const revalidate = 86400;

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const origin = getAppOrigin();
  const country = await getSitemapRegionCode();

  const [productSlugs, entertainmentEntries] = await Promise.all([
    getSitemapProductSlugs(country),
    getSitemapEntertainmentEntries(),
  ]);

  return [
    ...SITEMAP_STATIC_ROUTES.map((route) =>
      createSitemapEntry({ origin, ...route }),
    ),
    ...productSlugs.map((slug) =>
      createSitemapEntry({
        origin,
        path: `/products/${slug}`,
        changeFrequency: SITEMAP_PRODUCT_CHANGE_FREQUENCY,
        priority: SITEMAP_PRODUCT_PRIORITY,
      }),
    ),
    ...entertainmentEntries.map((entry) =>
      createSitemapEntry({
        origin,
        path: `/entertainment/${entry.slug}`,
        changeFrequency: SITEMAP_ENTERTAINMENT_CHANGE_FREQUENCY,
        priority: SITEMAP_ENTERTAINMENT_PRIORITY,
        lastModified: entry.updatedAt,
      }),
    ),
  ];
};

export default sitemap;
