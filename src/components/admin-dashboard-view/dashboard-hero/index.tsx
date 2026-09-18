import { Button, Paper, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import { AdminPageHero } from "@/components/admin-page-shared";

import type { AdminDashboardHeroProps } from "../types";

export const AdminDashboardHero = async ({
  newOrders,
  locale,
}: AdminDashboardHeroProps) => {
  const [tDashboard, tLayout] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.layout" }),
  ]);

  return (
    <AdminPageHero
      eyebrow={tDashboard("eyebrow")}
      title={tDashboard("title")}
      description={tDashboard("description")}
      actions={
        <Button href="/admin/products/new" variant="contained">
          {tLayout("addProduct")}
        </Button>
      }
      aside={
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "24px",
            bgcolor: "#fff",
            border: "1px solid #F0DFC8",
            minWidth: { xl: 260 },
          }}
        >
          <Typography color="text.secondary" variant="body2">
            {tDashboard("pendingOrders.title")}
          </Typography>
          <Typography sx={{ mt: 0.75, fontWeight: 800, fontSize: 28 }}>
            {newOrders}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {newOrders > 0
              ? tDashboard("pendingOrders.note")
              : tDashboard("pendingOrders.emptyNote")}
          </Typography>
        </Paper>
      }
    />
  );
};
