import "server-only";

import { cache } from "react";

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
  RegionDocument,
  RegionPricing,
} from "@/types/localization";
import type { CurrencyCode } from "@/utils";
import {
  defaultCountry,
  getCountryDisplayName,
  getLocaleDisplayName,
  isIsoCountryCode,
} from "@/utils";

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

const normalizeRegionCode = (value: string) => value.trim().toUpperCase();

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

export const getActiveLocales = cache(async (): Promise<LocaleDocument[]> => {
  const locales = await findAllLocales();

  return sortByOrder(locales.filter((locale) => locale.isActive));
});

export const getActiveRegions = cache(async (): Promise<RegionDocument[]> => {
  const regions = await findAllRegions();

  return sortByOrder(regions.filter((region) => region.isActive));
});

export const getActiveLocaleCodes = async (): Promise<string[]> =>
  (await getActiveLocales()).map((locale) => locale.code);

export const isActiveLocale = async (value: string): Promise<boolean> =>
  (await getActiveLocales()).some((locale) => locale.code === value);

export const getActiveRegionCodes = async (): Promise<string[]> =>
  (await getActiveRegions()).map((region) => region.code);

export const getDefaultRegionCode = async (): Promise<string> => {
  const regions = await getActiveRegions();

  return regions.find((region) => region.isDefault)?.code ?? defaultCountry;
};

export const getRegionCurrency = async (
  code: string,
): Promise<CurrencyCode> => {
  const region = (await getActiveRegions()).find(
    (candidate) => candidate.code === code,
  );

  return region?.currency ?? "USD";
};

export const getRegionPricing = cache(
  async (code: string): Promise<RegionPricing> => {
    const currency = await getRegionCurrency(code);

    if (currency === BASE_CURRENCY) {
      return { status: "native" };
    }

    const sourceCountry = await getDefaultRegionCode();

    if ((await getRegionCurrency(sourceCountry)) !== BASE_CURRENCY) {
      return { status: "native" };
    }

    const rate = await getUsdRate(currency);

    if (rate === null) {
      return { status: "unavailable", currency };
    }

    return {
      status: "converted",
      conversion: { currency, rate, sourceCountry },
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

const mapRegionToAdminItem = (
  region: RegionDocument,
  locale: Locale,
): AdminRegionListItem => ({
  code: region.code,
  label: getCountryDisplayName(locale, region.code),
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
    regions: regionItems.map((region) => mapRegionToAdminItem(region, locale)),
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

  if (!code || !isIsoCountryCode(code)) {
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

  if (!normalizedCode) {
    throw new LocalizationError(localizationErrorCodes.InvalidCode);
  }

  const regions = await findAllRegions();
  const target = regions.find((region) => region.code === normalizedCode);

  if (target?.isDefault) {
    throw new LocalizationError(localizationErrorCodes.Protected);
  }

  await deleteRegionByCode(normalizedCode);
};
