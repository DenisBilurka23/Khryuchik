import type { Metadata } from "next";
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

import { importPrintifyProductAction } from "@/app/(admin)/admin/actions";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
} from "@/components/admin-page-shared";
import { ImportPrintifyProductButton } from "@/components/admin-printify-page-view/import-product-button";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { getImportablePrintifyProducts } from "@/server/printify/services/printify-catalog.service";
import type { AdminPrintifyImportItem } from "@/types/admin";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tPrintify = await getTranslations({
    locale,
    namespace: "adminPage.printify",
  });

  return createAdminMetadata(
    tPrintify("title"),
    tPrintify("description"),
    locale,
  );
};

type AdminPrintifyPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const AdminPrintifyPage = async ({ searchParams }: AdminPrintifyPageProps) => {
  const { error } = await searchParams;
  const locale = await resolveLocale("admin");
  const tPrintify = await getTranslations({
    locale,
    namespace: "adminPage.printify",
  });

  let products: AdminPrintifyImportItem[] = [];
  let loadError: string | undefined;

  try {
    products = await getImportablePrintifyProducts();
  } catch (loadFailure) {
    console.error("Failed to load Printify products", loadFailure);
    loadError = tPrintify("loadFailed");
  }

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tPrintify("eyebrow")}
        title={tPrintify("title")}
        description={tPrintify("description")}
        actions={
          <Button href="/admin/products" variant="outlined">
            {tPrintify("backToProducts")}
          </Button>
        }
      />

      {error ? (
        <Alert severity="error">{`${tPrintify("importFailed")}: ${error}`}</Alert>
      ) : null}
      {loadError ? <Alert severity="error">{loadError}</Alert> : null}

      {!loadError && products.length === 0 ? (
        <AdminEmptyState
          title={tPrintify("emptyTitle")}
          description={tPrintify("emptyDescription")}
        />
      ) : null}

      {products.length > 0 ? (
        <AdminSectionCard
          title={tPrintify("sectionTitle")}
          description={`${tPrintify("sectionDescription")}: ${products.length}`}
        >
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{tPrintify("columns.product")}</TableCell>
                  <TableCell>{tPrintify("columns.variants")}</TableCell>
                  <TableCell align="right">
                    {tPrintify("columns.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.printifyProductId} hover>
                    <TableCell>
                      <Stack gap={0.5}>
                        <Typography fontWeight={700}>
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.printifyProductId}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{product.enabledVariantsCount}</TableCell>
                    <TableCell align="right">
                      {product.importedProductId ? (
                        <Button
                          href={`/admin/products/${product.importedProductId}/edit`}
                          size="small"
                          variant="text"
                        >
                          {tPrintify("openImported")}
                        </Button>
                      ) : (
                        <ImportPrintifyProductButton
                          printifyProductId={product.printifyProductId}
                          action={importPrintifyProductAction}
                          label={tPrintify("importButton")}
                          pendingLabel={tPrintify("importingButton")}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </AdminSectionCard>
      ) : null}
    </Stack>
  );
};

export default AdminPrintifyPage;
