"use client";

import { useTranslations } from "next-intl";

import { useOrderReview } from "@/hooks/useOrderReview";

import { ReviewButton } from "./review-button";
import { ReviewDialog } from "./review-dialog";
import type { OrderItemReviewProps } from "./types";

export const OrderItemReview = ({
  productId,
  productSlug,
  productTitle,
  productType,
  thumbnail,
  orderNumber,
  details,
  review,
}: OrderItemReviewProps) => {
  const t = useTranslations("accountPage.orderReview");
  const {
    isOpen,
    rating,
    text,
    status,
    errorMessage,
    hasSubmitted,
    openForm,
    closeForm,
    setRating,
    setText,
    submitForm,
  } = useOrderReview({ productId, productSlug });

  const isReviewed =
    hasSubmitted || (review !== null && review.status !== "rejected");

  return (
    <>
      <ReviewButton
        tone={isReviewed ? "done" : "accent"}
        label={isReviewed ? t("done") : t("button")}
        onClick={openForm}
      />

      <ReviewDialog
        isOpen={isOpen}
        productTitle={productTitle}
        productType={productType}
        thumbnail={thumbnail}
        caption={[t("orderLine", { number: orderNumber }), ...details].join(
          " · ",
        )}
        rating={rating}
        text={text}
        status={status}
        errorMessage={errorMessage}
        onRatingChange={setRating}
        onTextChange={setText}
        onSubmit={() => void submitForm()}
        onClose={closeForm}
      />
    </>
  );
};

export type { OrderItemReviewProps } from "./types";
