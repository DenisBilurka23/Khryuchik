import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { getAdminCategoryLabel } from "@/utils/admin";

import type { AdminCategoriesSectionProps } from "../types";

export const AdminCategoriesSection = async ({
  categories,
  locale,
}: AdminCategoriesSectionProps) => {
  const [tDashboard, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
  ]);

  return (
    <AdminSectionCard
      title={tDashboard("categories.title")}
      description={tDashboard("categories.description")}
      action={
        <Button href="/admin/categories" variant="text">
          {tDashboard("categories.action")}
        </Button>
      }
    >
      <Stack gap={2}>
        {categories.map((category) => (
          <Paper
            key={category.key}
            elevation={0}
            sx={{
              p: 2.25,
              borderRadius: "22px",
              border: "1px solid #F0DFC8",
              bgcolor: "#fff",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              gap={2}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  {getAdminCategoryLabel(category.translations, locale) ||
                    category.key}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  / {category.key} • {category.itemsCount}{" "}
                  {tDashboard("categories.itemsLabel")}
                </Typography>
              </Box>
              <Stack direction="row" gap={1}>
                <AdminStatusChip
                  label={
                    category.isActive
                      ? tShared("status.active")
                      : tShared("status.hidden")
                  }
                  tone={category.isActive ? "success" : "neutral"}
                />
                <AdminStatusChip
                  label={
                    category.visibleInHomeTabs
                      ? tShared("status.homeTabs")
                      : tShared("status.shopOnly")
                  }
                  tone={category.visibleInHomeTabs ? "info" : "neutral"}
                />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </AdminSectionCard>
  );
};
