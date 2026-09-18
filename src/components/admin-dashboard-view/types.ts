import type { Locale } from "@/i18n/config";
import type { getAdminSummaryData } from "@/server/admin/catalog.service";

export type AdminDashboardSummary = Awaited<
  ReturnType<typeof getAdminSummaryData>
>;

export type AdminDashboardViewProps = {
  summary: AdminDashboardSummary;
  locale: Locale;
  timeZone: string;
};

export type AdminDashboardHeroProps = {
  newOrders: AdminDashboardSummary["stats"]["newOrders"];
  locale: Locale;
};

export type AdminDashboardStatsProps = {
  stats: AdminDashboardSummary["stats"];
  locale: Locale;
};

export type AdminRecentProductsSectionProps = {
  products: AdminDashboardSummary["recentProducts"];
  locale: Locale;
};

export type AdminRecentCustomersSectionProps = {
  customers: AdminDashboardSummary["recentCustomers"];
  locale: Locale;
  timeZone: string;
};

export type AdminCategoriesSectionProps = {
  categories: AdminDashboardSummary["categories"];
  locale: Locale;
};

export type AdminRecentOrdersSectionProps = {
  orders: AdminDashboardSummary["recentOrders"];
  locale: Locale;
  timeZone: string;
};
