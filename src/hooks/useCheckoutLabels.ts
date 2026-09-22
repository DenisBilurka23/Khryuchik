"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { UseCheckoutLabelsResult } from "./useCheckoutLabels.types";

export const useCheckoutLabels = (): UseCheckoutLabelsResult => {
  const t = useTranslations("storefront.checkoutPage");

  return useMemo(
    () => ({
      eyebrow: t("eyebrow"),
      title: t("title"),
      lead: t("lead"),
      breadcrumbs: t.raw(
        "breadcrumbs",
      ) as UseCheckoutLabelsResult["breadcrumbs"],
      contactTitle: t("contactTitle"),
      shippingTitle: t("shippingTitle"),
      paymentTitle: t("paymentTitle"),
      summaryTitle: t("summaryTitle"),
      shippingMethod: t.raw(
        "shippingMethod",
      ) as UseCheckoutLabelsResult["shippingMethod"],
      fields: t.raw("fields") as UseCheckoutLabelsResult["fields"],
      savedAddressesTitle: t("savedAddressesTitle"),
      newAddressOption: t("newAddressOption"),
      savedAddressIncomplete: t.raw(
        "savedAddressIncomplete",
      ) as UseCheckoutLabelsResult["savedAddressIncomplete"],
      paymentMethods: t.raw(
        "paymentMethods",
      ) as UseCheckoutLabelsResult["paymentMethods"],
      summary: t.raw("summary") as UseCheckoutLabelsResult["summary"],
      submit: t.raw("submit") as UseCheckoutLabelsResult["submit"],
      errors: t.raw("errors") as UseCheckoutLabelsResult["errors"],
      fieldErrors: t.raw(
        "fieldErrors",
      ) as UseCheckoutLabelsResult["fieldErrors"],
      regionUnavailable: t("regionUnavailable"),
      emptyState: t.raw("emptyState") as UseCheckoutLabelsResult["emptyState"],
    }),
    [t],
  );
};
