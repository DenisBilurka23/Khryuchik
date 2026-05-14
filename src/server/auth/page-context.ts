import { redirect } from "next/navigation";

import type { Locale } from "@/i18n/config";

import { getServerAuthSession } from "./config";

export const getGuestAuthPageContext = async (locale: Locale) => {
  const session = await getServerAuthSession();

  if (session) {
    redirect(locale === "en" ? "/account" : `/${locale}/account`);
  }
};