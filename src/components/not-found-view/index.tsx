"use client";

import { useLocale, useTranslations } from "next-intl";

import { StatusScreen } from "@/components/status-screen";
import { getLocalizedPath } from "@/utils";

export const NotFoundView = () => {
  const t = useTranslations("storefront.notFoundPage");
  const locale = useLocale();

  return (
    <StatusScreen
      showFloats
      emoji="🐷"
      code={t("code")}
      title={t("title")}
      text={t("text")}
      actions={[
        {
          kind: "link",
          label: t("primaryCta"),
          href: getLocalizedPath(locale, "/"),
          variant: "primary",
        },
        {
          kind: "link",
          label: t("secondaryCta"),
          href: getLocalizedPath(locale, "/shop"),
          variant: "ghost",
        },
      ]}
    />
  );
};
