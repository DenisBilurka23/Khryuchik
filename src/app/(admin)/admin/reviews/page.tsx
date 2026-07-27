import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import { deleteAdminReviewAction } from "@/app/(admin)/admin/actions";
import {
  AdminReviewDeleteButton,
  AdminReviewStatusActions,
} from "@/components/admin-reviews-page-view";
import {
  AdminEmptyState,
  AdminPageHero,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import type { AdminStatusChipTone } from "@/components/admin-page-shared";
import { createAdminMetadata } from "@/server/admin/metadata";
import { resolveLocale } from "@/server/i18n/request-locale";
import { getAdminReviews } from "@/server/reviews/services/reviews.service";
import type { AdminPageDictionary } from "@/i18n/types";
import type { ReviewStatus } from "@/types/reviews";

type ReviewColumns = AdminPageDictionary["reviews"]["columns"];

const statusToneByStatus: Record<ReviewStatus, AdminStatusChipTone> = {
  pending: "warning",
  approved: "success",
  rejected: "neutral",
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await resolveLocale("admin");
  const tReviews = await getTranslations({
    locale,
    namespace: "adminPage.reviews",
  });

  return createAdminMetadata(
    tReviews("title"),
    tReviews("description"),
    locale,
  );
};

const AdminReviewsPage = async () => {
  const locale = await resolveLocale("admin");
  const tReviews = await getTranslations({
    locale,
    namespace: "adminPage.reviews",
  });
  const reviews = await getAdminReviews();

  const columns = tReviews.raw("columns") as ReviewColumns;
  const statusLabels = tReviews.raw("statusLabels") as Record<string, string>;

  return (
    <Stack gap={3}>
      <AdminPageHero
        eyebrow={tReviews("eyebrow")}
        title={tReviews("title")}
        description={tReviews("description")}
      />

      <AdminSectionCard
        title={tReviews("sectionTitle")}
        description={tReviews("sectionDescription")}
      >
        {reviews.length === 0 ? (
          <AdminEmptyState
            title={tReviews("emptyTitle")}
            description={tReviews("emptyDescription")}
          />
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{columns.author}</TableCell>
                  <TableCell>{columns.product}</TableCell>
                  <TableCell>{columns.rating}</TableCell>
                  <TableCell>{columns.review}</TableCell>
                  <TableCell>{columns.status}</TableCell>
                  <TableCell>{columns.createdAt}</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((review) => (
                  <TableRow key={review.id} hover>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700 }}>
                        {review.author}
                      </Typography>
                    </TableCell>
                    <TableCell>{review.productSlug}</TableCell>
                    <TableCell>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {review.text}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <AdminStatusChip
                        label={statusLabels[review.status] ?? review.status}
                        tone={statusToneByStatus[review.status]}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(review.createdAt).toLocaleDateString(locale)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        justifyContent="flex-end"
                        spacing={0.5}
                      >
                        <AdminReviewStatusActions
                          reviewId={review.id}
                          status={review.status}
                        />
                        <AdminReviewDeleteButton
                          reviewId={review.id}
                          action={deleteAdminReviewAction}
                          icon={
                            <DeleteOutlineOutlinedIcon key="delete-review-icon" />
                          }
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </AdminSectionCard>
    </Stack>
  );
};

export default AdminReviewsPage;
