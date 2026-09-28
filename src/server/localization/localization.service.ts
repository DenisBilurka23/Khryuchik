import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";

import {
  LOCALIZATION_CACHE_TAG,
  LOCALIZATION_CACHE_TTL_SECONDS,
} from "@/constants/localization";

import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type {
  AdminLocaleListItem,
  AdminLocaleUpsertInput,
  AdminLocalizationData,
  AdminRegionListItem,
  AdminRegionUpsertInput,
} from "@/types/admin";
import type {
  LocaleDocument,
  RegionCode,
  RegionDocument,
  RegionPricing,
} from "@/types/localization";
import type { CurrencyCode } from "@/utils";
import { DEFAULT_REGION, getLocaleDisplayName, isRegionCode } from "@/utils";

import { BASE_CURRENCY, getUsdRate } from "./exchange-rates.service";
import {
  clearDefaultLocaleExcept,
  deleteLocaleByCode,
  findAllLocales,
  upsertLocale,
} from "./locales.repository";
import {
  clearDefaultRegionExcept,
  deleteRegionByCode,
  findAllRegions,
  upsertRegion,
} from "./regions.repository";

export const localizationErrorCodes = {
  InvalidCode: "invalid-code",
  InvalidCurrency: "invalid-currency",
  Protected: "protected",
} as const;

export type LocalizationErrorCode =
  (typeof localizationErrorCodes)[keyof typeof localizationErrorCodes];

export class LocalizationError extends Error {
  code: LocalizationErrorCode;

  constructor(code: LocalizationErrorCode) {
    super(code);
    this.code = code;
    this.name = "LocalizationError";
  }
}

const normalizeLocaleCode = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z-]/g, "");

const normalizeRegionCode = (value: string) => value.trim();

const normalizeCurrencyCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z]/g, "");

const supportedCurrencyCodes = new Set(Intl.supportedValuesOf("currency"));

const sortByOrder = <T extends { code: string; sortOrder: number }>(
  items: T[],
): T[] =>
  [...items].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.code.localeCompare(b.code),
  );

const cacheOptions = {
  tags: [LOCALIZATION_CACHE_TAG],
  revalidate: LOCALIZATION_CACHE_TTL_SECONDS,
};

const loadActiveLocales = unstable_cache(
  async (): Promise<LocaleDocument[]> => {
    const locales = await findAllLocales();

    return sortByOrder(locales.filter((locale) => locale.isActive));
  },
  ["active-locales"],
  cacheOptions,
);

const loadActiveRegions = unstable_cache(
  async (): Promise<RegionDocument[]> => {
    const regions = await findAllRegions();

    return sortByOrder(regions.filter((region) => region.isActive));
  },
  ["active-regions"],
  cacheOptions,
);

export const getActiveLocales = cache(loadActiveLocales);

export const getActiveRegions = cache(loadActiveRegions);

export const getActiveLocaleCodes = async (): Promise<string[]> =>
  (await getActiveLocales()).map((locale) => locale.code);

export const isActiveLocale = async (value: string): Promise<boolean> =>
  (await getActiveLocales()).some((locale) => locale.code === value);

export const getActiveRegionCodes = async (): Promise<RegionCode[]> =>
  (await getActiveRegions()).map((region) => region.code);

export const getDefaultRegionCode = async (): Promise<RegionCode> => {
  const regions = await getActiveRegions();

  return regions.find((region) => region.isDefault)?.code ?? DEFAULT_REGION;
};

export const getSitemapRegionCode = async (): Promise<RegionCode> => {
  const [activeCodes, defaultRegion] = await Promise.all([
    getActiveRegionCodes(),
    getDefaultRegionCode(),
  ]);

  return activeCodes.includes(DEFAULT_REGION) ? DEFAULT_REGION : defaultRegion;
};

export const getRegionCurrency = async (
  code: RegionCode,
): Promise<CurrencyCode> => {
  const region = (await getActiveRegions()).find(
    (candidate) => candidate.code === code,
  );

  return region?.currency ?? "USD";
};

export const getRegionPricing = cache(
  async (code: RegionCode): Promise<RegionPricing> => {
    const currency = await getRegionCurrency(code);

    if (currency === BASE_CURRENCY) {
      return { status: "native", currency };
    }

    const rate = await getUsdRate(currency);

    if (rate === null) {
      return { status: "unavailable", currency };
    }

    return {
      status: "converted",
      currency,
      conversion: { currency, rate },
    };
  },
);

const mapLocaleToAdminItem = (
  locale: LocaleDocument,
  displayLocale: Locale,
): AdminLocaleListItem => ({
  code: locale.code,
  label: getLocaleDisplayName(locale.code, displayLocale),
  isActive: locale.isActive,
  isDefault: locale.isDefault,
  sortOrder: locale.sortOrder,
});

const mapRegionToAdminItem = (region: RegionDocument): AdminRegionListItem => ({
  code: region.code,
  currency: region.currency,
  isActive: region.isActive,
  isDefault: region.isDefault,
  sortOrder: region.sortOrder,
});

export const getAdminLocalizationData = async (
  locale: Locale = defaultLocale,
): Promise<AdminLocalizationData> => {
  const [locales, regions] = await Promise.all([
    findAllLocales(),
    findAllRegions(),
  ]);

  const localeItems = sortByOrder(locales);
  const regionItems = sortByOrder(regions);

  return {
    locales: localeItems.map((item) => mapLocaleToAdminItem(item, locale)),
    regions: regionItems.map(mapRegionToAdminItem),
  };
};

export const saveAdminLocale = async (input: AdminLocaleUpsertInput) => {
  const code = normalizeLocaleCode(input.code);

  if (!code) {
    throw new LocalizationError(localizationErrorCodes.InvalidCode);
  }

  const locale: LocaleDocument = {
    code,
    isActive: input.isDefault ? true : input.isActive,
    isDefault: input.isDefault,
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 100,
  };

  const saved = await upsertLocale(locale);

  if (locale.isDefault) {
    await clearDefaultLocaleExcept(code);
  }

  return saved;
};

export const deleteAdminLocale = async (code: string) => {
  const normalizedCode = normalizeLocaleCode(code);

  if (!normalizedCode) {
    throw new LocalizationError(localizationErrorCodes.InvalidCode);
  }

  const locales = await findAllLocales();
  const target = locales.find((locale) => locale.code === normalizedCode);

  if (target?.isDefault) {
    throw new LocalizationError(localizationErrorCodes.Protected);
  }

  await deleteLocaleByCode(normalizedCode);
};

export const saveAdminRegion = async (input: AdminRegionUpsertInput) => {
  const code = normalizeRegionCode(input.code);
  const currency = normalizeCurrencyCode(input.currency);

  if (!isRegionCode(code)) {
    throw new LocalizationError(localizationErrorCodes.InvalidCode);
  }

  if (!currency || !supportedCurrencyCodes.has(currency)) {
    throw new LocalizationError(localizationErrorCodes.InvalidCurrency);
  }

  const region: RegionDocument = {
    code,
    currency,
    isActive: input.isDefault ? true : input.isActive,
    isDefault: input.isDefault,
    sortOrder: Number.isFinite(input.sortOrder) ? input.sortOrder : 100,
  };

  const saved = await upsertRegion(region);

  if (region.isDefault) {
    await clearDefaultRegionExcept(code);
  }

  return saved;
};

export const deleteAdminRegion = async (code: string) => {
  const normalizedCode = normalizeRegionCode(code);

  if (!isRegionCode(normalizedCode)) {
    throw new LocalizationError(localizationErrorCodes.InvalidCode);
  }

  const regions = await findAllRegions();
  const target = regions.find((region) => region.code === normalizedCode);

  if (target?.isDefault) {
    throw new LocalizationError(localizationErrorCodes.Protected);
  }

  await deleteRegionByCode(normalizedCode);
};
