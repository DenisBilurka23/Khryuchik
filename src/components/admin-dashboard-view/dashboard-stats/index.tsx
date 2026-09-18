import { Box } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { AdminStatCard } from "@/components/admin-page-shared";

import type { AdminDashboardStatsProps } from "../types";

export const AdminDashboardStats = async ({
  stats,
  locale,
}: AdminDashboardStatsProps) => {
  const tDashboard = await getTranslations({
    locale,
    namespace: "adminPage.dashboard",
  });

  const cards = [
    {
      title: tDashboard("stats.productsTitle"),
      value: stats.totalProducts,
      note: `${stats.activeProducts} ${tDashboard("stats.productsNote")}`,
    },
    {
      title: tDashboard("stats.accountsTitle"),
      value: stats.totalUsers,
      note: `${stats.adminUsers} ${tDashboard("stats.accountsNote")}`,
    },
    {
      title: tDashboard("stats.categoriesTitle"),
      value: stats.categoriesCount,
      note: `${stats.booksCount} ${tDashboard("stats.categoriesNote")}`,
    },
    {
      title: tDashboard("stats.ordersTitle"),
      value: stats.totalOrders,
      note: `${stats.paidOrders} ${tDashboard("stats.ordersNote")}`,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          xl: "repeat(4, minmax(0, 1fr))",
        },
        gap: 3,
      }}
    >
      {cards.map((card) => (
        <AdminStatCard
          key={card.title}
          title={card.title}
          value={card.value}
          note={card.note}
        />
      ))}
    </Box>
  );
};
