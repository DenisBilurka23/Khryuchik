import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { AdminLayoutShell } from "@/components/admin-layout-shell";
import { getDictionary } from "@/i18n/dictionaries";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { createAdminMetadata } from "@/server/admin/metadata";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveLocale } from "@/server/i18n/request-locale";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tLayout = await getTranslations({
    locale,
    namespace: "adminPage.layout",
  });

  return createAdminMetadata(
    tLayout("brandSubtitle"),
    tLayout("secureAccessText"),
    locale,
  );
};

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  const [locale, country, session] = await Promise.all([
    resolveLocale("admin"),
    getRequestCountry(),
    requireAdminPageAccess("/admin"),
  ]);
  const messages = await getDictionary(locale, country);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminLayoutShell
        email={session.user.email ?? "admin@khryuchik"}
        profileHref={`/admin/customers/${session.user.id}/edit`}
        locale={locale}
        country={country}
      >
        {children}
      </AdminLayoutShell>
    </NextIntlClientProvider>
  );
};

export default AdminLayout;