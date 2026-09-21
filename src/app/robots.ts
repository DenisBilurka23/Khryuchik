import type { MetadataRoute } from "next";

import {
  ROBOTS_DISALLOWED_PATHS,
  ROBOTS_DISALLOWED_STOREFRONT_PATHS,
} from "@/constants/seo";
import { getAppOrigin } from "@/server/email/transport";
import { createRobotsDisallowList, normalizeOrigin } from "@/utils";

const robots = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: "*",
    allow: "/",
    disallow: createRobotsDisallowList(
      ROBOTS_DISALLOWED_STOREFRONT_PATHS,
      ROBOTS_DISALLOWED_PATHS,
    ),
  },
  sitemap: `${normalizeOrigin(getAppOrigin())}/sitemap.xml`,
});

export default robots;
