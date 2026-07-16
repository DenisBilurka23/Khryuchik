import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";
import { getAdminProductOptions } from "@/server/admin/catalog.service";
import type {
  AdminHeroContentData,
  AdminHeroContentUpsertInput,
  AdminProductOption,
} from "@/types/admin";
import type { HeroContentDocument } from "@/types/home-content";

import { findHeroContent, upsertHeroContent } from "./home-content.repository";

export const getHeroContent = cache(
  async (): Promise<HeroContentDocument | null> => findHeroContent(),
);

export const getAdminHeroContent = async (
  locale: Locale,
): Promise<AdminHeroContentData> => {
  const doc = await findHeroContent();
  const featuredProductId = doc?.featuredProductId;
  const newBookProductId = doc?.newBookProductId;

  const linkedIds = [
    ...new Set(
      [featuredProductId, newBookProductId].filter((id): id is string =>
        Boolean(id),
      ),
    ),
  ];

  const [linkedOptions, initialProductOptions] = await Promise.all([
    linkedIds.length > 0
      ? getAdminProductOptions({ locale, productIds: linkedIds })
      : Promise.resolve<AdminProductOption[]>([]),
    getAdminProductOptions({ locale, limit: 10 }),
  ]);

  const optionById = new Map(
    linkedOptions.map((option) => [option.id, option]),
  );

  return {
    featuredProductId,
    newBookProductId,
    featuredProductOption: featuredProductId
      ? optionById.get(featuredProductId)
      : undefined,
    newBookProductOption: newBookProductId
      ? optionById.get(newBookProductId)
      : undefined,
    initialProductOptions,
  };
};

export const saveAdminHeroContent = async (
  input: AdminHeroContentUpsertInput,
) => {
  const next: HeroContentDocument = {
    key: "hero",
    featuredProductId: input.featuredProductId || undefined,
    newBookProductId: input.newBookProductId || undefined,
  };

  return upsertHeroContent(next);
};
