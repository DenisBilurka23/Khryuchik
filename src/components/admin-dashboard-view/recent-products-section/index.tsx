import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";

import type { AdminRecentProductsSectionProps } from "../types";

export const AdminRecentProductsSection = async ({
  products,
  locale,
}: AdminRecentProductsSectionProps) => {
  const [tDashboard, tShared] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
  ]);

  return (
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
              <TableCell>{tDashboard("recentProducts.columns.name")}</TableCell>
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
            {products.map((product) => (
              <TableRow key={product.productId} hover>
                <TableCell>
                  <Stack gap={0.5}>
                    <Typography fontWeight={700}>{product.title}</Typography>
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
                        ? tShared("status.active")
                        : tShared("status.hidden")
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
  );
};
