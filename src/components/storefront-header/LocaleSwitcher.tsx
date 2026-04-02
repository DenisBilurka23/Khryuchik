"use client";

import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { defaultLocale, locales } from "@/i18n/config";

import { localeLabels } from "@/utils";
import { HeaderSelect } from "./HeaderSelect";
import type { LocaleSwitcherProps } from "./types";

const stripLocalePrefix = (pathname: string) => {
  for (const locale of locales) {
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
) => {
  const basePath = stripLocalePrefix(pathname);

  if (targetLocale === defaultLocale) {
    return basePath;
  }

  return basePath === "/" ? `/${targetLocale}` : `/${targetLocale}${basePath}`;
};

export const LocaleSwitcher = (props: LocaleSwitcherProps) => {
  const { locale, label, sx } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <HeaderSelect
      value={locale}
      label={label}
      icon={
        <LanguageOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
      }
      disabled={isPending}
      options={(
        Object.keys(localeLabels) as Array<keyof typeof localeLabels>
      ).map((targetLocale) => ({
        value: targetLocale,
        label: localeLabels[targetLocale],
      }))}
      onChange={(value) => {
        if (value !== locale && (value === "ru" || value === "en")) {
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
            );
            const localizedCallbackSearch = callbackUrlObject.search;

            nextSearchParams.set(
              "callbackUrl",
              `${localizedCallbackUrl}${localizedCallbackSearch}`,
            );
          }

          const nextPathname = getPathForLocale(pathname, value);
          const nextSearch = nextSearchParams.toString();

          startTransition(() => {
            router.push(
              nextSearch ? `${nextPathname}?${nextSearch}` : nextPathname,
            );
          });
        }
      }}
      sx={sx}
    />
  );
};
