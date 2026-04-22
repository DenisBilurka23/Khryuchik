import type { Locale } from "@/i18n/config";

import { POST } from "@/client-api";

type UpdateAdminLocaleResponse = {
  ok: boolean;
  locale: Locale;
};

export const updateAdminLocalePreferenceClient = async (locale: Locale) =>
  POST<UpdateAdminLocaleResponse>("/api/preferences/admin-locale", { locale });