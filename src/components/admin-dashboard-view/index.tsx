import { Box, Stack } from "@mui/material";

import { AdminCategoriesSection } from "./categories-section";
import { AdminDashboardHero } from "./dashboard-hero";
import { AdminDashboardStats } from "./dashboard-stats";
import { AdminRecentCustomersSection } from "./recent-customers-section";
import { AdminRecentOrdersSection } from "./recent-orders-section";
import { AdminRecentProductsSection } from "./recent-products-section";
import type { AdminDashboardViewProps } from "./types";

export const AdminDashboardView = ({
  summary,
  locale,
  timeZone,
}: AdminDashboardViewProps) => (
  <Stack gap={3}>
    <AdminDashboardHero newOrders={summary.stats.newOrders} locale={locale} />

    <AdminDashboardStats stats={summary.stats} locale={locale} />

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "1.3fr 1fr" },
        gap: 3,
      }}
    >
      <AdminRecentProductsSection
        products={summary.recentProducts}
        locale={locale}
      />
      <AdminRecentCustomersSection
        customers={summary.recentCustomers}
        locale={locale}
        timeZone={timeZone}
      />
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
        gap: 3,
      }}
    >
      <AdminCategoriesSection categories={summary.categories} locale={locale} />
      <AdminRecentOrdersSection
        orders={summary.recentOrders}
        locale={locale}
        timeZone={timeZone}
      />
    </Box>
  </Stack>
);

export type { AdminDashboardViewProps } from "./types";
