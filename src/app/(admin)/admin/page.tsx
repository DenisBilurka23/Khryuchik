import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { AdminDashboardView } from "@/components/admin-dashboard-view";
import { AdminPageLoading } from "@/components/admin-page-shared";
import { getAdminSummaryData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveAdminTimeZone } from "@/server/i18n/admin-time-zone";
import { resolveLocale } from "@/server/i18n/request-locale";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tDashboard = await getTranslations({
    locale,
    namespace: "adminPage.dashboard",
  });

  return createAdminMetadata(
    tDashboard("title"),
    tDashboard("description"),
    locale,
  );
};

const AdminDashboardContent = async () => {
  const [locale, timeZone] = await Promise.all([
    resolveLocale("admin"),
    resolveAdminTimeZone(),
  ]);
  const summary = await getAdminSummaryData(locale);

  return (
    <AdminDashboardView summary={summary} locale={locale} timeZone={timeZone} />
  );
};

const AdminDashboardPage = () => (
  <Suspense fallback={<AdminPageLoading variant="dashboard" />}>
    <AdminDashboardContent />
  </Suspense>
);

export default AdminDashboardPage;
