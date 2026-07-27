"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updateAdminReviewStatusAction } from "@/app/(admin)/admin/actions";
import type { ReviewStatus } from "@/types/reviews";

import type { AdminReviewStatusActionsProps } from "./types";

export const AdminReviewStatusActions = ({
  reviewId,
  status,
}: AdminReviewStatusActionsProps) => {
  const t = useTranslations("adminPage.reviews");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (nextStatus: ReviewStatus) => {
    startTransition(async () => {
      const result = await updateAdminReviewStatusAction(reviewId, nextStatus);
      if (result.ok) {
        router.refresh();
      }
    });
  };

  return (
    <>
      {status !== "approved" && (
        <Tooltip title={t("approve")}>
          <span>
            <IconButton
              size="small"
              color="success"
              disabled={isPending}
              onClick={() => handleUpdate("approved")}
              aria-label={t("approve")}
            >
              <CheckCircleOutlineIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
      {status !== "rejected" && (
        <Tooltip title={t("reject")}>
          <span>
            <IconButton
              size="small"
              color="warning"
              disabled={isPending}
              onClick={() => handleUpdate("rejected")}
              aria-label={t("reject")}
            >
              <BlockOutlinedIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export type { AdminReviewStatusActionsProps } from "./types";
