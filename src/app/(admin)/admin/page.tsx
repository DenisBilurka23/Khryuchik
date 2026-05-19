import type { Metadata } from "next";
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";

import { getAdminSummaryData } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import {
  formatAdminDate,
  getAdminAuthProviderLabel,
  getAdminCategoryLabel,
} from "@/utils/admin";

import {
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
  AdminStatCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";

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

const AdminDashboardPage = async () => {
  const locale = await resolveLocale("admin");
  const [summary, tDashboard, tShared, tLayout] = await Promise.all([
    getAdminSummaryData(),
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
    getTranslations({ locale, namespace: "adminPage.layout" }),
  ]);
  const sharedStatus = {
    ordersWired: tShared("status.ordersWired"),
    ordersPending: tShared("status.ordersPending"),
    active: tShared("status.active"),
    hidden: tShared("status.hidden"),
    admin: tShared("status.admin"),
    user: tShared("status.user"),
    homeTabs: tShared("status.homeTabs"),
    shopOnly: tShared("status.shopOnly"),
    authProviders: {
      google: tShared("status.authProviders.google"),
      credentials: tShared("status.authProviders.credentials"),
    },
  };

  const stats = [
    {
      title: tDashboard("stats.productsTitle"),
      value: summary.stats.totalProducts,
      note: `${summary.stats.activeProducts} ${tDashboard("stats.productsNote")}`,
    },
    {
      title: tDashboard("stats.accountsTitle"),
      value: summary.stats.totalUsers,
      note: `${summary.stats.adminUsers} ${tDashboard("stats.accountsNote")}`,
    },
    {
      title: tDashboard("stats.categoriesTitle"),
      value: summary.stats.categoriesCount,
      note: `${summary.stats.booksCount} ${tDashboard("stats.categoriesNote")}`,
    },
  ];

  return (
    <Stack gap={3}>
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
              {tDashboard("systemStateTitle")}
            </Typography>
            <Typography sx={{ mt: 0.75, fontWeight: 800, fontSize: 28 }}>
              {summary.hasOrdersData
                ? sharedStatus.ordersWired
                : sharedStatus.ordersPending}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {tDashboard("systemStateDescription")}
            </Typography>
          </Paper>
        }
      />

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
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            note={stat.note}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1.3fr 1fr" },
          gap: 3,
        }}
      >
        <AdminSectionCard
          title={tDashboard("recentProducts.title")}
          description={tDashboard("recentProducts.description")}
          action={
            <Button
              href="/admin/products"
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            >
              {tDashboard("recentProducts.action")}
            </Button>
          }
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {tDashboard("recentProducts.columns.name")}
                  </TableCell>
                  <TableCell>
                    {tDashboard("recentProducts.columns.category")}
                  </TableCell>
                  <TableCell>
                    {tDashboard("recentProducts.columns.price")}
                  </TableCell>
                  <TableCell>
                    {tDashboard("recentProducts.columns.status")}
                  </TableCell>
                  <TableCell align="right">
                    {tDashboard("recentProducts.columns.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summary.recentProducts.map((product) => (
                  <TableRow key={product.productId} hover>
                    <TableCell>
                      <Stack gap={0.5}>
                        <Typography fontWeight={700}>
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.slug}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.categoryLabel}</TableCell>
                    <TableCell>{product.priceLabel}</TableCell>
                    <TableCell>
                      <AdminStatusChip
                        label={
                          product.isActive
                            ? sharedStatus.active
                            : sharedStatus.hidden
                        }
                        tone={product.isActive ? "success" : "neutral"}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        href={`/admin/products/${product.productId}/edit`}
                        variant="outlined"
                      >
                        {tShared("actions.edit")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </AdminSectionCard>

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
            {summary.recentCustomers.map((customer) => (
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
                      {customer.name || tShared("placeholders.noName")}
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
                      {formatAdminDate(customer.createdAt, locale)}
                    </Typography>
                  </Box>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <AdminStatusChip
                      label={
                        customer.isAdmin
                          ? sharedStatus.admin
                          : sharedStatus.user
                      }
                      tone={customer.isAdmin ? "accent" : "neutral"}
                    />
                    {customer.authProviders.map((provider) => (
                      <AdminStatusChip
                        key={provider}
                        label={getAdminAuthProviderLabel(
                          provider,
                          sharedStatus.authProviders,
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
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "1fr 1fr" },
          gap: 3,
        }}
      >
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
            {summary.categories.map((category) => (
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
                          ? sharedStatus.active
                          : sharedStatus.hidden
                      }
                      tone={category.isActive ? "success" : "neutral"}
                    />
                    <AdminStatusChip
                      label={
                        category.visibleInHomeTabs
                          ? sharedStatus.homeTabs
                          : sharedStatus.shopOnly
                      }
                      tone={category.visibleInHomeTabs ? "info" : "neutral"}
                    />
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </AdminSectionCard>

        <AdminSectionCard
          title={tDashboard("orders.title")}
          description={tDashboard("orders.description")}
        >
          <AdminEmptyState
            title={tDashboard("orders.emptyTitle")}
            description={tDashboard("orders.emptyDescription")}
          />
        </AdminSectionCard>
      </Box>
    </Stack>
  );
};

export default AdminDashboardPage;