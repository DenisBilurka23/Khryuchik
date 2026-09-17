import type { Locale } from "@/i18n/config";

const SUPPORTED_TIME_ZONES = new Set(Intl.supportedValuesOf("timeZone"));

export const isSupportedTimeZone = (
  value: string | undefined | null,
): value is string => Boolean(value && SUPPORTED_TIME_ZONES.has(value));

export const formatDate = (
  value: string | Date,
  locale: Locale,
  timeZone: string,
) => new Date(value).toLocaleDateString(locale, { timeZone });

export const formatDateTime = (
  value: string | Date,
  locale: Locale,
  timeZone: string,
) => new Date(value).toLocaleString(locale, { timeZone });

export const formatTime = (
  value: string | Date,
  locale: Locale,
  timeZone: string,
) =>
  new Date(value).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
