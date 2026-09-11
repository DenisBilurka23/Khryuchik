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

import { deleteAdminEntertainmentItemAction } from "@/app/(admin)/admin/actions";
import { DeleteEntertainmentItemButton } from "@/components/admin-entertainment-page-view/delete-item-button";
import {
  AdminEditLinkButton,
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { getAdminEntertainmentItems } from "@/server/admin/entertainment.service";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import {
  formatAdminDate,
  getAdminEntertainmentStatusTone,
} from "@/utils/admin";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tEntertainment = await getTranslations({
    locale,
    namespace: "adminPage.entertainment",
  });

  return createAdminMetadata(
    tEntertainment("title"),
    tEntertainment("description"),
    locale,
  );
};

type AdminEntertainmentPageProps = {
  searchParams: Promise<{ deleted?: string; error?: string }>;
};

const AdminEntertainmentPage = async ({
  searchParams,
}: AdminEntertainmentPageProps) => {
  const { deleted, error } = await searchParams;
  const locale = await resolveLocale("admin");
  const [items, tEntertainment, tForm, tCategories, tShared] =
    await Promise.all([
      getAdminEntertainmentItems(locale),
      getTranslations({ locale, namespace: "adminPage.entertainment" }),
      getTranslations({ locale, namespace: "adminPage.entertainmentForm" }),
      getTranslations({
        locale,
        namespace: "storefront.entertainmentCategories",
      }),
      getTranslations({ locale, namespace: "adminPage.shared" }),
    ]);

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tEntertainment("eyebrow")}
        title={tEntertainment("title")}
        description={tEntertainment("description")}
        actions={
          <Button href="/admin/entertainment/new" variant="contained">
            {tEntertainment("newItem")}
          </Button>
        }
      />

      {deleted === "1" ? (
        <Alert severity="success">{tEntertainment("deletedMessage")}</Alert>
      ) : null}
      {error ? (
        <Alert severity="error">{tEntertainment("deleteFailedMessage")}</Alert>
      ) : null}

      <AdminSectionCard
        title={tEntertainment("sectionTitle")}
        description={`${tEntertainment("sectionDescription")}: ${items.length}`}
      >
        {items.length === 0 ? (
          <AdminEmptyState
            title={tEntertainment("emptyTitle")}
            description={tEntertainment("emptyText")}
            action={
              <Button href="/admin/entertainment/new" variant="contained">
                {tEntertainment("newItem")}
              </Button>
            }
          />
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{tEntertainment("columns.item")}</TableCell>
                  <TableCell>{tEntertainment("columns.category")}</TableCell>
                  <TableCell>{tEntertainment("columns.type")}</TableCell>
                  <TableCell>{tEntertainment("columns.status")}</TableCell>
                  <TableCell>{tEntertainment("columns.sortOrder")}</TableCell>
                  <TableCell>{tEntertainment("columns.updated")}</TableCell>
                  <TableCell align="right">
                    {tEntertainment("columns.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.slug} hover>
                    <TableCell>
                      <Stack gap={0.5}>
                        <Typography fontWeight={700}>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.slug}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{tCategories(item.category)}</TableCell>
                    <TableCell>
                      {tEntertainment(`mediaTypes.${item.mediaType}`)}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        <AdminStatusChip
                          label={
                            item.isActive
                              ? tShared("status.active")
                              : tShared("status.hidden")
                          }
                          tone={item.isActive ? "success" : "neutral"}
                        />
                        {item.mediaStatus ? (
                          <AdminStatusChip
                            label={tForm(`videoStatus.${item.mediaStatus}`)}
                            tone={getAdminEntertainmentStatusTone(
                              item.mediaStatus,
                            )}
                          />
                        ) : null}
                        {item.visibleOnHome ? (
                          <AdminStatusChip
                            label={tEntertainment("onHomeLabel")}
                            tone="accent"
                          />
                        ) : null}
                      </Stack>
                    </TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
                    <TableCell>
                      {formatAdminDate(item.updatedAt, locale)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        gap={0.5}
                        justifyContent="flex-end"
                      >
                        <AdminEditLinkButton
                          href={`/admin/entertainment/${item.slug}/edit`}
                          size="small"
                        />
                        <DeleteEntertainmentItemButton
                          slug={item.slug}
                          action={deleteAdminEntertainmentItemAction}
                          icon={
                            <DeleteOutlineOutlinedIcon key="delete-entertainment-icon" />
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
        )}
      </AdminSectionCard>
    </Stack>
  );
};

export default AdminEntertainmentPage;
