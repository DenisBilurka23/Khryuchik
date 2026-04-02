import { redirect } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { getStorefrontLayoutContext } from "@/server/storefront/layout-context";

import { getServerAuthSession } from "./config";

export const getGuestAuthPageContext = async (locale: Locale) => {
  const session = await getServerAuthSession();

  if (session) {
    redirect(locale === "en" ? "/account" : `/${locale}/account`);
  }

  const { country, dictionary } = await getStorefrontLayoutContext(locale);

  return {
    country,
    dictionary,
  };
};