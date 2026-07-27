"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdminApiAccess } from "@/server/admin/auth";
import {
  deleteReview,
  updateReviewStatus,
} from "@/server/reviews/repositories/reviews.repository";
import { REVIEW_STATUSES, type ReviewStatus } from "@/types/reviews";

type UpdateReviewStatusResult =
  | { ok: true }
  | { ok: false; error: "unauthorized" | "invalid_status" | "failed" };

const revalidateReviewDependentPaths = () => {
  revalidatePath("/admin/reviews");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/[lang]/products/[slug]", "page");
};

export const updateAdminReviewStatusAction = async (
  reviewId: string,
  status: ReviewStatus,
): Promise<UpdateReviewStatusResult> => {
  const session = await requireAdminApiAccess();
  if (!session) {
    return { ok: false, error: "unauthorized" };
  }

  if (!REVIEW_STATUSES.includes(status)) {
    return { ok: false, error: "invalid_status" };
  }

  try {
    await updateReviewStatus(reviewId, status);
  } catch (error) {
    console.error("updateAdminReviewStatusAction failed", error);
    return { ok: false, error: "failed" };
  }

  revalidateReviewDependentPaths();
  return { ok: true };
};

export const deleteAdminReviewAction = async (formData: FormData) => {
  const session = await requireAdminApiAccess();
  if (!session) {
    redirect("/login?callbackUrl=%2Fadmin%2Freviews");
  }

  const reviewId = formData.get("reviewId");
  if (typeof reviewId !== "string" || reviewId.length === 0) {
    return;
  }

  try {
    await deleteReview(reviewId);
  } catch (error) {
    console.error("deleteAdminReviewAction failed", error);
    return;
  }

  revalidateReviewDependentPaths();
};
