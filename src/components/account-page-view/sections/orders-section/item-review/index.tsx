"use client";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { useTranslations } from "next-intl";

import { useOrderReview } from "@/hooks/useOrderReview";

import { OrderActionButton } from "../order-action-button";
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
      <OrderActionButton
        tone={isReviewed ? "done" : "accent"}
        label={isReviewed ? t("done") : t("button")}
        icon={isReviewed ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
        onClickAction={openForm}
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
        onRatingChangeAction={setRating}
        onTextChangeAction={setText}
        onSubmitAction={() => void submitForm()}
        onCloseAction={closeForm}
      />
    </>
  );
};

export type { OrderItemReviewProps } from "./types";
