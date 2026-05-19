import type { Metadata } from "next";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Alert,
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

import { DeleteProductButton } from "@/components/admin-products-page-view/delete-product-button";
import { EditProductButton } from "@/components/admin-products-page-view/edit-product-button";

import {
  AdminPageHero,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { deleteAdminProductAction } from "@/app/(admin)/admin/actions";
import { getAdminProducts } from "@/server/admin/catalog.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import {
  getAdminAvailabilityLabel,
  getAdminProductTypeLabel,
} from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tProducts = await getTranslations({
    locale,
    namespace: "adminPage.products",
  });

  return createAdminMetadata(
    tProducts("title"),
    tProducts("description"),
    locale,
  );
};

type AdminProductsPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

const AdminProductsPage = async ({ searchParams }: AdminProductsPageProps) => {
  const { deleted } = await searchParams;
  const locale = await resolveLocale("admin");
  const [products, tProducts, tShared] = await Promise.all([
    getAdminProducts(locale),
    getTranslations({ locale, namespace: "adminPage.products" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
  ]);
  const placeholders = {
    emptyValue: tShared("placeholders.emptyValue"),
  };
  const status = {
    active: tShared("status.active"),
    hidden: tShared("status.hidden"),
    availability: {
      in_stock: tShared("status.availability.in_stock"),
      out_of_stock: tShared("status.availability.out_of_stock"),
      preorder: tShared("status.availability.preorder"),
      made_to_order: tShared("status.availability.made_to_order"),
    },
    productTypes: {
      book: tShared("status.productTypes.book"),
      merch: tShared("status.productTypes.merch"),
    },
  };

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tProducts("eyebrow")}
        title={tProducts("title")}
        description={tProducts("description")}
        actions={
          <Button href="/admin/products/new" variant="contained">
            {tProducts("newProduct")}
          </Button>
        }
      />
      {deleted === "1" ? (
        <Alert severity="success">{tProducts("deletedMessage")}</Alert>
      ) : null}

      <AdminSectionCard
        title={tProducts("sectionTitle")}
        description={`${tProducts("sectionDescription")}: ${products.length}`}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{tProducts("columns.product")}</TableCell>
                <TableCell>{tProducts("columns.sku")}</TableCell>
                <TableCell>{tProducts("columns.type")}</TableCell>
                <TableCell>{tProducts("columns.category")}</TableCell>
                <TableCell>{tProducts("columns.price")}</TableCell>
                <TableCell>{tProducts("columns.status")}</TableCell>
                <TableCell>{tProducts("columns.sortOrder")}</TableCell>
                <TableCell align="right">
                  {tProducts("columns.action")}
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
                  <TableCell>
                    {product.sku || placeholders.emptyValue}
                  </TableCell>
                  <TableCell>
                    {getAdminProductTypeLabel(
                      product.type,
                      status.productTypes,
                    )}
                  </TableCell>
                  <TableCell>{product.categoryLabel}</TableCell>
                  <TableCell>{product.priceLabel}</TableCell>
                  <TableCell>
                    <Stack direction="row" gap={1} flexWrap="wrap">
                      <AdminStatusChip
                        label={product.isActive ? status.active : status.hidden}
                        tone={product.isActive ? "success" : "neutral"}
                      />
                      <AdminStatusChip
                        label={getAdminAvailabilityLabel(
                          product.availability,
                          status.availability,
                        )}
                        tone={
                          product.availability === "in_stock"
                            ? "success"
                            : product.availability === "preorder"
                              ? "info"
                              : "warning"
                        }
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>{product.sortOrder}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" gap={0.5} justifyContent="flex-end">
                      <EditProductButton
                        href={`/admin/products/${product.productId}/edit`}
                        size="small"
                      />
                      <DeleteProductButton
                        productId={product.productId}
                        action={deleteAdminProductAction}
                        icon={
                          <DeleteOutlineOutlinedIcon key="delete-product-icon" />
                        }
                        iconOnly
                        size="small"
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </AdminSectionCard>
    </Stack>
  );
};

export default AdminProductsPage;
