"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { submitReview } from "@/client-api/reviews";
import { ORDER_REVIEW_CONFIRMATION_MS } from "@/constants/order";

import type {
  OrderReviewStatus,
  UseOrderReviewParams,
  UseOrderReviewResult,
} from "./useOrderReview.types";

export type {
  OrderReviewStatus,
  UseOrderReviewParams,
  UseOrderReviewResult,
} from "./useOrderReview.types";

export const useOrderReview = ({
  productId,
  productSlug,
}: UseOrderReviewParams): UseOrderReviewResult => {
  const t = useTranslations("accountPage.orderReview.errors");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<OrderReviewStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    },
    [],
  );

  const resolveErrorMessage = (code?: string) => {
    switch (code) {
      case "already_reviewed":
        return t("alreadyReviewed");
      case "not_delivered":
        return t("notDelivered");
      case "invalid_rating":
        return t("invalidRating");
      default:
        return t("generic");
    }
  };

  const openForm = () => {
    setRating(null);
    setText("");
    setStatus("idle");
    setErrorMessage(null);
    setIsOpen(true);
  };

  const closeForm = () => {
    if (status === "submitting") {
      return;
    }

    setIsOpen(false);
  };

  const submitForm = async () => {
    if (!rating) {
      setErrorMessage(t("invalidRating"));
      return;
    }

    setErrorMessage(null);
    setStatus("submitting");

    const response = await submitReview({
      productId,
      productSlug,
      rating,
      text: text.trim(),
    });

    if (response.ok && response.data?.ok) {
      setStatus("success");
      setHasSubmitted(true);
      closeTimeout.current = setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, ORDER_REVIEW_CONFIRMATION_MS);
      return;
    }

    setErrorMessage(resolveErrorMessage(response.data?.error));
    setStatus("idle");
  };

  return {
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
  };
};
