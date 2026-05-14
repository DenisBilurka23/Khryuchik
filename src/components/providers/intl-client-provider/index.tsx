"use client";

import { useEffect } from "react";
import { NextIntlClientProvider } from "next-intl";

import type { IntlClientProviderProps } from "./types";

export const IntlClientProvider = ({
  children,
  locale,
  ...props
}: IntlClientProviderProps) => {
  useEffect(() => {
    if (!locale) {
      return;
    }

    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} {...props}>
      {children}
    </NextIntlClientProvider>
  );
};

export type { IntlClientProviderProps } from "./types";