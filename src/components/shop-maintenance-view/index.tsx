"use client";

import { useLocale, useTranslations } from "next-intl";

import { StatusScreen } from "@/components/status-screen";
import { getLocalizedPath } from "@/utils";

export const ShopMaintenanceView = () => {
  const t = useTranslations("storefront.maintenancePage");
  const locale = useLocale();

  return (
    <StatusScreen
      showFloats
      emoji="🧹"
      blobTone="warm"
      title={t("title")}
      text={t("text")}
      actions={[
        {
          kind: "link",
          label: t("primaryCta"),
          href: getLocalizedPath(locale, "/shop"),
          variant: "primary",
        },
        {
          kind: "link",
          label: t("secondaryCta"),
          href: getLocalizedPath(locale, "/"),
          variant: "ghost",
        },
      ]}
      footer={t("footer")}
    />
  );
};
