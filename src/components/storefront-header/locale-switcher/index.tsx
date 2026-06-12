"use client";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultLocale } from "@/i18n/config";
import { getLocaleDisplayName, getLocaleShortLabel } from "@/utils";

import { HeaderSelect } from "../header-select";

import type { LocaleSwitcherProps } from "./types";

const stripLocalePrefix = (pathname: string, availableLocales: string[]) => {
  for (const locale of availableLocales) {
    const localePrefix = `/${locale}`;

    if (pathname === localePrefix) {
      return "/";
    }

    if (pathname.startsWith(`${localePrefix}/`)) {
      return pathname.slice(localePrefix.length);
    }
  }

  return pathname;
};

const getPathForLocale = (
  pathname: string,
  targetLocale: LocaleSwitcherProps["locale"],
  availableLocales: string[],
) => {
  const basePath = stripLocalePrefix(pathname, availableLocales);

  if (targetLocale === defaultLocale) {
    return basePath;
  }

  return basePath === "/" ? `/${targetLocale}` : `/${targetLocale}${basePath}`;
};

export const LocaleSwitcher = (props: LocaleSwitcherProps) => {
  const { locale, label, availableLocales, sx } = props;
  const t = useTranslations("storefront");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <HeaderSelect
      value={locale}
      label={label ?? t("localeSwitcherLabel")}
      icon={
        <LanguageOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      }
      disabled={isPending}
      options={availableLocales.map((targetLocale) => ({
        value: targetLocale,
        label: getLocaleDisplayName(targetLocale, locale),
        selectedLabel: getLocaleShortLabel(targetLocale),
      }))}
      onChangeAction={(value) => {
        if (value !== locale && availableLocales.includes(value)) {
          const nextSearchParams = new URLSearchParams(searchParams.toString());
          const callbackUrl = nextSearchParams.get("callbackUrl");

          if (callbackUrl?.startsWith("/")) {
            const callbackUrlObject = new URL(
              callbackUrl,
              window.location.origin,
            );
            const localizedCallbackUrl = getPathForLocale(
              callbackUrlObject.pathname,
              value,
              availableLocales,
            );
            const localizedCallbackSearch = callbackUrlObject.search;

            nextSearchParams.set(
              "callbackUrl",
              `${localizedCallbackUrl}${localizedCallbackSearch}`,
            );
          }

          const nextPathname = getPathForLocale(pathname, value, availableLocales);
          const nextSearch = nextSearchParams.toString();

          startTransition(() => {
            router.push(
              nextSearch ? `${nextPathname}?${nextSearch}` : nextPathname,
              { scroll: false },
            );
          });
        }
      }}
      sx={sx}
    />
  );
};

export type { LocaleSwitcherProps } from "./types";