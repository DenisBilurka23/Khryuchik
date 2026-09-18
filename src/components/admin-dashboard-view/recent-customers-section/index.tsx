import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { formatPersonName } from "@/utils";
import { formatAdminDate, getAdminAuthProviderLabel } from "@/utils/admin";

import type { AdminRecentCustomersSectionProps } from "../types";

export const AdminRecentCustomersSection = async ({
  customers,
  locale,
  timeZone,
}: AdminRecentCustomersSectionProps) => {
  const [tDashboard, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
  ]);
  const authProviderLabels = {
    google: tShared("status.authProviders.google"),
    credentials: tShared("status.authProviders.credentials"),
  };

  return (
    <AdminSectionCard
      title={tDashboard("recentCustomers.title")}
      description={tDashboard("recentCustomers.description")}
      action={
        <Button href="/admin/customers" variant="text">
          {tDashboard("recentCustomers.action")}
        </Button>
      }
    >
      <Stack gap={2}>
        {customers.map((customer) => (
          <Paper
            key={customer.id}
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
                  {formatPersonName(customer.firstName, customer.lastName) ||
                    tShared("placeholders.noName")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {customer.email}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.25 }}
                >
                  {tDashboard("recentCustomers.createdLabel")}:{" "}
                  {formatAdminDate(customer.createdAt, locale, timeZone)}
                </Typography>
              </Box>
              <Stack direction="row" gap={1} flexWrap="wrap">
                <AdminStatusChip
                  label={
                    customer.isAdmin
                      ? tShared("status.admin")
                      : tShared("status.user")
                  }
                  tone={customer.isAdmin ? "accent" : "neutral"}
                />
                {customer.authProviders.map((provider) => (
                  <AdminStatusChip
                    key={provider}
                    label={getAdminAuthProviderLabel(
                      provider,
                      authProviderLabels,
                    )}
                    tone={provider === "google" ? "info" : "warning"}
                  />
                ))}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </AdminSectionCard>
  );
};
