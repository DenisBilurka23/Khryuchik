import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getMessages, getTranslations } from "next-intl/server";

import { AdminLayoutShell } from "@/components/admin-layout-shell";
import { IntlClientProvider } from "@/components/providers/intl-client-provider";
import { requireAdminPageAccess } from "@/server/admin/auth";
import { createAdminMetadata } from "@/server/admin/metadata";
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
  const [locale, session] = await Promise.all([
    resolveLocale("admin"),
    requireAdminPageAccess("/admin"),
  ]);
  const messages = await getMessages({ locale });

  return (
    <IntlClientProvider locale={locale} messages={messages}>
      <AdminLayoutShell
        email={session.user.email ?? "admin@khryuchik"}
        profileHref={`/admin/customers/${session.user.id}/edit`}
        locale={locale}
      >
        {children}
      </AdminLayoutShell>
    </IntlClientProvider>
  );
};

export default AdminLayout;